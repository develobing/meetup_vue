import * as firebase from 'firebase'

export default ({
  state: {
    user: null,
  },
  mutations: {
    registerUserForMeetup(state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup(state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {
    registerUserForMeetup({
      commit,
      getters
    }, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', {
            id: payload,
            fbKey: data.key
          })
        })
        .catch(err => {
          commit('setLoading', false)
          console.log('registerUserForMeetup - err : ', err)
        })
    },
    unregisterUserFromMeetup({
      commit,
      getters
    }, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
        .remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromMeetup', payload)
        })
        .catch(err => {
          commit('setLoading', false)
          console.log('unregisterUserFromMeetup - err : ', err)
        })
    },
    signUserUp({
      commit
    }, payload) {
      commit('clearError')
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit('setLoading', false)
          console.log('Completing Signing Up! - User : ', user)
          const newUser = {
            id: user.user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
          console.log('signUserUp - err : ', err)
        })
    },
    signUserIn({
      commit
    }, payload) {
      commit('clearError')
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit('setLoading', false)
          console.log('Completing Signing In! - User : ', user)
          const newUser = {
            id: user.user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
          console.log('signUserIn - err : ', err)
        })
    },
    autoSignIn({
      commit
    }, payload) {
      commit('setUser', {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    fetchUserData({
      commit,
      getters
    }) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/')
        .once('value')
        .then(data => {
          commit('setLoading', false)
          const dataPairs = data.val()
          let registeredMeetups = []
          let swaappedPairs = {}
          for (let key in dataPairs) {
            registeredMeetups.push(dataPairs[key])
            swaappedPairs[dataPairs[key]] = key
          }
          const updatedUser = {
            id: getters.user.id,
            registeredMeetups,
            fbKeys: swaappedPairs
          }
          commit('setUser', updatedUser)
        })
        .catch(err => {
          commit('setLoading', false)
          console.log('fetchUserData - err : ', err)
        })
    },
    logout({
      commit
    }) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user(state) {
      return state.user
    }
  }
})