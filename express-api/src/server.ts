import express from 'express';
import dotenv from 'dotenv';
import redis from 'redis';
import mysql, {RowDataPacket} from 'mysql2/promise';


dotenv.config();


const PORT = 3000;

const app = express();
app.use(express.json());

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.connect().then(() => console.log("Connected to Redis"));

const db = mysql.createPool({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
});


app.get('/cache/posts', async (req, res) => {
    try {
        const cached = await redisClient.get('posts');
        console.log("Cached posts:", cached);
        if (cached) return res.json(JSON.parse(cached));

        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM posts');
        if (rows.length > 0) {
            await redisClient.setEx('posts', 60, JSON.stringify(rows));
        }

        console.log("DB rows:", rows);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


app.get('/cache/posts/:id', async (req, res) => {
    const {id} = req.params;
    const cached = await redisClient.get(`post:${id}`);
    if (cached) return res.json(JSON.parse(cached));

    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({message: 'Not found'});


    await redisClient.set(`post:${id}`, JSON.stringify(rows[0]));
    res.json(rows[0]);
});

app.post('/cache/posts', async (req, res) => {
    try {
        //Invalidate cache
        // Joke: There are 4 hard problems in computer science: cache invalidation, naming things, and off-by-one errors.
        await redisClient.del('posts');
        res.status(200).json({ message: "Cache invalidated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to invalidate cache" });
    }
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));