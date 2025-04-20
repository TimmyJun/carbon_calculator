<template>
  <div class="calculator-page">
    <h1 class="page-title">碳排放計算器</h1>
    
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      :closable="false"
      show-icon
      class="mb-4"
    />
    
    <div v-if="loading" class="loading-container">
      <el-skeleton style="width: 100%" :rows="10" animated />
    </div>
    
    <div v-else class="calculator-content">
      <!-- 基本信息 -->
      <div class="card">
        <h2 class="section-title">基本資訊</h2>
        <el-form :model="basicInfo" label-width="120px" label-position="left">
          <el-form-item label="企業名稱">
            <el-input v-model="basicInfo.companyName" placeholder="請輸入企業名稱"></el-input>
          </el-form-item>
          <el-form-item label="統一編號">
            <el-input v-model="basicInfo.companyId" placeholder="請輸入統一編號"></el-input>
          </el-form-item>
          <el-form-item label="報告年份">
            <el-date-picker
              v-model="basicInfo.reportYear"
              type="year"
              placeholder="選擇年份"
              format="YYYY 年"
              value-format="YYYY"
            />
          </el-form-item>
          <el-form-item label="產品名稱">
            <el-input v-model="basicInfo.productName" placeholder="請輸入產品名稱"></el-input>
          </el-form-item>
          <el-form-item label="總產量">
            <el-input-number v-model="basicInfo.productionUnits" :min="1" :precision="0" :step="100" class="production-input" />
          </el-form-item>
          <el-form-item label="產量單位">
            <el-input v-model="basicInfo.productionUnit" placeholder="如：箱、個、噸等"></el-input>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 範疇一：直接排放 -->
      <div class="card">
        <div class="scope-header">
          <h2 class="section-title">範疇一：直接排放</h2>
          <el-tooltip content="包括企業擁有或控制的排放源產生的直接溫室氣體排放，如鍋爐燃料燃燒、公司車輛等" placement="top">
            <el-button type="info" circle size="small">
              <el-icon><QuestionFilled /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        
        <div class="emission-sources">
          <div v-for="(source, index) in scope1Sources" :key="`scope1-${index}`" class="emission-source-item">
            <div class="source-header">
              <el-form label-width="120px">
                <el-form-item label="排放源">
                  <el-select v-model="source.sourceType" placeholder="選擇排放源類型">
                    <el-option label="固定燃燒源" value="stationaryCombustion"></el-option>
                    <el-option label="移動燃燒源" value="mobileCombustion"></el-option>
                    <el-option label="製程排放" value="processEmission"></el-option>
                    <el-option label="逸散排放" value="fugitiveEmission"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="使用燃料/材料">
                  <el-select 
                    v-model="source.materialType" 
                    placeholder="選擇使用的燃料或材料"
                    filterable
                  >
                    <el-option
                      v-for="factor in filteredFactors"
                      :key="factor.name"
                      :label="factor.name"
                      :value="factor.name"
                    >
                      <span>{{ factor.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ factor.coe }} {{ factor.unit }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="使用量">
                  <div class="usage-input">
                    <el-input-number v-model="source.amount" :min="0" :precision="2" :step="1"></el-input-number>
                    <span class="unit-display">{{ getSelectedFactorUnit(source.materialType) }}</span>
                  </div>
                </el-form-item>
                
                <el-form-item label="排放係數">
                  <el-input v-model="source.factor" disabled>
                    <template #append>kgCO2e/{{ getSelectedFactorUnit(source.materialType) }}</template>
                  </el-input>
                </el-form-item>
              </el-form>
              
              <div class="source-actions">
                <el-button 
                  type="danger" 
                  circle 
                  @click="removeSource('scope1', index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            
            <div class="source-result">
              <span>排放量: {{ calculateSourceEmission(source) }} kgCO2e</span>
            </div>
          </div>
          
          <el-button type="primary" plain @click="addSource('scope1')" class="add-source-btn">
            <el-icon><Plus /></el-icon> 新增排放源
          </el-button>
        </div>
      </div>
      
      <!-- 範疇二：間接排放（能源） -->
      <div class="card">
        <div class="scope-header">
          <h2 class="section-title">範疇二：間接排放（能源）</h2>
          <el-tooltip content="因使用外購電力、熱力、蒸汽等能源導致的間接溫室氣體排放" placement="top">
            <el-button type="info" circle size="small">
              <el-icon><QuestionFilled /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        
        <div class="emission-sources">
          <div v-for="(source, index) in scope2Sources" :key="`scope2-${index}`" class="emission-source-item">
            <div class="source-header">
              <el-form label-width="120px">
                <el-form-item label="排放源">
                  <el-select v-model="source.sourceType" placeholder="選擇排放源類型">
                    <el-option label="電力使用" value="electricity"></el-option>
                    <el-option label="熱力使用" value="heat"></el-option>
                    <el-option label="蒸氣使用" value="steam"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="能源類型">
                  <el-select 
                    v-model="source.materialType" 
                    placeholder="選擇能源類型"
                    filterable
                  >
                    <el-option
                      v-for="factor in filteredFactors"
                      :key="factor.name"
                      :label="factor.name"
                      :value="factor.name"
                    >
                      <span>{{ factor.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ factor.coe }} {{ factor.unit }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="使用量">
                  <div class="usage-input">
                    <el-input-number v-model="source.amount" :min="0" :precision="2" :step="1"></el-input-number>
                    <span class="unit-display">{{ getSelectedFactorUnit(source.materialType) }}</span>
                  </div>
                </el-form-item>
                
                <el-form-item label="排放係數">
                  <el-input v-model="source.factor" disabled>
                    <template #append>kgCO2e/{{ getSelectedFactorUnit(source.materialType) }}</template>
                  </el-input>
                </el-form-item>
              </el-form>
              
              <div class="source-actions">
                <el-button 
                  type="danger" 
                  circle 
                  @click="removeSource('scope2', index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            
            <div class="source-result">
              <span>排放量: {{ calculateSourceEmission(source) }} kgCO2e</span>
            </div>
          </div>
          
          <el-button type="primary" plain @click="addSource('scope2')" class="add-source-btn">
            <el-icon><Plus /></el-icon> 新增排放源
          </el-button>
        </div>
      </div>
      
      <!-- 範疇三：其他間接排放 -->
      <div class="card">
        <div class="scope-header">
          <h2 class="section-title">範疇三：其他間接排放</h2>
          <el-tooltip content="包括企業價值鏈上下游的其他間接排放，如材料採購、員工通勤、產品運輸等" placement="top">
            <el-button type="info" circle size="small">
              <el-icon><QuestionFilled /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        
        <div class="emission-sources">
          <div v-for="(source, index) in scope3Sources" :key="`scope3-${index}`" class="emission-source-item">
            <div class="source-header">
              <el-form label-width="120px">
                <el-form-item label="排放源">
                  <el-select v-model="source.sourceType" placeholder="選擇排放源類型">
                    <el-option label="上游運輸" value="upstreamTransportation"></el-option>
                    <el-option label="下游運輸" value="downstreamTransportation"></el-option>
                    <el-option label="員工通勤" value="employeeCommuting"></el-option>
                    <el-option label="商務差旅" value="businessTravel"></el-option>
                    <el-option label="廢棄物處理" value="wasteDisposal"></el-option>
                    <el-option label="採購的商品和服務" value="purchasedGoodsServices"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="活動類型">
                  <el-select 
                    v-model="source.materialType" 
                    placeholder="選擇活動類型"
                    filterable
                  >
                    <el-option
                      v-for="factor in filteredFactors"
                      :key="factor.name"
                      :label="factor.name"
                      :value="factor.name"
                    >
                      <span>{{ factor.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {{ factor.coe }} {{ factor.unit }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="活動量">
                  <div class="usage-input">
                    <el-input-number v-model="source.amount" :min="0" :precision="2" :step="1"></el-input-number>
                    <span class="unit-display">{{ getSelectedFactorUnit(source.materialType) }}</span>
                  </div>
                </el-form-item>
                
                <el-form-item label="排放係數">
                  <el-input v-model="source.factor" disabled>
                    <template #append>kgCO2e/{{ getSelectedFactorUnit(source.materialType) }}</template>
                  </el-input>
                </el-form-item>
              </el-form>
              
              <div class="source-actions">
                <el-button 
                  type="danger" 
                  circle 
                  @click="removeSource('scope3', index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            
            <div class="source-result">
              <span>排放量: {{ calculateSourceEmission(source) }} kgCO2e</span>
            </div>
          </div>
          
          <el-button type="primary" plain @click="addSource('scope3')" class="add-source-btn">
            <el-icon><Plus /></el-icon> 新增排放源
          </el-button>
        </div>
      </div>
      
      <!-- 計算按鈕 -->
      <div class="calculation-actions">
        <el-button type="primary" size="large" @click="calculateEmissions" :disabled="isCalculateDisabled">
          計算碳排放量
        </el-button>
      </div>
      
      <!-- 計算結果 -->
      <transition name="fade">
        <div v-if="showResults" class="card result-card">
          <h2 class="section-title">計算結果</h2>
          
          <div class="results-summary">
            <div class="result-item">
              <h3>範疇一總排放量</h3>
              <div class="result-value">{{ formatNumber(calculationResults.scope1) }} kgCO2e</div>
            </div>
            
            <div class="result-item">
              <h3>範疇二總排放量</h3>
              <div class="result-value">{{ formatNumber(calculationResults.scope2) }} kgCO2e</div>
            </div>
            
            <div class="result-item">
              <h3>範疇三總排放量</h3>
              <div class="result-value">{{ formatNumber(calculationResults.scope3) }} kgCO2e</div>
            </div>
            
            <div class="result-item total-result">
              <h3>企業總碳排放量</h3>
              <div class="result-value">{{ formatNumber(calculationResults.total) }} kgCO2e</div>
            </div>
            
            <div class="result-item product-result">
              <h3>單位產品碳足跡</h3>
              <div class="result-value">
                {{ formatNumber(productEmissions.perUnit) }} kgCO2e/{{ basicInfo.productionUnit }}
              </div>
              <div class="sub-text">
                (總排放量 ÷ 總產量 {{ basicInfo.productionUnits }} {{ basicInfo.productionUnit }})
              </div>
            </div>
          </div>
          
          <div class="results-chart">
            <!-- 圖表區域，後續可增加視覺化呈現 -->
          </div>
          
          <div class="results-actions">
            <el-button type="success">
              <el-icon><Download /></el-icon>
              導出報告
            </el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { Delete, Plus, QuestionFilled, Download } from '@element-plus/icons-vue'

export default {
  name: 'CalculatorPage',
  components: {
    Delete,
    Plus,
    QuestionFilled,
    Download
  },
  data() {
    return {
      basicInfo: {
        companyName: '',
        companyId: '',
        reportYear: new Date().getFullYear().toString(),
        productName: '',
        productionUnits: 1000,
        productionUnit: '個'
      },
      scope1Sources: [],
      scope2Sources: [],
      scope3Sources: [],
      showResults: false
    }
  },
  computed: {
    ...mapState(['carbonFactors', 'loading', 'error']),
    ...mapGetters(['getCalculationResults', 'getProductEmissions']),
    
    calculationResults() {
      return this.getCalculationResults
    },
    
    productEmissions() {
      return this.getProductEmissions
    },
    
    filteredFactors() {
      return this.carbonFactors
    },
    
    isCalculateDisabled() {
      return (
        this.basicInfo.companyName === '' ||
        this.basicInfo.productName === '' ||
        this.basicInfo.productionUnits <= 0 ||
        this.basicInfo.productionUnit === '' ||
        (this.scope1Sources.length === 0 && 
         this.scope2Sources.length === 0 && 
         this.scope3Sources.length === 0)
      )
    }
  },
  methods: {
    ...mapActions(['fetchCarbonFactors', 'calculateEmissions']),
    
    addSource(scope) {
      const newSource = {
        sourceType: '',
        materialType: '',
        amount: 0,
        factor: 0
      }
      
      if (scope === 'scope1') {
        this.scope1Sources.push(newSource)
      } else if (scope === 'scope2') {
        this.scope2Sources.push(newSource)
      } else if (scope === 'scope3') {
        this.scope3Sources.push(newSource)
      }
    },
    
    removeSource(scope, index) {
      if (scope === 'scope1') {
        this.scope1Sources.splice(index, 1)
      } else if (scope === 'scope2') {
        this.scope2Sources.splice(index, 1)
      } else if (scope === 'scope3') {
        this.scope3Sources.splice(index, 1)
      }
    },
    
    getSelectedFactorUnit(materialName) {
      if (!materialName) return ''
      
      const factor = this.carbonFactors.find(f => f.name === materialName)
      return factor ? factor.unit : ''
    },
    
    getFactorValue(materialName) {
      if (!materialName) return 0
      
      const factor = this.carbonFactors.find(f => f.name === materialName)
      return factor ? parseFloat(factor.coe) : 0
    },
    
    calculateSourceEmission(source) {
      if (!source.materialType || !source.amount) return 0
      
      const factorValue = this.getFactorValue(source.materialType)
      source.factor = factorValue
      
      return this.formatNumber(source.amount * factorValue)
    },
    
    async calculateEmissions() {
      // 整合所有範疇的數據
      const payload = {
        scope1Data: this.scope1Sources,
        scope2Data: this.scope2Sources,
        scope3Data: this.scope3Sources,
        productionUnits: this.basicInfo.productionUnits
      }
      
      // 調用 store 中的計算方法
      await this.calculateEmissions(payload)
      this.showResults = true
      
      // 滾動到結果區域
      setTimeout(() => {
        const resultCard = document.querySelector('.result-card')
        if (resultCard) {
          resultCard.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    },
    
    formatNumber(num) {
      return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  },
  watch: {
    // 監聽排放源的變化，更新排放係數
    'scope1Sources': {
      deep: true,
      handler(sources) {
        sources.forEach(source => {
          if (source.materialType) {
            source.factor = this.getFactorValue(source.materialType)
          }
        })
      }
    },
    'scope2Sources': {
      deep: true,
      handler(sources) {
        sources.forEach(source => {
          if (source.materialType) {
            source.factor = this.getFactorValue(source.materialType)
          }
        })
      }
    },
    'scope3Sources': {
      deep: true,
      handler(sources) {
        sources.forEach(source => {
          if (source.materialType) {
            source.factor = this.getFactorValue(source.materialType)
          }
        })
      }
    }
  },
  created() {
    // 初始化時，添加一個默認範疇
    this.addSource('scope1')
    
    // 加載碳排放係數數據
    this.fetchCarbonFactors()
  }
}
</script>

<style lang="scss" scoped>
.calculator-page {
  .loading-container {
    padding: 20px;
  }
  
  .scope-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .section-title {
      margin-bottom: 0;
      margin-right: 10px;
    }
  }
  
  .emission-sources {
    .emission-source-item {
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: #fafafa;
      
      .source-header {
        display: flex;
        
        .el-form {
          flex-grow: 1;
        }
        
        .source-actions {
          display: flex;
          align-items: flex-start;
          padding-top: 10px;
          margin-left: 10px;
        }
      }
      
      .source-result {
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px dashed #e0e0e0;
        text-align: right;
        font-weight: 500;
      }
    }
    
    .add-source-btn {
      margin-top: 10px;
    }
  }
  
  .usage-input {
    display: flex;
    align-items: center;
    
    .unit-display {
      margin-left: 10px;
      color: var(--text-secondary);
    }
  }
  
  .calculation-actions {
    margin: 30px 0;
    text-align: center;
  }
  
  .result-card {
    margin-top: 30px;
    
    .results-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 20px;
      
      .result-item {
        padding: 15px;
        border-radius: 4px;
        background-color: #f5f7fa;
        
        h3 {
          font-size: 1rem;
          margin-bottom: 10px;
          color: var(--text-secondary);
        }
        
        .result-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary-color);
        }
        
        .sub-text {
          margin-top: 5px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      }
      
      .total-result,
      .product-result {
        grid-column: span 3;
        background-color: #f0f9eb;
        border: 1px solid #e1f3d8;
        
        .result-value {
          font-size: 1.8rem;
        }
      }
    }
    
    .results-chart {
      margin: 30px 0;
      height: 300px;
    }
    
    .results-actions {
      margin-top: 20px;
      text-align: center;
    }
  }
  
  .production-input {
    width: 200px;
  }
}
</style> 