#!/usr/bin/env node
import 'dotenv/config';
import { WebSocket } from 'ws';

console.log('🧪 Testing Sage API Mode...\n');

const ws = new WebSocket('ws://localhost:3000/api/chat');

ws.on('open', () => {
  console.log('✓ Connected to Sage\n');

  setTimeout(() => {
    console.log('📤 Sending: "Hello Sage, tell me about yourself"\n');
    ws.send(JSON.stringify({
      type: 'message',
      content: 'Hello Sage, tell me about yourself',
      conversationId: Date.now(),
      eventType: 'festival'
    }));
  }, 100);

  setTimeout(() => {
    ws.close();
  }, 5000);
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());

  if (msg.type === 'stream') {
    process.stdout.write(msg.content);
  } else if (msg.type === 'complete') {
    console.log('\n\n📥 Response complete\n');
  }
});

ws.on('close', () => {
  console.log('\n✓ Connection closed\n');
  process.exit(0);
});

ws.on('error', (err) => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
