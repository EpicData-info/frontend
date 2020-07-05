export default () => {
  if (typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.dataset.adClient = 'ca-pub-7381916449670854';
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  document.body.appendChild(script);
}
