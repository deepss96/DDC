const https = require('https');

const loginData = JSON.stringify({
  identifier: "deepak.divaishnav1996@gmail.com",
  password: "admin123"
});

const options = {
  hostname: 'nirmaan-track-backend.onrender.com',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

console.log('Attempting login to backend...');
console.log('URL:', `https://${options.hostname}${options.path}`);
console.log('Email:', "deepak.divaishnav1996@gmail.com");

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
        console.log('\n✅ LOGIN SUCCESSFUL!');
        console.log('Token:', jsonData.token ? jsonData.token.substring(0, 50) + '...' : 'No token received');
      } else {
        console.log('\n❌ LOGIN FAILED!');
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

req.write(loginData);
req.end();
