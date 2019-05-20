<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn accent slot="activator">Edit Date</v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Date</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker v-model="editableDate" style="width: 100%" actions>
              <template scope="{save, cancel}">
                <v-btn class="blue--text darken-1" flat @click="editDialog = false">Close</v-btn>
                <v-btn class="blue--text darken-1" flat @click="onSaveChanges">Save</v-btn>
              </template>
            </v-date-picker>
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
      editableDate: null,
      editedTitle: this.meetup.title,
      editedDescription: this.meetup.description
    };
  },
  created() {
    if (typeof this.meetup.date === "undefined") {
      this.meetup.date = new Date();
    }
    this.editableDate = this.toDateString(this.meetup.date);
  },
  methods: {
    onSaveChanges() {
      const newDate = new Date(this.meetup.date);
      const newDay = new Date(this.editableDate).getUTCDate();
      const newMonth = new Date(this.editableDate).getUTCMonth();
      const newYear = new Date(this.editableDate).getUTCFullYear();

      newDate.setUTCDate(newDay);
      newDate.setUTCMonth(newMonth);
      newDate.setUTCFullYear(newYear);
      this.$store.dispatch("updateMeetupData", {
        id: this.meetup.id,
        date: newDate
      });
    },
    toDateString(date) {
      let dateString;
      if (typeof date === "string") {
        date = new Date(date);
      }

      let year = date.getUTCFullYear();
      let month = date.getUTCMonth() + 1;
      let day = date.getUTCDate();

      dateString = year + "-" + month + "-" + day;
      return dateString;
    }
  }
};
</script>
