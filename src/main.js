import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import {
  store
} from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert'

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
Vue.component('app-alert', AlertCmp)

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyC-lLw-PiuefgfQmZ7V8QkthsOSC9KpTQA",
      authDomain: "devmeetup-bf7a4.firebaseapp.com",
      databaseURL: "https://devmeetup-bf7a4.firebaseio.com",
      projectId: "devmeetup-bf7a4",
      storageBucket: "devmeetup-bf7a4.appspot.com",
      messagingSenderId: "476000286232",
      appId: "1:476000286232:web:cb30624e15c1a28b"
    })

    this.$store.dispatch('loadMeetups')
  }
}).$mount('#app')