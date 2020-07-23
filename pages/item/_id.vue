<template>
  <b-container>
    <h1>{{ this.details.title }}</h1>
    <p>{{ this.details.description }}</p>
    <h2>Details</h2>
    <b-container fluid>
      <b-row>
        <b-col sm="12">
          <b-form-textarea
            id="textarea-auto-height"
            placeholder="Auto height textarea"
            rows="3"
            max-rows="100"
            readonly
            v-model="stringifiedDetails"
          ></b-form-textarea>
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
export default {
  data () {
    return {
      slide: 0,
      details: {},
    };
  },
  computed: {
    stringifiedDetails () {
      return JSON.stringify(this.details, null, 2);
    },
  },
  async mounted () {
    const { data: details } = await this.$axios.get(`https://raw.githubusercontent.com/EpicData-info/items-tracker/master/database/items/${this.$route.params.id}.json`);
    this.details = details;
  },
}
</script>
