// tests/posts.test.ts
/**
 * Robust integration-like tests for the Node cache service.
 * - Uses an in-memory Promise-based Redis mock so get/set/del/setEx return Promises.
 * - Mocks mysql2/promise and controls DB behavior via globals.
 */

jest.mock('redis', () => {
    // Simple in-memory Promise-based mock that matches redis v4 async API
    return {
        createClient: () => {
            const store = new Map<string, string>();
            return {
                connect: async () => {},
                quit: async () => {},
                disconnect: async () => {},
                // get returns null when missing (like redis)
                get: async (key: string) => {
                    return store.has(key) ? store.get(key) as string : null;
                },
                set: async (key: string, value: string) => {
                    store.set(key, value);
                    return 'OK';
                },
                setEx: async (key: string, _ttl: number, value: string) => {
                    store.set(key, value);
                    return 'OK';
                },
                del: async (key: string) => {
                    return store.delete(key) ? 1 : 0;
                },
                flushdb: (cb?: any) => {
                    store.clear();
                    if (typeof cb === 'function') cb();
                }
            };
        }
    };
});

jest.mock('mysql2/promise', () => {
    return {
        createPool: () => {
            return {
                query: async () => {
                    // If test forces a DB failure:
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((global as any).__MYSQL_MOCK_SHOULD_THROW) {
                        throw new Error('Mocked DB failure');
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const r = (global as any).__MYSQL_MOCK_RESULT;
                    if (r) return r;
                    return [[], []];
                },
                end: async () => {}
            };
        }
    };
});

import request from 'supertest';
// @ts-ignore
import app from '../src/server';

describe('Node.js Redis Cache API — expanded tests (stable Redis mock)', () => {
    const serverAny = app as any;

    const resetMysqlMock = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).__MYSQL_MOCK_RESULT = undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).__MYSQL_MOCK_SHOULD_THROW = undefined;
    };

    beforeEach(async () => {
        resetMysqlMock();

        // clear cache
        const rc = serverAny.redisClient;
        if (rc && typeof rc.del === 'function') {
            try {
                await rc.del('posts');
            } catch {
                if (typeof rc.flushdb === 'function') {
                    await new Promise<void>((res) => rc.flushdb(() => res()));
                }
            }
        }
    });

    afterAll(async () => {
        // cleanup clients
        const rc = serverAny.redisClient;
        if (rc) {
            try {
                if (typeof rc.quit === 'function') await rc.quit();
                if (typeof rc.disconnect === 'function') await rc.disconnect();
            } catch {}
        }
        const pool = serverAny.db;
        if (pool && typeof pool.end === 'function') {
            try { await pool.end(); } catch {}
        }
    });

    it('GET /cache/posts => returns DB rows and caches them (shape + caching)', async () => {
        const sampleRows = [
            {
                id: 1,
                title: 'Hello',
                content: 'World',
                user_id: 2,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).__MYSQL_MOCK_RESULT = [sampleRows, []];

        const res = await request(app).get('/cache/posts');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            content: expect.any(String),
            created_at: expect.any(String),
        }));

        const rc = serverAny.redisClient;
        const cached = await rc.get('posts');
        expect(cached).not.toBeUndefined();
        // cached should be a JSON string
        expect(typeof cached).toBe('string');
        const parsed = JSON.parse(cached);
        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed[0]).toEqual(expect.objectContaining({ id: 1, title: 'Hello' }));
    });

    it('POST /cache/posts should invalidate cache key', async () => {
        const rc = serverAny.redisClient;
        await rc.set('posts', JSON.stringify([{ id: 99, title: 'cached' }]));
        const before = await rc.get('posts');
        expect(before).not.toBeNull();

        const res = await request(app).post('/cache/posts');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Cache invalidated' });

        const after = await rc.get('posts');
        expect(after).toBeNull();
    });

    it('GET /cache/posts should serve cached data (avoids DB query)', async () => {
        const rc = serverAny.redisClient;
        const cachedPayload = [{ id: 3, title: 'from-cache', content: 'x', created_at: new Date().toISOString() }];
        await rc.set('posts', JSON.stringify(cachedPayload));

        const pool = serverAny.db;
        const querySpy = jest.spyOn(pool, 'query');

        const res = await request(app).get('/cache/posts');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: 3 })]));

        expect(querySpy).not.toHaveBeenCalled();
        querySpy.mockRestore();
    });

    it('GET /cache/posts => handles Redis.get throwing (server error)', async () => {
        const rc = serverAny.redisClient;
        const origGet = rc.get;
        rc.get = async () => { throw new Error('Redis read failure'); };

        const res = await request(app).get('/cache/posts');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Server error' });

        rc.get = origGet;
    });

    it('GET /cache/posts => handles DB failure (server error)', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).__MYSQL_MOCK_SHOULD_THROW = true;

        const res = await request(app).get('/cache/posts');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Server error' });

        resetMysqlMock();
    });

    it('POST /cache/posts => gracefully handles redis.del failure', async () => {
        const rc = serverAny.redisClient;
        const origDel = rc.del;
        rc.del = async () => { throw new Error('Del failed'); };

        const res = await request(app).post('/cache/posts');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Failed to invalidate cache' });

        rc.del = origDel;
    });

    it('concurrent GETs: first populates cache, subsequent read from cache (race-resilient)', async () => {
        const sampleRows = [
            { id: 42, title: 'concurrent', content: 'c', created_at: new Date().toISOString() },
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).__MYSQL_MOCK_RESULT = [sampleRows, []];

        const pool = serverAny.db;
        const querySpy = jest.spyOn(pool, 'query');

        // make parallel requests
        const [r1, r2, r3, r4] = await Promise.all([
            request(app).get('/cache/posts'),
            request(app).get('/cache/posts'),
            request(app).get('/cache/posts'),
            request(app).get('/cache/posts'),
        ]);

        expect(r1.status).toBe(200);
        expect(r2.status).toBe(200);
        expect(r3.status).toBe(200);
        expect(r4.status).toBe(200);

        // responses should be consistent
        expect(r1.body).toEqual(r2.body);
        expect(r2.body).toEqual(r3.body);

        // DB must have been hit at least once while populating cache
        expect(querySpy.mock.calls.length).toBeGreaterThanOrEqual(1);
        querySpy.mockRestore();
        resetMysqlMock();
    });
});
