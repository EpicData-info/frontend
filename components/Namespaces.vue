<template>
  <main>
    <b-overlay :show="show" rounded="sm">
      <!-- Search -->
      <div class="search-wrapper">
        <b-form-input v-model="searchFilter" placeholder="🔍 Search namespace"></b-form-input>
      </div>

      <!-- Main content -->
      <div class="namespace-list" role="tablist">
        <b-card no-body class="mb-1" v-for="namespace in namespaces">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle="'accordion-'+namespace" variant="info">
              {{namespace}}
            </b-button>
          </b-card-header>
          <b-collapse :id="'accordion-'+ namespace" accordion="my-accordion" role="tabpanel">
            <b-card-body class="id-list">
              <b-link :href="getLinkFor(id)" v-for="id in getIDsFrom(namespace)">
                {{id}}
              </b-link>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </b-overlay>
  </main>
</template>

<script>
  export default {
    props: ['type'],
    data() {
      return {
        show: true,
        searchFilter: "",
        namespaceJSON: {}
      }
    },
    computed: {
      namespaces() {
        return Object.keys(this.namespaceJSON).filter( namespace => {
          if(this.searchFilter)
            return namespace.toLowerCase().includes(this.searchFilter.toLowerCase())
          else
            return true
        })
      }
    },
    methods: {
      getIDsFrom(namespace) {
        return this.namespaceJSON[namespace]
      },
      getLinkFor(id) {
        return `https://raw.githubusercontent.com/EpicData-info/${this.type}s-tracker/master/database/${this.type}s/${id}.json`
      }
    },
    async mounted() {
      const {data} = await this.$axios.get(`https://raw.githubusercontent.com/EpicData-info/${this.type}s-tracker/master/database/namespaces.json`);
      this.namespaceJSON = data;
      this.show = false;

    },
  }
</script>

<style scoped>
  .search-wrapper {
    width: 512px;
    margin: 16px auto;
  }

  .namespace-list {
    width: 512px;
    margin: 16px auto;
  }

  .id-list{
    text-align: center;
  }
</style>