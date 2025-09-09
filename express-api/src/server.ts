import express from 'express';
import dotenv from 'dotenv';
import redis from 'redis';
import mysql from 'mysql2/promise';


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
    const cached = await redisClient.get('posts');
    if (cached) return res.json(JSON.parse(cached));

    const [rows] = await db.query('SELECT * FROM posts');
    await redisClient.set('posts', JSON.stringify(rows));
    res.json(rows);
});

app.get('/cache/posts/:id', async (req, res) => {
    const {id} = req.params;
    const cached = await redisClient.get(`post:${id}`);
    if (cached) return res.json(JSON.parse(cached));

    const [rows]: any[] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({message: 'Not found'});

    await redisClient.set(`post:${id}`, JSON.stringify(rows[0]));
    res.json(rows[0]);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));