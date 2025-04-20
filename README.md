# 碳足跡計算器

企業碳排放量計算工具，為中小型企業提供符合 ISO 14064 標準的碳盤查解決方案。

## 功能特點

- **全面的碳足跡計算**：支援 ISO 14064 中範疇一、二、三的計算
- **即時數據更新**：串接環境部碳排放係數資料庫，確保使用最新數據
- **簡潔的使用者介面**：專為中小企業設計的直觀操作流程
- **符合國際標準**：遵循 ISO 14064 國際碳盤查標準
- **詳細的結果報告**：提供企業總排放量和單位產品碳足跡計算

## 系統架構

- 前端：Vue.js 3 + Element Plus
- 後端：Node.js + Express
- 資料來源：環境部碳足跡排放係數 API

## 安裝指南

### 前置需求

- Node.js 14+ 和 npm 6+
- 環境部 API 金鑰 (已內建在設定中)

### 安裝步驟

1. 克隆代碼庫：

```bash
git clone [repository-url]
cd carbon-calculator
```

2. 安裝後端依賴：

```bash
npm install
```

3. 安裝前端依賴：

```bash
cd client
npm install
cd ..
```

4. 創建環境配置文件：

創建 `.env` 文件（已包含在代碼庫中），必要時可修改其中的 API 金鑰：

```
API_KEY=0572badc-cbc8-4936-be91-53fa51ade77f
NODE_ENV=development
PORT=5000
```

## 運行系統

### 開發模式

同時運行前端和後端：

```bash
npm run dev:full
```

或分別運行：

- 運行後端：

```bash
npm run dev
```

- 運行前端：

```bash
cd client
npm run serve
```

### 生產模式

1. 構建前端：

```bash
cd client
npm run build
cd ..
```

2. 啟動生產服務器：

```bash
NODE_ENV=production npm start
```

## 使用方法

1. 訪問 http://localhost:8080 (開發模式) 或部署的網址
2. 輸入企業基本信息和產品產量
3. 分別填寫範疇一、二、三的排放源數據
4. 點擊「計算碳排放量」獲取結果
5. 查看企業總排放量和單位產品碳足跡

## 數據來源

- 環境部環境資料開放平臺：[https://data.moenv.gov.tw/dataset/detail/CFP_P_02](https://data.moenv.gov.tw/dataset/detail/CFP_P_02)

## 授權協議

MIT License 