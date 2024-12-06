// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// API 路由
app.get('/api/game', (req, res) => {
    // 你的游戏逻辑
});

// 所有其他请求返回前端应用
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});