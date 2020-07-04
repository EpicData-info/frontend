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
    <h2>Price History</h2>
    <PriceChart
      :options="priceChartOptions"
      :chartData="priceChartData"
    />
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
import Moment from 'moment';
import PriceChart from '@/components/PriceChart';

export default {
  components: {
    PriceChart,
  },
  data () {
    return {
      slide: 0,
      details: {},
      priceChartData: {},
      priceChartOptions: {
        title: {
          text: 'Test',
        },
        scales: {
					xAxes: [{
						type: 'time',
						time: {
              round: 'day',
              parser: Moment,
							tooltipFormat: 'YYYY-MM-DD',
						},
						scaleLabel: {
							display: true,
							labelString: 'Date',
						},
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'value',
						},
					}],
				},
      },
    };
  },
  computed: {
    stringifiedDetails () {
      return JSON.stringify(this.details, null, 2);
    },
  },
  async mounted () {
    const { data: details } = await this.$axios.get(`https://raw.githubusercontent.com/EpicData-info/offers-tracker/master/database/offers/${this.$route.params.id}.json`);
    this.details = details;
    try {
      let { data: pricesHistory } = await this.$axios.get(`https://raw.githubusercontent.com/EpicData-info/prices-tracker/master/database/prices-history/US/${this.$route.params.id}.json`);
      pricesHistory = pricesHistory.map((row) => {
        return {
          x: new Date(row[0]),
          y: row[1] / 100,
        };
      });
      this.priceChartData = {
        datasets: [
          {
            label: 'USD',
            fill: false,
            data: pricesHistory,
          },
        ],
      };
      const dayFormat = 'YYYY-MM-DD';
      if (pricesHistory.length > 0 && Moment(pricesHistory[0].x).format(dayFormat) !== Moment.format(dayFormat)) {
        pricesHistory.unshift({
          ...pricesHistory[0],
          x: new Date(),
        });
      }
    } catch {}
  },
}
</script>
