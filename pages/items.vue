<template>
  <main>
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
        <b-link href="#" @click.prevent="filter('ns', row.value)">{{ row.value }}</b-link>
      </template>
      <template v-slot:cell(3)="row">
        <template v-if="row.value">
          <span v-for="(category, categoryIndex) in row.value" :key="category">{{ category }}{{ categoryIndex < row.value.length - 1 ? ', ' : '' }}</span>
        </template>
        <template v-else>-</template>
      </template>
      <template v-slot:cell(4)="row">
        <b-link href="#" @click.prevent="filter('developer', row.value)">{{ row.value }}</b-link>
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
      page: 1,
      perPage: 32,
      sortBy: this.$route.query.sortBy || '6',
      sortDesc: typeof this.$route.query.sortDesc !== 'undefined' ? (this.$route.query.sortDesc === 'true' ? true : false) : true,
      items: [],
      fields: [
        {
          key: '2',
          label: 'Title',
          sortable: true,
        },
        {
          key: '1',
          label: 'Namespace',
          sortable: true,
        },
        {
          key: '3',
          label: 'Categories',
        },
        {
          key: '4',
          label: 'Developer',
          sortable: true,
        },
        {
          key: '5',
          label: 'Created Time',
          sortable: true,
        },
        {
          key: '6',
          label: 'Last Modified Time',
          sortable: true,
        },
      ],
    };
  },
  computed: {
    filteredItems () {
      let searchQuery = this.$store.state.searchQuery.toLowerCase().trim();
      return this.items
        .filter((item) => {
          if (this.$route.query.category && item[3].indexOf(this.$route.query.category) === -1) {
            return false;
          }
          if (this.$route.query.developer && item[4].toLowerCase().indexOf(this.$route.query.developer.toLowerCase()) === -1) {
            return false;
          }
          if (this.$route.query.ns && item[1] !== this.$route.query.ns) {
            return false;
          }
          return item[2].toLowerCase().indexOf(searchQuery) > -1;
        })
        .sort((a, b) => {
          if (this.sortDesc) {
            return b[this.sortBy] < a[this.sortBy] ? -1 : 1;
          }
          return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
        });
    },
    displayedItems () {
      return [...this.filteredItems]
        .splice(this.page * this.perPage - this.perPage, this.perPage)
        .map((rawItem) => {
          const item = [...rawItem];
          item[5] = Moment(item[5] * 1000).format('YYYY-MM-DD HH:mm');
          item[6] = Moment(item[6] * 1000).format('YYYY-MM-DD HH:mm');
          return item;
        });
    },
  },
  methods: {
    onRowClicked (row) {
      const itemId = row[0];
      this.$router.push(`/item/${itemId}`);
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
  },
  async mounted () {
    const { data } = await this.$axios.get('https://api.allorigins.win/raw?url=https://raw.githubusercontent.com/EpicData-info/items-tracker/master/database/list.json');
    this.items = data;
  },
}
</script>
