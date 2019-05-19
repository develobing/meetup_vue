<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-card-media
                  src="https://images.musement.com/cover/0001/93/thumb_92294_cover_header.jpeg"
                  height="130px"
                ></v-card-media>
              </v-flex>
              <v-flex xs7 xs8 md9>
                <v-card-title primary-title>
                  <div>
                    <h3 class="white--text mb-1">My Meetup</h3>
                    <div>17th July 2017</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat to="/meetups/1">
                    <v-icon left>arrow_forward</v-icon>View Meetup
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
