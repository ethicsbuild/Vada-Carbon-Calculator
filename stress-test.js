#!/usr/bin/env node
import 'dotenv/config';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const NUM_CONCURRENT = 10;
const NUM_ITERATIONS = 5;

console.log(`🧪 VADA CarbonCoPilot Stress Test Suite`);
console.log(`📍 Target: ${BASE_URL}`);
console.log(`⚡ Concurrent requests: ${NUM_CONCURRENT}`);
console.log(`🔄 Iterations per test: ${NUM_ITERATIONS}\n`);

// Test 1: Contact Form Submission Stress Test
async function testContactFormSubmissions() {
  console.log('📧 Test 1: Contact Form Submissions');
  const start = Date.now();
  const results = { success: 0, failed: 0, errors: [] };

  const promises = [];
  for (let i = 0; i < NUM_CONCURRENT * NUM_ITERATIONS; i++) {
    promises.push(
      fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Stress Test User ${i}`,
          email: `test${i}@stresstest.com`,
          message: `This is stress test message #${i}. Testing system under load with concurrent submissions.`
        })
      })
        .then(res => {
          if (res.ok) {
            results.success++;
          } else {
            results.failed++;
            results.errors.push(`Contact ${i}: ${res.status}`);
          }
        })
        .catch(err => {
          results.failed++;
          results.errors.push(`Contact ${i}: ${err.message}`);
        })
    );
  }

  await Promise.all(promises);
  const duration = Date.now() - start;

  console.log(`✅ Success: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏱️  Duration: ${duration}ms (${(duration / promises.length).toFixed(2)}ms avg)`);
  if (results.errors.length > 0 && results.errors.length <= 5) {
    console.log(`⚠️  Errors:`, results.errors);
  }
  console.log('');
}

// Test 2: Event Calculation Stress Test
async function testEventCalculations() {
  console.log('📊 Test 2: Event Calculations');
  const start = Date.now();
  const results = { success: 0, failed: 0, errors: [] };

  const eventTypes = ['festival', 'conference', 'wedding', 'concert'];
  const promises = [];

  for (let i = 0; i < NUM_CONCURRENT * NUM_ITERATIONS; i++) {
    const eventData = {
      eventType: eventTypes[i % eventTypes.length],
      attendance: 100 + (i * 100),
      duration: 1 + (i % 3),
      location: `Test Location ${i}`,
      transportMode: 'mixed',
      localPercentage: 50,
      venueType: i % 2 === 0 ? 'indoor' : 'outdoor',
      powerSource: i % 3 === 0 ? 'solar' : 'grid',
      accommodation: false,
    };

    promises.push(
      fetch(`${BASE_URL}/api/calculate-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })
        .then(res => {
          if (res.ok) {
            results.success++;
            return res.json();
          } else {
            results.failed++;
            results.errors.push(`Calc ${i}: ${res.status}`);
          }
        })
        .catch(err => {
          results.failed++;
          results.errors.push(`Calc ${i}: ${err.message}`);
        })
    );
  }

  await Promise.all(promises);
  const duration = Date.now() - start;

  console.log(`✅ Success: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏱️  Duration: ${duration}ms (${(duration / promises.length).toFixed(2)}ms avg)`);
  if (results.errors.length > 0 && results.errors.length <= 5) {
    console.log(`⚠️  Errors:`, results.errors);
  }
  console.log('');
}

// Test 3: Extreme Value Testing
async function testExtremeValues() {
  console.log('💥 Test 3: Extreme Values');
  const start = Date.now();
  const results = { success: 0, failed: 0, errors: [] };

  const extremeCases = [
    { name: 'Tiny Event', attendance: 1, duration: 1 },
    { name: 'Huge Festival', attendance: 500000, duration: 7 },
    { name: 'Zero Attendance', attendance: 0, duration: 1 },
    { name: 'Long Duration', attendance: 1000, duration: 365 },
    { name: 'Negative Test', attendance: -100, duration: -1 },
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
          location: 'Test',
          transportMode: 'mixed',
          venueType: 'outdoor',
          powerSource: 'grid',
        })
      });

      if (res.ok) {
        const data = await res.json();
        results.success++;
        console.log(`  ✓ ${testCase.name}: ${data.total?.toFixed(2) || 'N/A'} tons CO2`);
      } else {
        results.failed++;
        console.log(`  ✗ ${testCase.name}: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      results.failed++;
      console.log(`  ✗ ${testCase.name}: ${err.message}`);
    }
  }

  const duration = Date.now() - start;
  console.log(`⏱️  Duration: ${duration}ms`);
  console.log('');
}

// Test 4: Database Connection Stress
async function testDatabaseConnections() {
  console.log('🗄️  Test 4: Database Connections');
  const start = Date.now();
  const results = { success: 0, failed: 0 };

  // Test rapid-fire reads and writes
  const promises = [];

  for (let i = 0; i < NUM_CONCURRENT; i++) {
    // Create contact submission
    promises.push(
      fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `DB Test ${i}`,
          email: `dbtest${i}@test.com`,
          message: 'Database stress test'
        })
      })
        .then(res => res.ok ? results.success++ : results.failed++)
        .catch(() => results.failed++)
    );

    // Test health check (lightweight)
    promises.push(
      fetch(`${BASE_URL}/api/health`)
        .then(res => res.ok ? results.success++ : results.failed++)
        .catch(() => results.failed++)
    );
  }

  await Promise.all(promises);
  const duration = Date.now() - start;

  console.log(`✅ Success: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏱️  Duration: ${duration}ms (${(duration / promises.length).toFixed(2)}ms avg)`);
  console.log('');
}

// Test 5: API Response Times
async function testAPIResponseTimes() {
  console.log('⚡ Test 5: API Response Times');

  const endpoints = [
    { name: 'Health Check', url: '/api/health', method: 'GET' },
    { name: 'Emission Factors', url: '/api/emission-factors', method: 'GET' },
  ];

  for (const endpoint of endpoints) {
    const times = [];

    for (let i = 0; i < 10; i++) {
      const start = Date.now();
      try {
        const res = await fetch(`${BASE_URL}${endpoint.url}`);
        const duration = Date.now() - start;
        if (res.ok) {
          times.push(duration);
        }
      } catch (err) {
        // Skip failed requests
      }
    }

    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      console.log(`  ${endpoint.name}:`);
      console.log(`    Avg: ${avg.toFixed(2)}ms | Min: ${min}ms | Max: ${max}ms`);
    }
  }
  console.log('');
}

// Test 6: Memory Leak Detection (large payloads)
async function testLargePayloads() {
  console.log('📦 Test 6: Large Payload Handling');
  const start = Date.now();

  // Create a very large event calculation
  const hugeEvent = {
    eventType: 'festival',
    attendance: 100000,
    duration: 7,
    location: 'A'.repeat(1000), // Large string
    transportMode: 'mixed',
    venueType: 'outdoor',
    powerSource: 'grid',
    notes: 'X'.repeat(10000), // Very large notes field
  };

  try {
    const res = await fetch(`${BASE_URL}/api/calculate-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hugeEvent)
    });

    const duration = Date.now() - start;

    if (res.ok) {
      const data = await res.json();
      console.log(`  ✓ Large payload processed: ${data.total?.toFixed(2)} tons CO2`);
      console.log(`  ⏱️  Duration: ${duration}ms`);
    } else {
      console.log(`  ✗ Failed: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  const totalStart = Date.now();

  try {
    await testContactFormSubmissions();
    await testEventCalculations();
    await testExtremeValues();
    await testDatabaseConnections();
    await testAPIResponseTimes();
    await testLargePayloads();

    const totalDuration = Date.now() - totalStart;
    console.log('═══════════════════════════════════════');
    console.log(`🎉 All tests completed in ${(totalDuration / 1000).toFixed(2)}s`);
    console.log('═══════════════════════════════════════');
  } catch (err) {
    console.error('💥 Test suite failed:', err);
    process.exit(1);
  }
}

// Run tests
runAllTests();
