// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { networkInterfaces } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));

// 处理所有路由请求
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  
  // 显示所有可用的网络接口
  const nets = networkInterfaces();
  console.log('\nAvailable on:');
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`  http://${net.address}:${PORT}`);
      }
    }
  }
});