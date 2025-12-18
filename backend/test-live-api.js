const https = require('https');

const baseUrl = 'https://nirmaan-track-backend.onrender.com';

console.log('🧪 Testing Live Backend API (Production)...\n');
console.log(`🌐 Base URL: ${baseUrl}\n`);

// Test endpoints
const endpoints = [
  { path: '/api/health', description: 'Server Health Check' },
  { path: '/api/health/db', description: 'Database Health Check' },
  { path: '/api/users', description: 'Users API' },
  { path: '/api/tasks', description: 'Tasks API' },
  { path: '/api/leads', description: 'Leads API' },
  { path: '/api/notifications', description: 'Notifications API' }
];

let completedTests = 0;
const totalTests = endpoints.length;
let successCount = 0;
let dbWorking = false;

function makeRequest(endpoint) {
  const url = `${baseUrl}${endpoint.path}`;
  console.log(`🔍 Testing: ${endpoint.path}`);
  console.log(`   Description: ${endpoint.description}`);

  const options = {
    hostname: 'nirmaan-track-backend.onrender.com',
    port: 443,
    path: endpoint.path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'NirmanTrack-API-Test/1.0'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`   📊 Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        if (data) {
          const jsonData = JSON.parse(data);

          if (res.statusCode === 200) {
            console.log(`   ✅ SUCCESS`);
            successCount++;

            if (endpoint.path === '/api/health/db') {
              dbWorking = jsonData.status === 'OK';
              console.log(`   🗄️  DB Status: ${jsonData.status}`);
              console.log(`   📝 Message: ${jsonData.message}`);
              if (jsonData.test) {
                console.log(`   🧪 Test Result: ${JSON.stringify(jsonData.test)}`);
              }
            } else if (endpoint.path === '/api/leads') {
              const count = Array.isArray(jsonData) ? jsonData.length : 'N/A';
              console.log(`   📊 Records: ${count}`);
            } else if (endpoint.path === '/api/users' || endpoint.path === '/api/tasks' || endpoint.path === '/api/notifications') {
              if (jsonData.message && jsonData.message.includes('Unauthorized')) {
                console.log(`   🔐 Auth Required: ${jsonData.message}`);
              } else {
                const count = Array.isArray(jsonData) ? jsonData.length : 'N/A';
                console.log(`   📊 Records: ${count}`);
              }
            }
          } else if (res.statusCode === 401) {
            console.log(`   🔐 AUTH REQUIRED: ${jsonData.message || 'Authentication needed'}`);
            successCount++; // Auth required is expected behavior
          } else {
            console.log(`   ❌ FAILED: ${jsonData.message || jsonData.error || 'Unknown error'}`);
            if (jsonData.error) {
              console.log(`   🚨 Error Details: ${jsonData.error}`);
            }
          }
        } else {
          if (res.statusCode === 200) {
            console.log(`   ✅ SUCCESS (no response body)`);
            successCount++;
          } else {
            console.log(`   ❌ FAILED: No response body, status ${res.statusCode}`);
          }
        }
      } catch (e) {
        console.log(`   ⚠️  Parse Error: ${e.message}`);
        console.log(`   📄 Raw Response: ${data.substring(0, 200)}...`);
      }

      console.log('');
      completedTests++;

      if (completedTests === totalTests) {
        printSummary();
      }
    });
  });

  req.on('error', (e) => {
    console.log(`   ❌ NETWORK ERROR: ${e.message}`);
    console.log(`   🔍 Error Code: ${e.code}`);
    console.log('');
    completedTests++;

    if (completedTests === totalTests) {
      printSummary();
    }
  });

  req.setTimeout(15000, () => {
    console.log(`   ⏰ TIMEOUT after 15 seconds`);
    console.log('');
    req.destroy();
    completedTests++;

    if (completedTests === totalTests) {
      printSummary();
    }
  });

  req.end();
}

function printSummary() {
  console.log('📋 TEST SUMMARY');
  console.log('================');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${totalTests - successCount}`);
  console.log(`Database Working: ${dbWorking ? '✅ YES' : '❌ NO'}`);
  console.log('');

  if (dbWorking) {
    console.log('🎉 OVERALL STATUS: ✅ PRODUCTION API IS WORKING!');
    console.log('   - Server is responding');
    console.log('   - Database connection is active');
    console.log('   - API endpoints are accessible');
  } else {
    console.log('🚨 OVERALL STATUS: ❌ PRODUCTION API HAS ISSUES!');
    console.log('   - Database connection problems detected');
    console.log('   - Check database credentials and connectivity');
    console.log('   - Verify production environment configuration');
  }

  console.log('\n✅ Live API testing completed!');
  process.exit(dbWorking ? 0 : 1);
}

// Start testing
endpoints.forEach(endpoint => {
  setTimeout(() => makeRequest(endpoint), Math.random() * 1000); // Stagger requests
});

// Overall timeout
setTimeout(() => {
  console.log('\n⏰ Overall test timeout after 60 seconds');
  printSummary();
}, 60000);
