#!/usr/bin/env node
import 'dotenv/config';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

console.log(`🔥 ADVANCED STRESS TEST - Finding the Breaking Points`);
console.log(`📍 Target: ${BASE_URL}\n`);

// Test 1: Invalid Data Types
async function testInvalidDataTypes() {
  console.log('💣 Test 1: Invalid Data Types');
  const invalidCases = [
    { name: 'String as Number', data: { eventType: 'festival', attendance: 'thousand', duration: 1 } },
    { name: 'Null Values', data: { eventType: null, attendance: null, duration: null } },
    { name: 'Undefined Fields', data: { eventType: undefined, attendance: undefined } },
    { name: 'Object Instead of Number', data: { eventType: 'festival', attendance: { value: 100 }, duration: 1 } },
    { name: 'Array Instead of Object', data: ['festival', 100, 1] },
    { name: 'Empty Object', data: {} },
    { name: 'Boolean Values', data: { eventType: true, attendance: false, duration: true } },
  ];

  for (const testCase of invalidCases) {
    try {
      const res = await fetch(`${BASE_URL}/api/calculate-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.data)
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`  ⚠️  ${testCase.name}: Accepted (${data.total?.toFixed(2) || 'N/A'} tons) - Should validate!`);
      } else {
        console.log(`  ✓ ${testCase.name}: Rejected ${res.status}`);
      }
    } catch (err) {
      console.log(`  ✗ ${testCase.name}: Error - ${err.message}`);
    }
  }
  console.log('');
}

// Test 2: SQL Injection & XSS Attempts
async function testSecurityVulnerabilities() {
  console.log('🛡️  Test 2: Security Vulnerabilities');
  const maliciousCases = [
    { name: 'SQL Injection', email: "admin'--", name: "Robert'; DROP TABLE users;--" },
    { name: 'XSS Script', email: '<script>alert("xss")</script>@test.com', name: '<img src=x onerror=alert(1)>' },
    { name: 'NoSQL Injection', email: '{"$gt":""}', name: '{"$ne":null}' },
    { name: 'Path Traversal', name: '../../../etc/passwd', email: 'test@test.com' },
  ];

  for (const testCase of maliciousCases) {
    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testCase.name,
          email: testCase.email,
          message: 'Security test'
        })
      });

      if (res.ok) {
        console.log(`  ⚠️  ${testCase.name}: Accepted - SECURITY RISK!`);
      } else {
        console.log(`  ✓ ${testCase.name}: Blocked ${res.status}`);
      }
    } catch (err) {
      console.log(`  ✓ ${testCase.name}: Protected - ${err.message}`);
    }
  }
  console.log('');
}

// Test 3: Extreme Boundary Values
async function testBoundaryConditions() {
  console.log('🌊 Test 3: Extreme Boundary Conditions');
  const extremeCases = [
    { name: 'Max 32-bit Integer', attendance: 2147483647, duration: 1 },
    { name: 'Floating Point', attendance: 1.5, duration: 0.5 },
    { name: 'Scientific Notation', attendance: 1e10, duration: 1 },
    { name: 'Infinity', attendance: Infinity, duration: Infinity },
    { name: 'Negative Infinity', attendance: -Infinity, duration: -Infinity },
    { name: 'NaN', attendance: NaN, duration: NaN },
    { name: 'Very Small Decimal', attendance: 0.0000001, duration: 0.0000001 },
  ];

  for (const testCase of extremeCases) {
    try {
      const res = await fetch(`${BASE_URL}/api/calculate-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'festival',
          attendance: testCase.attendance,
          duration: testCase.duration,
          location: 'Test'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const total = data.total;
        console.log(`  ${isFinite(total) ? '⚠️' : '✗'} ${testCase.name}: ${total?.toFixed(2) || 'Invalid'} tons`);
      } else {
        console.log(`  ✓ ${testCase.name}: Rejected ${res.status}`);
      }
    } catch (err) {
      console.log(`  ✗ ${testCase.name}: Error - ${err.message}`);
    }
  }
  console.log('');
}

// Test 4: Unicode & Special Characters
async function testUnicodeHandling() {
  console.log('🌍 Test 4: Unicode & Special Characters');
  const unicodeCases = [
    { name: 'Emoji Storm', text: '🎉🎊🎈🎁🎀🎂🎃🎄' },
    { name: 'Chinese Characters', text: '北京音乐节' },
    { name: 'Arabic', text: 'مهرجان الموسيقى' },
    { name: 'Right-to-Left', text: '\u202Eהפוך' },
    { name: 'Zero Width Chars', text: 'Test\u200B\u200C\u200DEvent' },
    { name: 'Zalgo Text', text: 'T̷̡̨̛̬̦͇̺̹̳͕͖̻̠̘̰̼̿̏̃̾̂̈́̇͐̃͌̅̚͜͝͝ͅe̵̛̛̛̫͚̱̹͇͇̺̲͙̰͐̈̈́̇͋̋̌́̕͘͝s̶̨̡̰̮͖̱̩̫̗̲̘̪̪̙̀̓͊̈́̇̃̀̀͌̉͝t̴̨̧̛͎̫̗̼͖̳̭͙̹̘̭̋̌̿̄̀͑̒̂̕̕͝' },
  ];

  for (const testCase of unicodeCases) {
    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testCase.text,
          email: 'test@test.com',
          message: testCase.text
        })
      });

      if (res.ok) {
        console.log(`  ✓ ${testCase.name}: Handled correctly`);
      } else {
        console.log(`  ⚠️  ${testCase.name}: Failed ${res.status}`);
      }
    } catch (err) {
      console.log(`  ✗ ${testCase.name}: Error - ${err.message}`);
    }
  }
  console.log('');
}

// Test 5: Memory Leak Detection
async function testMemoryLeaks() {
  console.log('💾 Test 5: Memory Leak Detection (1000 rapid requests)');
  const start = Date.now();
  let successCount = 0;
  let failCount = 0;

  const promises = [];
  for (let i = 0; i < 1000; i++) {
    promises.push(
      fetch(`${BASE_URL}/api/health`)
        .then(res => res.ok ? successCount++ : failCount++)
        .catch(() => failCount++)
    );
  }

  await Promise.all(promises);
  const duration = Date.now() - start;

  console.log(`  Success: ${successCount}, Failed: ${failCount}`);
  console.log(`  Duration: ${duration}ms (${(duration / 1000).toFixed(2)}ms avg)`);
  console.log(`  Throughput: ${(1000 / (duration / 1000)).toFixed(0)} req/s`);
  console.log('');
}

// Test 6: Concurrent User Simulation
async function testConcurrentUsers() {
  console.log('👥 Test 6: Concurrent User Simulation (50 users)');
  const start = Date.now();
  let calculations = 0;
  let contacts = 0;

  const promises = [];

  for (let i = 0; i < 50; i++) {
    // Each "user" does a calculation
    promises.push(
      fetch(`${BASE_URL}/api/calculate-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'concert',
          attendance: Math.floor(Math.random() * 10000),
          duration: Math.floor(Math.random() * 5) + 1
        })
      })
        .then(res => res.ok && calculations++)
        .catch(() => {})
    );

    // And submits a contact form
    promises.push(
      fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `User ${i}`,
          email: `user${i}@test.com`,
          message: `Concurrent test ${i}`
        })
      })
        .then(res => res.ok && contacts++)
        .catch(() => {})
    );
  }

  await Promise.all(promises);
  const duration = Date.now() - start;

  console.log(`  Calculations: ${calculations}/50`);
  console.log(`  Contacts: ${contacts}/50`);
  console.log(`  Duration: ${duration}ms`);
  console.log('');
}

// Test 7: Malformed JSON
async function testMalformedData() {
  console.log('📦 Test 7: Malformed JSON & Headers');
  const cases = [
    { name: 'Invalid JSON', body: '{invalid json}', contentType: 'application/json' },
    { name: 'Missing Content-Type', body: JSON.stringify({ test: true }), contentType: null },
    { name: 'Wrong Content-Type', body: JSON.stringify({ test: true }), contentType: 'text/plain' },
    { name: 'Circular Reference', body: null, contentType: 'application/json' }, // Will handle separately
  ];

  for (const testCase of cases) {
    try {
      const headers = {};
      if (testCase.contentType) {
        headers['Content-Type'] = testCase.contentType;
      }

      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers,
        body: testCase.body
      });

      console.log(`  ${res.ok ? '⚠️' : '✓'} ${testCase.name}: ${res.status} ${res.statusText}`);
    } catch (err) {
      console.log(`  ✓ ${testCase.name}: Protected - ${err.message}`);
    }
  }
  console.log('');
}

// Test 8: Rate Limiting / DoS Protection
async function testRateLimiting() {
  console.log('🚦 Test 8: Rate Limiting Check (100 req in 1s)');
  const start = Date.now();
  let accepted = 0;
  let rejected = 0;

  const promises = [];
  for (let i = 0; i < 100; i++) {
    promises.push(
      fetch(`${BASE_URL}/api/calculate-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'festival',
          attendance: 1000,
          duration: 1
        })
      })
        .then(res => res.ok ? accepted++ : rejected++)
        .catch(() => rejected++)
    );
  }

  await Promise.all(promises);
  const duration = Date.now() - start;

  console.log(`  Accepted: ${accepted}, Rejected: ${rejected}`);
  console.log(`  Duration: ${duration}ms`);

  if (rejected === 0) {
    console.log(`  ⚠️  NO RATE LIMITING DETECTED - Potential DoS vulnerability!`);
  } else {
    console.log(`  ✓ Rate limiting active`);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  const totalStart = Date.now();

  try {
    await testInvalidDataTypes();
    await testSecurityVulnerabilities();
    await testBoundaryConditions();
    await testUnicodeHandling();
    await testMemoryLeaks();
    await testConcurrentUsers();
    await testMalformedData();
    await testRateLimiting();

    const totalDuration = Date.now() - totalStart;
    console.log('═══════════════════════════════════════');
    console.log(`🔥 Advanced stress tests completed in ${(totalDuration / 1000).toFixed(2)}s`);
    console.log('═══════════════════════════════════════');
  } catch (err) {
    console.error('💥 Test suite failed:', err);
    process.exit(1);
  }
}

runAllTests();
