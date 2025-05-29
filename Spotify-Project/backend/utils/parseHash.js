function parseHash() {
    if (!window.location.hash) return {};
    return window.location.hash.substring(1).split('&').reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
  }

module.exports = { parseHash };