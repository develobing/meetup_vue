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
import EditMeetupDetailDialog from './components/Meetup/Edit/EditMeetupDetailDialog'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog'

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
Vue.component('app-edit-meetup-detail-dialog', EditMeetupDetailDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)

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
      storageBucket: "gs://devmeetup-bf7a4.appspot.com",
      messagingSenderId: "476000286232",
      appId: "1:476000286232:web:cb30624e15c1a28b"
    })
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })

    this.$store.dispatch('loadMeetups')
  }
}).$mount('#app')