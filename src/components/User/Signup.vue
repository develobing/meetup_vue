<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <form @submit.prevent="onSignup">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field name="email" label="E-Mail" v-model="email" type="email" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    name="password"
                    label="Password"
                    v-model="password"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    name="confirmPassword"
                    label="Confirm Password"
                    v-model="confirmPassword"
                    type="password"
                    :rules="[comparePasswords]"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit" class="primary">Sign Up</v-btn>
                </v-flex>
              </v-layout>
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    email: "",
    password: "",
    confirmPassword: ""
  }),
  computed: {
    comparePasswords() {
      return this.password !== this.confirmPassword
        ? "Password Does not match"
        : "";
    },
    user() {
      return this.$store.getters.user;
    }
  },

  methods: {
    onSignup() {
      const newUser = {
        email: this.email,
        password: this.password
      };
      this.$store.dispatch("signUserUp", newUser);
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    }
  }
};
</script>
