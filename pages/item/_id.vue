<template>
  <b-container>
    <h1>{{ this.details.title }}</h1>
    <p>{{ this.details.description }}</p>
    <h2>Details</h2>
    <b-container fluid>
      <b-row>
        <b-col sm="12">
          <json-view
            :data="details"
            class="chevronStyle"/>
        </b-col>
      </b-row>
    </b-container>
    <h2>Images</h2>
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      controls
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
    >
      <b-carousel-slide
        v-for="(image, imageIndex) in details.keyImages"
        :key="imageIndex"
        :caption="image.type"
        :img-src="image.url"
      ></b-carousel-slide>
    </b-carousel>
  </b-container>
</template>

<script>

import {JSONView} from 'vue-json-component';

export default {
  components: {'json-view': JSONView},
  data() {
    return {
      slide: 0,
      details: {},
    };
  },
  async mounted() {
    const {data: details} = await this.$axios.get(`https://raw.githubusercontent.com/EpicData-info/items-tracker/master/database/items/${this.$route.params.id}.json`);
    this.details = details;
  },
}
</script>

<style scoped>
.chevronStyle {
  --vjc-arrow-size: 10px !important;
}
</style>
