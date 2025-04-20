<template>
  <div class="about-page">
    <h1 class="page-title">關於系統</h1>
    
    <div class="card">
      <h2 class="section-title">系統介紹</h2>
      <p>
        碳足跡計算器是一套專為中小型企業設計的碳排放計算工具，旨在協助企業簡便地完成產品碳足跡盤查，符合 ISO 14064 國際標準要求。
      </p>
      <p>
        本系統採用環境部提供的官方碳排放係數資料，確保計算結果的權威性與準確性。透過簡潔的使用者介面和明確的引導流程，使企業能夠輕鬆進行溫室氣體排放的量化工作。
      </p>
    </div>
    
    <div class="card">
      <h2 class="section-title">ISO 14064 簡介</h2>
      <p>
        ISO 14064 是國際標準化組織（ISO）制定的溫室氣體盤查標準，主要分為三個部分：
      </p>
      <ul>
        <li>
          <strong>ISO 14064-1</strong>：針對組織層級的溫室氣體排放和移除的量化與報告
        </li>
        <li>
          <strong>ISO 14064-2</strong>：專案層級的溫室氣體減量或增量的量化、監測與報告
        </li>
        <li>
          <strong>ISO 14064-3</strong>：溫室氣體宣告之確證與查證的規範及指引
        </li>
      </ul>
      <p>
        本系統主要基於 ISO 14064-1 的要求，協助企業進行組織層級的碳排放量化與管理。
      </p>
    </div>
    
    <div class="card">
      <h2 class="section-title">範疇說明</h2>
      
      <div class="scope-explanation">
        <h3>範疇一：直接溫室氣體排放</h3>
        <p>
          來自於企業所擁有或控制的排放源產生的直接溫室氣體排放。例如：
        </p>
        <ul>
          <li>固定燃燒源（鍋爐、爐具等）</li>
          <li>移動燃燒源（公司車輛等）</li>
          <li>製程排放（生產過程中的化學反應等）</li>
          <li>逸散性排放（制冷劑泄漏、消防設備等）</li>
        </ul>
      </div>
      
      <div class="scope-explanation">
        <h3>範疇二：能源間接溫室氣體排放</h3>
        <p>
          因使用外購的電力、熱力、蒸汽等能源而導致的間接溫室氣體排放。例如：
        </p>
        <ul>
          <li>外購電力</li>
          <li>外購蒸汽</li>
          <li>外購熱力（熱水、熱空氣等）</li>
        </ul>
      </div>
      
      <div class="scope-explanation">
        <h3>範疇三：其他間接溫室氣體排放</h3>
        <p>
          企業價值鏈上下游的間接排放，包括但不限於：
        </p>
        <ul>
          <li>上游原料採購與運輸</li>
          <li>下游產品運輸與配送</li>
          <li>商務差旅</li>
          <li>員工通勤</li>
          <li>廢棄物處理與回收</li>
          <li>外包活動</li>
          <li>產品使用與廢棄階段</li>
        </ul>
      </div>
    </div>
    
    <div class="card">
      <h2 class="section-title">數據來源</h2>
      <p>
        本系統使用的碳排放係數來自於<a href="https://data.moenv.gov.tw/dataset/detail/CFP_P_02" target="_blank">環境部環境資料開放平臺</a>的公開資料。
      </p>
      <p>
        數據集名稱：碳足跡排放係數（CFP_P_02）
      </p>
      <p>
        使用的 API 連結：<code>https://data.moenv.gov.tw/api/v2/cfp_p_02</code>
      </p>
    </div>
    
    <div class="card">
      <h2 class="section-title">聯絡我們</h2>
      <p>
        若您在使用過程中有任何問題或建議，歡迎與我們聯繫：
      </p>
      <p>
        <i class="el-icon-message"></i> 電子郵件：support@carbon-calculator.com
      </p>
      <p>
        <i class="el-icon-phone"></i> 聯絡電話：(02) 2222-3333
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style lang="scss" scoped>
.about-page {
  .card {
    margin-bottom: 2rem;
  }
  
  ul {
    padding-left: 1.5rem;
    margin: 1rem 0;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
  
  .scope-explanation {
    margin-bottom: 1.5rem;
    
    h3 {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }
    
    ul {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.5rem;
      
      @media (max-width: 768px) {
        display: block;
      }
    }
  }
  
  code {
    background-color: #f5f7fa;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 