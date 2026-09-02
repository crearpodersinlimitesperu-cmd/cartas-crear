const https = require('https');
https.get('https://www.youtube.com/results?search_query=Pedro+Capo+Vivo+letra', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/\{"videoId":"([a-zA-Z0-9_-]{11})"/g);
    if (matches) {
      const ids = [...new Set(matches.map(m => m.slice(12, 23)))];
      console.log('Found IDs:', ids.slice(0, 5));
    }
  });
});
