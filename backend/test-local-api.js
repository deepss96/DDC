const http = require('http');

const baseUrl = 'http://localhost:5000';

console.log('Testing Local Backend API...\n');
console.log(`Base URL: ${baseUrl}\n`);

// Test endpoints
const endpoints = [
  '/api/health',
  '/api/health/db',
  '/api/users',
  '/api/tasks',
  '/api/leads'
];

let completedTests = 0;
const totalTests = endpoints.length;

endpoints.forEach(endpoint => {
  const url = `${baseUrl}${endpoint}`;
  console.log(`Testing: ${endpoint}`);

  const req = http.request(url, { method: 'GET' }, (res) => {
    console.log(`  Status: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        if (data) {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log(`  ✅ SUCCESS`);
            if (endpoint === '/api/health/db') {
              console.log(`  📊 DB Status: ${jsonData.status}`);
              console.log(`  📝 Message: ${jsonData.message}`);
            } else if (endpoint === '/api/users' || endpoint === '/api/tasks' || endpoint === '/api/leads') {
              const count = Array.isArray(jsonData) ? jsonData.length : 'N/A';
              console.log(`  📊 Records: ${count}`);
            }
          } else {
            console.log(`  ❌ FAILED: ${jsonData.message || 'Unknown error'}`);
          }
        } else {
          console.log(`  ✅ SUCCESS (no response body)`);
        }
      } catch (e) {
        console.log(`  ⚠️  Response: ${data.substring(0, 100)}...`);
      }

      console.log('');
      completedTests++;

      if (completedTests === totalTests) {
        console.log('✅ Local API testing completed!');
        process.exit(0);
      }
    });
  });

  req.on('error', (e) => {
    console.log(`  ❌ ERROR: ${e.message}`);
    console.log('');
    completedTests++;

    if (completedTests === totalTests) {
      console.log('✅ Local API testing completed!');
      process.exit(0);
    }
  });

  req.setTimeout(10000, () => {
    console.log(`  ⏰ TIMEOUT after 10 seconds`);
    console.log('');
    req.destroy();
    completedTests++;

    if (completedTests === totalTests) {
      console.log('✅ Local API testing completed!');
      process.exit(0);
    }
  });

  req.end();
});

// Overall timeout
setTimeout(() => {
  console.log('\n⏰ Overall test timeout after 30 seconds');
  process.exit(0);
}, 30000);
