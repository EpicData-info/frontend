<template>
  <header>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">EpicData</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/items">Items</b-nav-item>
          <b-nav-item href="/offers">Offers</b-nav-item>
          <b-nav-item href="/offers?category=games&sortBy=5">New Games</b-nav-item>
          <b-nav-item to="/promotions">Promotions</b-nav-item>
          <b-nav-item href="https://github.com/EpicData-info" target="_blank">Github</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="['items', 'offers'].indexOf(this.$route.name) > -1" class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search" v-model="searchQuery" @keyup="commitSearchQuery"></b-form-input>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
export default {
  data () {
    return {
      searchQuery: '',
    };
  },
  methods: {
    commitSearchQuery () {
      this.$store.commit('SET_SEARCH_QUERY', this.searchQuery);
    }
  },
}
</script>
