import * as firebase from 'firebase'

export default ({
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
    ]
  },
  mutations: {
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup(state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
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
              location: obj[key].location,
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
    updateMeetupData({
      commit
    }, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch(err => {
          commit('setLoading', false)
          console.log('updateMeetupData - err : ', err)
        })
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
    }
  }
})