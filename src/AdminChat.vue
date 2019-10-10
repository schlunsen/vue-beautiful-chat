<template>
  <v-container fluid>
    <v-layout>
    <v-row>
      <v-col xs-cols="12">
        <v-data-table :headers="headers" :items="rooms">
            <template v-slot:item.channel_name="{ item }">
          <v-btn :to="'/admin/' + item.channel_name">{{item.channel_name}}</v-btn>
        </template>
        </v-data-table>
      </v-col>
    </v-row>
    </v-layout>
  </v-container>
</template>

<script>
import { WSController } from "./WSController.js";

export default {
  props: ['domain',],
  components: {
    
  },
  data: function() {
    return {
      headers: [
        {
          text: "Created",
          value: "created",
          type: 'datetime',

        },
        {
          text: "Name",
          value: "channel_name"
        },
        {
          text: "User",
          value: "user"
        },

      ]
    };
  },
  mounted() {
    this.$store.dispatch("api/getRooms");
  },
  computed: {
    rooms() {
      return this.$store.state.api.rooms;
    }
  }
};
</script>

<style>
</style>