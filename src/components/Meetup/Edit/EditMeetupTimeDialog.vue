<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn accent slot="activator">Edit Time</v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Time</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-time-picker v-model="editableTime" style="width: 100%" actions>
              <template scope="{save, cancel}">
                <v-btn class="blue--text darken-1" flat @click="editDialog = false">Close</v-btn>
                <v-btn class="blue--text darken-1" flat @click="onSaveChanges">Save</v-btn>
              </template>
            </v-time-picker>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["meetup"],
  data() {
    return {
      editDialog: false,
      editableTime: null,
      editedTitle: this.meetup.title,
      editedDescription: this.meetup.description
    };
  },
  created() {
    if (typeof this.meetup.date === "undefined") {
      this.meetup.date = new Date();
    }
    this.editableTime = this.toTimeString(this.meetup.date);
  },
  methods: {
    onSaveChanges() {
      const newDate = new Date(this.meetup.date);
      const hours = this.editableTime.match(/^(\d+)/)[1];
      const minutes = this.editableTime.match(/:(\d+)/)[1];
      newDate.setHours(hours);
      newDate.setMinutes(minutes);

      this.$store.dispatch("updateMeetupData", {
        id: this.meetup.id,
        date: newDate
      });
    },
    toTimeString(date) {
      let timeString;
      if (typeof date !== "string") {
        date = new Date(date).toTimeString();
      }

      const hours = date.match(/^(\d+)/)[1];
      const minutes = date.match(/:(\d+)/)[1];

      timeString = hours + ":" + minutes;
      return timeString;
    }
  }
};
</script>

