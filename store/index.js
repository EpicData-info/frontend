export const state = () => ({
  donateUrl: 'https://www.paypal.com/donate/?token=bYS_KjqtfpzeY3_aDu0z30v-mik9V-XjaMoYoJu9ojd6a9gMTMbwA7lxDRlSfBpg6I3ATW&country.x=PL&locale.x=',
  searchQuery: '',
})

export const mutations = {
  SET_SEARCH_QUERY (state, searchQuery) {
    state.searchQuery = searchQuery;
  },
}
