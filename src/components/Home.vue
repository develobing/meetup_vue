<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large to="/meetups" class="info">Explore Meetups</v-btn>
      </v-flex>

      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large to="/meetup/new" class="info">Organize Meetups</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="mt-2">
      <v-flex xs-12>
        <v-carousel style="cursor: pointer;">
          <v-carousel-item
            v-for="meetup in meetups"
            :src="meetup.imageUrl"
            :key="meetup.id"
            @click="onLoadMeetup(meetup.id)"
          >
            <!-- <v-card>
              <v-card-text class="text-sm-center">{{meetup.title}}</v-card-text>
            </v-card>-->
            <div class="title">{{meetup.title}}</div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>Join our awesome meetups!</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  computed: {
    meetups () {
      return this.$store.getters.featuredMeetups
    }
  },
  methods: {
    onLoadMeetup(id) {
      this.$router.push("/meetups/" + id);
    }
  }
};
</script>

<style scoped>
.title {
  /* position: absolute; */
  /* bottom: 50px; */
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 2em;
  padding: 20px;
  margin: auto 0;
  text-align: center;
}
</style>
