const https = require('https');
https.get('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=FboYUBlvaL4&format=json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('FboYUBlvaL4:', res.statusCode));
});
https.get('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=zzUKXC4zxko&format=json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('zzUKXC4zxko:', res.statusCode));
});
