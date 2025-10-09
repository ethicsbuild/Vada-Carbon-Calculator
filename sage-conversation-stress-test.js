#!/usr/bin/env node
import 'dotenv/config';
import { WebSocket } from 'ws';

console.log('🧪 SAGE CONVERSATION STRESS TEST');
console.log('Testing conversational AI elements, personality, and context retention\n');

const BASE_URL = 'ws://localhost:3000/api/chat';

// Test scenarios
const conversationScenarios = [
  {
    name: 'First-Timer Festival Organizer',
    messages: [
      "Hi Sage, I'm organizing my first music festival and I'm worried about the carbon footprint",
      "We're expecting around 2000 people over 2 days in Oregon",
      "Most people will probably drive, we're in a pretty rural area",
      "What can I do to reduce emissions without making it impossible for people to get there?",
      "How much would solar panels cost to rent?"
    ]
  },
  {
    name: 'Corporate Event Planner',
    messages: [
      "I need a carbon report for our board of directors",
      "It's a 3-day tech conference in San Francisco with 500 attendees",
      "We have a sustainability budget of $50,000",
      "What are the highest impact changes we can make?",
      "Can you give me specific vendor recommendations?"
    ]
  },
  {
    name: 'Experienced Festival Veteran',
    messages: [
      "Hey Sage, we've been running our festival for 10 years",
      "Last year we did 5000 people, 4 days, mostly solar power",
      "We already have shuttle buses from major cities",
      "Looking to push even further - what's next level?",
      "Tell me about some innovative solutions you've seen at Burning Man"
    ]
  },
  {
    name: 'Budget-Conscious Small Event',
    messages: [
      "I'm planning a small community concert, maybe 300 people",
      "We have almost no budget for sustainability",
      "What are some free or very cheap things we can do?",
      "Is it even worth trying with such a small event?"
    ]
  },
  {
    name: 'Rapid-Fire Questions',
    messages: [
      "Quick question - best transport option?",
      "What about generators?",
      "Solar vs hybrid?",
      "Composting vendors?",
      "Carbon offsets - worth it?"
    ]
  },
  {
    name: 'Context Retention Test',
    messages: [
      "Planning a festival in California",
      "3000 attendees",
      "Tell me about the transportation emissions",
      "What was that number again for transportation?",
      "And how does that compare to the total?"
    ]
  },
  {
    name: 'Technical Deep Dive',
    messages: [
      "Explain how you calculate transportation emissions",
      "What EPA conversion factors do you use?",
      "How accurate are these estimates?",
      "Do you account for electric vehicles?",
      "What about carpooling incentives?"
    ]
  },
  {
    name: 'Emotional Support',
    messages: [
      "I feel overwhelmed by all this climate stuff",
      "My team thinks sustainability is too expensive",
      "I'm worried we can't make a real difference",
      "How do you stay motivated?"
    ]
  }
];

// Utility to run a conversation
async function runConversation(scenario, scenarioIndex, totalScenarios) {
  return new Promise((resolve) => {
    const ws = new WebSocket(BASE_URL);
    const conversationId = Date.now() + scenarioIndex;
    let messageCount = 0;
    let responseTimes = [];
    let responses = [];
    let errors = [];

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Scenario ${scenarioIndex + 1}/${totalScenarios}: ${scenario.name}`);
    console.log('='.repeat(60));

    ws.on('open', () => {
      console.log('✓ Connected');

      // Send messages with delays
      scenario.messages.forEach((message, index) => {
        setTimeout(() => {
          const startTime = Date.now();
          console.log(`\n💬 User: "${message}"`);

          ws.send(JSON.stringify({
            type: 'message',
            content: message,
            conversationId,
            eventType: 'festival'
          }));

          // Track response time
          const checkResponse = setInterval(() => {
            if (responses.length > messageCount) {
              const responseTime = Date.now() - startTime;
              responseTimes.push(responseTime);
              clearInterval(checkResponse);
            }
          }, 50);
        }, index * 3000); // 3 seconds between messages
      });

      // Close connection after all messages
      setTimeout(() => {
        ws.close();
      }, scenario.messages.length * 3000 + 2000);
    });

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === 'stream') {
          process.stdout.write(msg.content);
        } else if (msg.type === 'complete') {
          messageCount++;
          console.log('\n');

          if (msg.fullResponse) {
            responses.push(msg.fullResponse);
          }

          // Log extracted data
          if (msg.extractedData && Object.keys(msg.extractedData).length > 1) {
            console.log(`📊 Extracted: ${JSON.stringify(msg.extractedData, null, 2)}`);
          }

          // Log carbon calculation
          if (msg.carbonCalculation) {
            console.log(`🌱 Carbon: ${msg.carbonCalculation.total} tons CO2e`);
          }
        } else if (msg.type === 'error') {
          errors.push(msg.message);
          console.log(`\n❌ Error: ${msg.message}`);
        }
      } catch (err) {
        console.log(`\n⚠️  Parse error: ${err.message}`);
      }
    });

    ws.on('close', () => {
      console.log('\n✓ Connection closed');

      // Calculate stats
      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;
      const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
      const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;

      console.log('\n📊 Scenario Stats:');
      console.log(`   - Messages sent: ${scenario.messages.length}`);
      console.log(`   - Responses received: ${messageCount}`);
      console.log(`   - Errors: ${errors.length}`);
      console.log(`   - Avg response time: ${avgResponseTime.toFixed(0)}ms`);
      console.log(`   - Min response time: ${minResponseTime}ms`);
      console.log(`   - Max response time: ${maxResponseTime}ms`);

      // Assess response quality
      const totalWords = responses.join(' ').split(' ').length;
      const avgWordsPerResponse = responses.length > 0 ? totalWords / responses.length : 0;
      console.log(`   - Avg response length: ${avgWordsPerResponse.toFixed(0)} words`);

      resolve({
        scenario: scenario.name,
        messagesSent: scenario.messages.length,
        responsesReceived: messageCount,
        errors: errors.length,
        avgResponseTime,
        minResponseTime,
        maxResponseTime,
        avgWordsPerResponse
      });
    });

    ws.on('error', (err) => {
      console.log(`\n❌ WebSocket error: ${err.message}`);
      errors.push(err.message);
      resolve({
        scenario: scenario.name,
        messagesSent: scenario.messages.length,
        responsesReceived: messageCount,
        errors: errors.length + 1,
        avgResponseTime: 0,
        failed: true
      });
    });

    // Timeout safety
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }, scenario.messages.length * 3000 + 5000);
  });
}

// Concurrent conversation test
async function concurrentConversationsTest() {
  console.log('\n\n' + '='.repeat(60));
  console.log('CONCURRENT CONVERSATIONS TEST');
  console.log('Testing 3 simultaneous conversations');
  console.log('='.repeat(60));

  const scenarios = [
    {
      name: 'User A - Quick Question',
      messages: ['What are the main sources of carbon at festivals?', 'Thanks!']
    },
    {
      name: 'User B - Detailed Planning',
      messages: ['Planning 1000 person concert', 'In Seattle', 'Need help with transportation']
    },
    {
      name: 'User C - Follow-up',
      messages: ['I asked about solar earlier', 'Can you remind me of the cost?']
    }
  ];

  const startTime = Date.now();
  const results = await Promise.all(
    scenarios.map((scenario, index) => runConversation(scenario, index, scenarios.length))
  );
  const totalTime = Date.now() - startTime;

  console.log('\n📊 Concurrent Test Results:');
  console.log(`   - Total time: ${(totalTime / 1000).toFixed(1)}s`);
  console.log(`   - All conversations handled: ${results.every(r => !r.failed) ? '✓' : '✗'}`);
}

// Long conversation test
async function longConversationTest() {
  console.log('\n\n' + '='.repeat(60));
  console.log('LONG CONVERSATION TEST');
  console.log('Testing sustained conversation with context');
  console.log('='.repeat(60));

  const longScenario = {
    name: 'Extended Planning Session',
    messages: [
      "Hi Sage, I'm planning a large music festival",
      "We're expecting 10,000 people",
      "It's a 5-day event in Colorado",
      "We have a $200,000 sustainability budget",
      "What should we prioritize?",
      "Tell me more about transportation",
      "What about chartered buses from Denver?",
      "How many buses would we need for 10,000 people?",
      "And what about solar power for the stages?",
      "Can we mix solar with generators?",
      "What's the carbon difference between diesel and biodiesel?",
      "Should we do carbon offsets?",
      "How do we communicate this to attendees?",
      "What if we incentivize carpooling?",
      "Can you summarize the top 3 recommendations?"
    ]
  };

  await runConversation(longScenario, 0, 1);
}

// Main test runner
async function runAllTests() {
  const totalStart = Date.now();

  console.log('Starting Sage Conversation Stress Test...\n');
  console.log(`Testing ${conversationScenarios.length} conversation scenarios\n`);

  const results = [];

  // Run scenarios sequentially
  for (let i = 0; i < conversationScenarios.length; i++) {
    const result = await runConversation(conversationScenarios[i], i, conversationScenarios.length);
    results.push(result);

    // Pause between scenarios
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Run concurrent test
  await new Promise(resolve => setTimeout(resolve, 3000));
  await concurrentConversationsTest();

  // Run long conversation test
  await new Promise(resolve => setTimeout(resolve, 3000));
  await longConversationTest();

  const totalTime = Date.now() - totalStart;

  // Final summary
  console.log('\n\n' + '='.repeat(60));
  console.log('FINAL STRESS TEST SUMMARY');
  console.log('='.repeat(60));

  const totalMessages = results.reduce((sum, r) => sum + r.messagesSent, 0);
  const totalResponses = results.reduce((sum, r) => sum + r.responsesReceived, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
  const avgResponseTime = results
    .filter(r => !r.failed)
    .reduce((sum, r) => sum + r.avgResponseTime, 0) / results.filter(r => !r.failed).length;

  console.log(`\n📊 Overall Statistics:`);
  console.log(`   - Total scenarios tested: ${conversationScenarios.length}`);
  console.log(`   - Total messages sent: ${totalMessages}`);
  console.log(`   - Total responses received: ${totalResponses}`);
  console.log(`   - Success rate: ${((totalResponses / totalMessages) * 100).toFixed(1)}%`);
  console.log(`   - Total errors: ${totalErrors}`);
  console.log(`   - Average response time: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`   - Total test duration: ${(totalTime / 1000).toFixed(1)}s`);

  console.log(`\n📋 Scenario Breakdown:`);
  results.forEach(r => {
    const status = r.failed ? '✗' : r.responsesReceived === r.messagesSent ? '✓' : '⚠️';
    console.log(`   ${status} ${r.scenario}: ${r.responsesReceived}/${r.messagesSent} responses (${r.avgResponseTime?.toFixed(0) || 'N/A'}ms avg)`);
  });

  console.log('\n🎯 Assessment:');
  if (totalErrors === 0 && totalResponses === totalMessages) {
    console.log('   ✅ EXCELLENT - All conversations handled perfectly');
  } else if (totalErrors < 3 && totalResponses > totalMessages * 0.9) {
    console.log('   ✓ GOOD - Most conversations successful');
  } else {
    console.log('   ⚠️  NEEDS WORK - Significant issues detected');
  }

  if (avgResponseTime < 2000) {
    console.log('   ✅ Response times excellent (<2s average)');
  } else if (avgResponseTime < 5000) {
    console.log('   ✓ Response times acceptable (2-5s average)');
  } else {
    console.log('   ⚠️  Response times slow (>5s average)');
  }

  console.log('\n' + '='.repeat(60));
  console.log('Stress test complete!');
  console.log('='.repeat(60) + '\n');

  process.exit(0);
}

// Run tests
runAllTests().catch(err => {
  console.error('💥 Test suite failed:', err);
  process.exit(1);
});
