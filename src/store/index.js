import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  mutations,
  getters,
  actions,
  // 严格模式，状态的修改是否是 mutations 之后
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
