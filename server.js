const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY || '0572badc-cbc8-4936-be91-53fa51ade77f';
const BASE_URL = 'https://data.moenv.gov.tw/api/v2/cfp_p_02';

// 創建緩存來存儲API響應，有效期1小時
const apiCache = new NodeCache({ stdTTL: 3600 });

// 中間件
app.use(cors());
app.use(express.json());

// API路由：獲取碳足跡排放係數
app.get('/api/carbon-factors', async (req, res) => {
  try {
    // 檢查緩存中是否有數據
    const cacheKey = 'carbon-factors';
    const cachedData = apiCache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // 如果緩存中沒有數據，請求API
    const response = await axios.get(`${BASE_URL}?api_key=${API_KEY}&format=json`);
    
    if (response.data && response.data.records) {
      // 將數據存入緩存
      apiCache.set(cacheKey, response.data);
      return res.json(response.data);
    } else {
      throw new Error('無效的API響應格式');
    }
  } catch (error) {
    console.error('獲取碳足跡係數時出錯:', error.message);
    res.status(500).json({ error: '獲取數據時出錯', details: error.message });
  }
});

// 服務靜態文件（前端構建）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

// 啟動服務器
app.listen(PORT, () => {
  console.log(`服務器運行於端口 ${PORT}`);
}); 