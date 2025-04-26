const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.API_KEY || '0572badc-cbc8-4936-be91-53fa51ade77f';
const BASE_URL = 'https://data.moenv.gov.tw/api/v2/cfp_p_02';

// 創建緩存來存儲API響應，有效期1小時
const apiCache = new NodeCache({ stdTTL: 3600 });

// 中間件
app.use(cors({
  origin: 'http://localhost:8080' // 允許你的前端網址存取
}));
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
      // 將數據分類為範疇一、二、三
      const records = response.data.records;
      const processedData = {
        records: records,
        scope1: [],
        scope2: [],
        scope3: [],
        years: {
          electricity: [],
          water: []
        }
      };
      
      // 定義範疇一的關鍵字
      const scope1Keywords = [
        '汽油', '柴油', '天然氣', '液化石油氣', 'LPG', '重油', '煤炭', '生質燃料',
        '冷媒', '滅火器', '農業活動', '森林管理', '製程排放'
      ];
      
      // 定義範疇二的關鍵字
      const scope2Keywords = [
        '電力', '自來水', '外購蒸汽', '外購熱力'
      ];
      
      // 處理年份信息，主要是電力和自來水
      const electricityFactors = records.filter(item => item.name.includes('電力'));
      const waterFactors = records.filter(item => item.name.includes('自來水'));
      
      // 提取電力係數的年份
      const electricityYears = new Set();
      electricityFactors.forEach(item => {
        const match = item.name.match(/(\d{4})/);
        if (match) {
          electricityYears.add(match[1]);
        }
      });
      
      // 提取自來水係數的年份
      const waterYears = new Set();
      waterFactors.forEach(item => {
        const match = item.name.match(/(\d{4})/);
        if (match) {
          waterYears.add(match[1]);
        }
      });
      
      processedData.years.electricity = Array.from(electricityYears).sort().reverse();
      processedData.years.water = Array.from(waterYears).sort().reverse();
      
      // 分類排放係數
      records.forEach(item => {
        // 檢查是否屬於範疇一
        if (scope1Keywords.some(keyword => item.name.includes(keyword))) {
          processedData.scope1.push(item);
        }
        // 檢查是否屬於範疇二
        else if (scope2Keywords.some(keyword => item.name.includes(keyword))) {
          processedData.scope2.push(item);
        }
        // 其餘歸類為範疇三
        else {
          processedData.scope3.push(item);
        }
      });
      
      // 將數據存入緩存
      apiCache.set(cacheKey, processedData);
      return res.json(processedData);
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