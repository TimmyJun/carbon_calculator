<template>
  <div class="home-page">
    <div class="hero-section">
      <h1 class="hero-title">企業碳足跡計算工具</h1>
      <p class="hero-description">
        符合 ISO 14064 標準的碳排放計算系統，為中小型企業提供簡便易用的碳盤查解決方案
      </p>
      <router-link to="/calculator" class="el-button el-button--primary el-button--large">
        開始計算
      </router-link>
    </div>

    <div class="features-section">
      <div class="card feature-card">
        <div class="feature-icon">
          <i class="el-icon-data-analysis"></i>
        </div>
        <h2>範疇一、二、三全面計算</h2>
        <p>
          支援 ISO 14064 標準中的三大範疇，包括直接排放、能源間接排放以及其他間接排放，全面評估您企業的碳足跡。
        </p>
      </div>

      <div class="card feature-card">
        <div class="feature-icon">
          <i class="el-icon-odometer"></i>
        </div>
        <h2>即時更新數據</h2>
        <p>
          連接環境部官方碳排放係數資料庫，確保使用最新、最準確的排放係數進行計算。
        </p>
      </div>

      <div class="card feature-card">
        <div class="feature-icon">
          <i class="el-icon-document"></i>
        </div>
        <h2>符合國際標準</h2>
        <p>
          遵循 ISO 14064 國際標準，讓您的碳盤查結果獲得國際認可，提升企業永續發展形象。
        </p>
      </div>
    </div>

    <div class="how-it-works">
      <h2 class="section-title text-center">如何使用</h2>
      <div class="steps-container">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>輸入企業基本資料</h3>
            <p>填寫您的企業資訊和產品產量數據</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>選擇排放源並輸入數據</h3>
            <p>根據企業實際情況，填寫範疇一、二、三的能源使用與活動數據</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>獲取計算結果</h3>
            <p>系統自動計算總碳排放量與單位產品碳足跡，並可導出報告</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style lang="scss" scoped>
.home-page {
  .hero-section {
    text-align: center;
    padding: 3rem 0;
    
    .hero-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }
    
    .hero-description {
      font-size: 1.2rem;
      max-width: 700px;
      margin: 0 auto 2rem;
      color: var(--text-secondary);
    }
  }
  
  .features-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
    
    .feature-card {
      text-align: center;
      padding: 2rem;
      
      .feature-icon {
        font-size: 3rem;
        color: var(--primary-color);
        margin-bottom: 1.5rem;
      }
      
      h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
      }
      
      p {
        color: var(--text-secondary);
      }
    }
  }
  
  .how-it-works {
    padding: 3rem 0;
    
    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 800px;
      margin: 2rem auto 0;
    }
    
    .step {
      display: flex;
      gap: 1.5rem;
      
      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        font-weight: 600;
        flex-shrink: 0;
      }
      
      .step-content {
        h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        p {
          color: var(--text-secondary);
        }
      }
    }
  }
}
</style> 