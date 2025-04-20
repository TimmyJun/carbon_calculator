<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <h1 class="logo">碳足跡計算器</h1>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">首頁</router-link>
          <router-link to="/calculator" class="nav-link">碳排放計算</router-link>
          <router-link to="/about" class="nav-link">關於系統</router-link>
        </nav>
      </div>
    </div>
  </header>

  <main class="app-main">
    <div class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </main>

  <footer class="app-footer">
    <div class="container">
      <p>© {{ currentYear }} 碳足跡計算器 - 支持 ISO 14064 碳盤查標準</p>
      <p>數據來源：<a href="https://data.moenv.gov.tw/dataset/detail/CFP_P_02" target="_blank">環境部環境資料開放平臺</a></p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'App',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style lang="scss">
.app-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
  }
  
  .main-nav {
    display: flex;
    gap: 1.5rem;
    
    @media (max-width: 768px) {
      margin-top: 1rem;
    }
    
    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -4px;
        left: 0;
        background-color: white;
        transition: width 0.3s;
      }
      
      &:hover::after,
      &.router-link-active::after {
        width: 100%;
      }
    }
  }
}

.app-main {
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
}

.app-footer {
  background-color: #f5f5f5;
  color: var(--text-secondary);
  padding: 1.5rem 0;
  text-align: center;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 