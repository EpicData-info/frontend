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
    <h2>Price History</h2>
    <PriceChart
      ref="priceChart"
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
import {JSONView} from 'vue-json-component';

export default {
  components: {
    'json-view': JSONView,
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
        legend: {
          onClick: async (event, legendItem) => {
            const chart = this.$refs.priceChart.$data._chart;
            const legendItemIndex = legendItem.datasetIndex;
            const legendItemMeta = chart.getDatasetMeta(legendItemIndex);
            legendItemMeta.hidden = legendItemMeta.hidden === null ? !chart.data.datasets[legendItemIndex].hidden : null;
            chart.update();
            if (legendItemMeta.data.length > 0) return;
            const dataset = this.priceChartData.datasets.find(dataset => dataset.label === legendItem.text);
            this.$set(dataset, 'data', await this.fetchPriceHistoryForCountry(legendItem.text));
            chart.update();
          },
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const currency = this.$store.getters.getCurrency(this.$store.getters.getCountry(data.datasets[tooltipItem.datasetIndex].label).currency);
              return `${tooltipItem.yLabel.toFixed(currency.decimals)} ${currency.code}`;
            },
          },
        },
      },
    };
  },
  computed: {
    stringifiedDetails () {
      return JSON.stringify(this.details, null, 2);
    },
  },
  methods: {
    async fetchPriceHistoryForCountry (country) {
      const currency = this.$store.getters.getCurrency(this.$store.getters.getCountry(country).currency);
      const { data: pricesHistory } = await this.$axios.get(`https://raw.githubusercontent.com/EpicData-info/prices-tracker/master/database/prices-history/${country}/${this.$route.params.id}.json`);
      return pricesHistory.map((row) => {
        return {
          x: new Date(row[0]),
          y: row[1] / Math.pow(10, currency.decimals),
        };
      });
    }
  },
  async mounted () {
    const { data: details } = await this.$axios.get(`https://raw.githubusercontent.com/EpicData-info/offers-tracker/master/database/offers/${this.$route.params.id}.json`);
    this.details = details;
    await this.$store.dispatch('fetchCurrencies');
    try {
      const defaultCountry = 'US';
      const pricesHistory = await this.fetchPriceHistoryForCountry(defaultCountry);
      this.priceChartData = {
        datasets: this.$store.getters.getCountriesList.map((country, countryIndex) => {
          return {
            label: country,
            fill: false,
            borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            data: country === defaultCountry && pricesHistory || [],
            hidden: country !== defaultCountry,
          };
        }),
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
<style scoped>
.chevronStyle {
  --vjc-arrow-size: 10px !important;
}
</style>
