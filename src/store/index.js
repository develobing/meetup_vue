import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [{
        id: "sdafskdajhfskda23",
        title: "Meetup in Newyork",
        date: new Date(),
        imageUrl: "https://images.musement.com/cover/0001/93/thumb_92294_cover_header.jpeg",
        location: 'New York',
        description: 'sdafsda fasd fsda fsda fasd fasd f'
      },
      {
        id: "11sdafsk2sdafkda223",
        title: "Meetup in Paris",
        date: new Date(),
        imageUrl: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
        location: 'Paris',
        description: 'sdafasdfasdf asdf 324 234 23 423 423sdaf'
      }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload)
    },
    setUser(state, payload) {
      state.user = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    loadMeetups({
      commit
    }) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then(data => {
          console.log('loadedMeetups - data : ', data)
          const meetups = []
          const obj = data.val()
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          console.log('loadedMeetups - err : ', err)
        })
    },
    createMeetup({
      commit,
      getters
    }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('meetups').push(meetup)
        .then(data => {
          key = data.key
          console.log('Complete createMeetup! - data : ', data)
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('meetups/' + key + ext).put(payload.image)
        })
        .then(fileData => {
          return firebase.storage().ref(fileData.metadata.fullPath).getDownloadURL()
        })
        .then(imageUrl => {
          console.log('imageUrl', imageUrl)
          return firebase.database().ref('meetups').child(key).update({
            imageUrl
          })
        })
        .then(() => {
          commit('createMeetup', {
            ...meetup,
            id: key,
            imageUrl
          })
        })
        .catch(err => {
          console.log('createMeetup Failed - err : ', err)
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
            registeredMeetups: []
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
            registeredMeetups: []
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
        registeredMeetup: []
      })
    },
    logout({
      commit
    }) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError({
      commit
    }) {
      commit('clearError')
    }
  },
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0, 5);
    },
    loadedMeetup(state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id == meetupId
        })
      }
    },
    user(state) {
      return state.user
    },
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    }
  }
})