import Vue from 'vue'
import Vuex from 'vuex'

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
    user: {
      id: 'asdf23sdaf',
      registeredMeetups: ["sdafskdajhfskda23"]
    }
  },
  mutations: {
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload)
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