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
    createMeetup({
      commit
    }, payload) {
      const meetup = {
        id: 'sdafasdfsdaf',
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date
      }

      // Reach out to firebase and store it
      commit('createMeetup', meetup)
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