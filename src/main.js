import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import {
  store
} from './store'
import DateFilter from './filters/date'

// Helpers
import colors from 'vuetify/es5/util/colors'

Vue.config.productionTip = false
Vue.use(Vuetify, {
  theme: {
    primary: colors.red.darken1, // #E53935
    secondary: colors.red.lighten4, // #FFCDD2
    accent: colors.indigo.base // #3F51B5
  }
})
Vue.filter('date', DateFilter)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')