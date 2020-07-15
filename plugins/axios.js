const Url = require('url');

export default ({ $axios }) => {
  $axios.onError((error) => {
    if (error.message !== 'Network Error') {
      throw error;
    }
    const url = Url.parse(error.config.url);
    switch (url.hostname) {
      case 'raw.githubusercontent.com':
        error.config.url = `https://api.allorigins.win/raw?url=${error.config.url}`;
        return $axios.request(error.config);
        
      case 'api.allorigins.win':
        error.config.url = error.config.url.replace('https://api.allorigins.win/raw?url=', 'https://cors-anywhere.herokuapp.com/');
        return $axios.request(error.config);

      case 'cors-anywhere.herokuapp.com':
        throw error;

      default:
        throw error;
    }
  });
}
