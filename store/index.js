import Countries from '@/assets/countries';

export const state = () => ({
  donateUrl: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=EW5DW2DZPM3EC&source=url',
  searchQuery: '',
  currencies: null,
  countries: Countries,
})

export const getters = {
  getCurrenciesList (state) {
    return Object.keys(state.currencies);
  },
  getCurrency (state) {
    return (currency) => {
      return state.currencies[currency];
    };
  },
  getCountriesList (state) {
    return Object.keys(state.countries);
  },
  getCountry (state) {
    return (country) => {
      return state.countries[country];
    };
  },
}

export const mutations = {
  SET_SEARCH_QUERY (state, searchQuery) {
    state.searchQuery = searchQuery;
  },
  SET_CURRENCIES (state, currencies) {
    state.currencies = currencies;
  },
}

export const actions = {
  async fetchCurrencies ({ state, commit }) {
    if (state.currencies) {
      return;
    }
    const { data: currencies } = await this.$axios.get('https://api.allorigins.win/raw?url=https://raw.githubusercontent.com/EpicData-info/prices-tracker/master/database/currencies.json');
    commit('SET_CURRENCIES', currencies);
  },
}
