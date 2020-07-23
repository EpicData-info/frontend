<template>
  <main>
    <div>
      <b-form-select v-model="country" :options="$store.getters.getCountriesList" @change="load"></b-form-select>
    </div>
    <b-table
      id="MainTable"
      striped
      hover
      :items="displayedItems"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @row-clicked="onRowClicked"
    >
      <template v-slot:bottom-row>
        <b-td colspan="7" style="padding:0;border-bottom:1px solid #dee2e6;border-top:none">
          <ins
            class="adsbygoogle"
            style="display:block"
            data-ad-format="fluid"
            data-ad-layout-key="-gn-28-5b-b0+1nb"
            data-ad-client="ca-pub-6726404296831661"
            data-ad-slot="3803459231">
          </ins>
        </b-td>
      </template>
      <template v-slot:cell(1)="row">
        <template v-if="row.value > 0">
          {{ (row.value / Math.pow(10, currency.decimals)).toFixed(currency.decimals) }} {{ currency.code }}
        </template>
        <template v-else>
          <strong class="price-tag">FREE</strong>
        </template>
      </template>
      <template v-slot:cell(2)="row">
        {{ (row.value / Math.pow(10, currency.decimals)).toFixed(currency.decimals) }} {{ currency.code }}
      </template>
      <template v-slot:cell(3)="row">
        <strong class="price-tag">-{{ row.value }}%</strong>
      </template>
      <template v-slot:cell(actions)="row">
        <b-button variant="primary" href="#" size="sm" @click.prevent="goToStore(row.item[0])">See in store</b-button>
      </template>
    </b-table>
    <div class="overflow-auto">
      <b-pagination
        v-model="page"
        :total-rows="filteredItems.length"
        :per-page="perPage"
        aria-controls="MainTable"
        align="center"
        @change="onPaginationChange"
      ></b-pagination>
    </div>
  </main>
</template>

<script>
import Moment from 'moment';

export default {
  data () {
    return {
      country: 'US',
      page: 1,
      perPage: 32,
      sortBy: this.$route.query.sortBy || '3',
      sortDesc: typeof this.$route.query.sortDesc !== 'undefined' ? (this.$route.query.sortDesc === 'true' ? true : false) : true,
      currency: {},
      items: [],
      fields: [
        {
          key: '4',
          label: 'Title',
          sortable: true,
        },
        {
          key: '1',
          label: 'Discount Price',
          sortable: true,
        },
        {
          key: '2',
          label: 'Original Price',
          sortable: true,
        },
        {
          key: '3',
          label: 'Discount',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Actions',
        },
      ],
    };
  },
  computed: {
    filteredItems () {
      return this.items
        .sort((a, b) => {
          if (this.sortDesc) {
            return b[this.sortBy] < a[this.sortBy] ? -1 : 1;
          }
          return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
        });
    },
    displayedItems () {
      return [...this.filteredItems]
        .splice(this.page * this.perPage - this.perPage, this.perPage);
    },
  },
  methods: {
    onRowClicked (row) {
      const itemId = row[0];
      this.$router.push(`/offer/${itemId}`);
    },
    onPaginationChange () {
      window.scrollTo(0, 0);
    },
    filter (filterBy, filterValue) {
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          [filterBy]: filterValue,
        },
      });
    },
    async goToStore (offerId) {
      try {
        const { data: offer } = await this.$axios.get(`https://raw.githubusercontent.com/EpicData-info/offers-tracker/master/database/offers/${offerId}.json`);
        if (!offer.productSlug) {
          throw new Error('No product slug');
        }
        window.open(`https://www.epicgames.com/store/product/${offer.productSlug}`, '_blank');
      } catch {
        alert('Cannot open offer in store');
      }
    },
    async load () {
      try {
        const currency = this.$store.getters.getCountry(this.country).currency;
        await this.$store.dispatch('fetchCurrencies');
        const { data: titles } = await this.$axios.get('https://raw.githubusercontent.com/EpicData-info/offers-tracker/master/database/titles.json');
        const { data: promotionsData } = await this.$axios.get(`https://raw.githubusercontent.com/EpicData-info/prices-tracker/master/database/promotions/${this.country}.json`);
        this.currency = this.$store.getters.getCurrency(currency);
        const items = Object.keys(promotionsData)
          .map((offerId) => {
            return [
              offerId,
              ...Object.values(promotionsData[offerId]),
              titles[offerId],
            ];
          });
        items
          .map(item => `${item[1]}${item[2]}${item[3]}${item[4]}`)
          .forEach((title, titleIndex, self) => {
            if (self.indexOf(title) === titleIndex) return;
            items[titleIndex] = null;
          });
        this.items = items.filter(item => item);
      } catch (error) {
        console.error(error);
      }
    },
  },
  async mounted () {
    this.load();
  },
}
</script>

<style scoped>
  .thumbnail {
    display: inline-block;
    max-width: 64px;
    max-height: 100px;
    position: relative;
  }

  .thumbnail .thumbnail_min {
    width: 100%;
    height: 100%;
  }

  .thumbnail .thumbnail_full {
    max-width: 400px;
    position: absolute;
    top: 0;
    left: 100%;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.32s;
  }
  
  .thumbnail:hover .thumbnail_full {
    opacity: 1;
    pointer-events: all;
  }

  .price-tag {
    display: inline-block;
    padding: 2px 3px;
    border-radius: 5px;
    background:#17a2b8;
    color: #fff;
  }
</style>
