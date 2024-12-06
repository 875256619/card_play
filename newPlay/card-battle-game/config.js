export const API_URL = import.meta.env.PROD 
  ? '' // 生产环境使用相对路径
  : 'http://localhost:3000'; // 开发环境