const https = require('https');

const options = {
  hostname: 'nirmaan-track-backend.onrender.com',
  port: 443,
  path: '/api/health/db',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testing database health check...');
console.log('URL:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
  console.log('\nResponse Status:', res.statusCode);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));

      if (res.statusCode === 200) {
        console.log('\n✅ DATABASE CONNECTION SUCCESSFUL!');
      } else {
        console.log('\n❌ DATABASE CONNECTION FAILED!');
      }
    } catch (e) {
      console.log(data);
      console.log('\n❌ INVALID JSON RESPONSE');
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ REQUEST ERROR:', e.message);
});

req.end();
