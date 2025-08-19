# WAHA SDK - TypeScript WhatsApp HTTP API Client

<div align="center">
  <img src="https://waha.devlike.pro/images/logo.svg" alt="WAHA Logo" width="200" height="200">
  
  [![npm version](https://badge.fury.io/js/waha-sdk.svg)](https://badge.fury.io/js/waha-sdk)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

## Overview

**WAHA SDK** is a comprehensive TypeScript/JavaScript client library for the [WAHA (WhatsApp HTTP API)](https://waha.devlike.pro) service. Send WhatsApp messages, manage sessions, handle media, and integrate WhatsApp into your applications with ease.

### Key Features

- 🚀 **Zero Dependencies** - Built with native fetch API
- 📝 **Full TypeScript Support** - Complete type safety and IntelliSense
- 🏗️ **Organized Architecture** - Clean namespace-based API design
- ⚡ **Modern & Fast** - Uses native fetch with timeout support
- 🔒 **Production Ready** - Comprehensive error handling and validation
- 📱 **Complete API Coverage** - All WAHA endpoints supported

## Installation

```bash
npm install waha-sdk
```

```bash
yarn add waha-sdk
```

```bash
pnpm add waha-sdk
```

```bash
bun add waha-sdk
```

## Quick Start

```typescript
import { WahaClient } from 'waha-sdk';

// Initialize the client
const client = new WahaClient({
    baseUrl: 'http://localhost:3000', // Your WAHA server URL
    apiKey: 'your-api-key',           // Your API key
    timeout: 30000                    // Optional: request timeout in ms
});

// Start a session
await client.sessions.start('default');

// Send a message
await client.messages.sendText({
    session: 'default',
    chatId: '1234567890@c.us',
    text: 'Hello from WAHA SDK! 👋'
});
```

## Authentication

### QR Code Authentication (Recommended)

```typescript
// Get QR code as base64 image
const qrImage = await client.auth.getQR('default', 'image');
console.log('Scan this QR code:', qrImage);

// Or get QR code as raw text
const qrText = await client.auth.getQR('default', 'raw');
console.log('QR Code text:', qrText);

// Check session status
const session = await client.sessions.get('default');
console.log('Session status:', session.status); // SCAN_QR_CODE, WORKING, etc.
```

### Phone Number Authentication

```typescript
// Request verification code
await client.auth.requestCode('default', {
    phoneNumber: '+1234567890',
    method: 'sms', // or 'voice'
    code: '123456' // Enter the received code
});
```

## Core Features

### Session Management

```typescript
// Create a new session
await client.sessions.create({
    name: 'my-session',
    start: true
});

// List all sessions
const sessions = await client.sessions.list();

// Start/stop sessions
await client.sessions.start('default');
await client.sessions.stop('default');

// Get session info
const sessionInfo = await client.sessions.get('default');
console.log('Session status:', sessionInfo.status);

// Get current user info
const me = await client.sessions.getMe('default');
console.log('My number:', me.id);
```

### Sending Messages

#### Text Messages

```typescript
await client.messages.sendText({
    session: 'default',
    chatId: '1234567890@c.us',
    text: 'Hello World! 🌍'
});

// With reply
await client.messages.sendText({
    session: 'default',
    chatId: '1234567890@c.us',
    text: 'This is a reply',
    reply_to: 'message-id'
});
```

#### Media Messages

```typescript
// Send image
await client.messages.sendImage({
    session: 'default',
    chatId: '1234567890@c.us',
    file: {
        mimetype: 'image/jpeg',
        filename: 'photo.jpg',
        data: 'base64-encoded-image-data'
    },
    caption: 'Check out this photo! 📸'
});

// Send file/document
await client.messages.sendFile({
    session: 'default',
    chatId: '1234567890@c.us',
    file: {
        mimetype: 'application/pdf',
        filename: 'document.pdf',
        data: 'base64-encoded-pdf-data'
    }
});

// Send voice message
await client.messages.sendVoice({
    session: 'default',
    chatId: '1234567890@c.us',
    file: {
        mimetype: 'audio/ogg',
        filename: 'voice.ogg',
        data: 'base64-encoded-audio-data'
    }
});

// Send video
await client.messages.sendVideo({
    session: 'default',
    chatId: '1234567890@c.us',
    file: {
        mimetype: 'video/mp4',
        filename: 'video.mp4',
        data: 'base64-encoded-video-data'
    },
    caption: 'Video caption'
});
```

#### Location & Contacts

```typescript
// Send location
await client.messages.sendLocation({
    session: 'default',
    chatId: '1234567890@c.us',
    latitude: 37.7749,
    longitude: -122.4194,
    title: 'San Francisco'
});

// Send contact
await client.messages.sendContactVcard({
    session: 'default',
    chatId: '1234567890@c.us',
    contactId: '1234567890@c.us'
});
```

### Chat Management

```typescript
// List all chats
const chats = await client.chats.list('default', {
    limit: 100,
    offset: 0
});

// Get chat messages
const messages = await client.chats.getMessages('default', '1234567890@c.us', {
    limit: 50,
    downloadMedia: false
});

// Delete chat
await client.chats.delete('default', '1234567890@c.us');

// Archive/unarchive chat
await client.chats.archive('default', '1234567890@c.us');
await client.chats.unarchive('default', '1234567890@c.us');

// Mark as read
await client.chats.readMessages('default', '1234567890@c.us', ['message-id-1', 'message-id-2']);
```

### Message Interactions

```typescript
// Mark message as seen
await client.messages.sendSeen({
    session: 'default',
    chatId: '1234567890@c.us',
    participant: '1234567890@c.us', // For group chats
    messageId: 'message-id'
});

// Add reaction
await client.messages.setReaction({
    session: 'default',
    chatId: '1234567890@c.us',
    messageId: 'message-id',
    reaction: '👍'
});

// Star/unstar message
await client.messages.setStar({
    session: 'default',
    chatId: '1234567890@c.us',
    messageId: 'message-id',
    star: true
});

// Typing indicators
await client.messages.startTyping({
    session: 'default',
    chatId: '1234567890@c.us'
});

await client.messages.stopTyping({
    session: 'default',
    chatId: '1234567890@c.us'
});
```

### Profile Management

```typescript
// Get profile info
const profile = await client.profile.get('default');

// Update profile name
await client.profile.setName('default', {
    name: 'My New Name'
});

// Update status
await client.profile.setStatus('default', {
    status: 'Available for chat! 💬'
});

// Set profile picture
await client.profile.setPicture('default', {
    file: {
        mimetype: 'image/jpeg',
        filename: 'profile.jpg',
        data: 'base64-encoded-image'
    }
});
```

### Contacts

```typescript
// Get all contacts
const contacts = await client.contacts.getAll('default', {
    limit: 100,
    offset: 0
});

// Check if number exists on WhatsApp
const exists = await client.contacts.checkExists('+1234567890', 'default');
console.log('Number exists:', exists.exists);

// Get contact info
const contact = await client.contacts.get('1234567890@c.us', 'default');

// Get profile picture
const profilePic = await client.contacts.getProfilePicture('1234567890@c.us', 'default');
```

### WhatsApp Channels

```typescript
// List channels
const channels = await client.channels.list('default', 'SUBSCRIBER');

// Follow/unfollow channel
await client.channels.follow('default', 'channel-id');
await client.channels.unfollow('default', 'channel-id');

// Search channels
const searchResults = await client.channels.searchByText('default', {
    text: 'technology',
    limit: 10
});
```

### Labels (Chat Organization)

```typescript
// Get all labels
const labels = await client.labels.getAll('default');

// Create label
await client.labels.create('default', {
    name: 'Important',
    color: 1
});

// Add label to chat
await client.labels.setChatLabels('default', '1234567890@c.us', ['label-id']);

// Get chats by label
const labeledChats = await client.labels.getChatsByLabel('default', 'label-id');
```

### Status Updates

```typescript
// Send text status
await client.status.sendText('default', {
    text: 'Hello from my status! 👋',
    backgroundColor: '#FF0000',
    fontColor: '#FFFFFF'
});

// Send image status
await client.status.sendImage('default', {
    file: {
        mimetype: 'image/jpeg',
        filename: 'status.jpg',
        data: 'base64-image-data'
    },
    caption: 'Status caption'
});
```

## Configuration

### Client Options

```typescript
const client = new WahaClient({
    baseUrl: 'https://your-waha-server.com',
    apiKey: 'your-api-key',
    timeout: 30000 // Request timeout in milliseconds (optional, default: 30000)
});

// Update configuration at runtime
client.updateApiKey('new-api-key');
client.updateBaseUrl('https://new-server.com');
```

### Error Handling

```typescript
import { WahaApiError } from 'waha-sdk';

try {
    await client.messages.sendText({
        session: 'default',
        chatId: 'invalid-chat-id',
        text: 'Hello'
    });
} catch (error) {
    if (error instanceof WahaApiError) {
        console.error('API Error:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            response: error.response
        });
    } else {
        console.error('Unexpected error:', error);
    }
}
```

## Advanced Usage

### Custom HTTP Client Access

```typescript
// Access the underlying HTTP client for custom requests
const httpClient = client.getHttpClient();
const response = await httpClient.get('/custom-endpoint');
```

### File Handling

You can send files using either base64 encoding or URLs:

```typescript
// Base64 approach
const file = {
    mimetype: 'image/jpeg',
    filename: 'image.jpg',
    data: 'base64-encoded-data'
};

// URL approach (if your WAHA server supports it)
const fileUrl = 'https://example.com/image.jpg';

await client.messages.sendImage({
    session: 'default',
    chatId: '1234567890@c.us',
    file: file, // or fileUrl
    caption: 'Image caption'
});
```

### Pagination

Most list endpoints support pagination:

```typescript
const chats = await client.chats.list('default', {
    limit: 50,        // Number of items per page
    offset: 0,        // Number of items to skip
    sortBy: 'lastMessageTime',
    sortOrder: 'desc'
});

console.log(`Loaded ${chats.length} chats`);
```

### Message Filtering

```typescript
const messages = await client.chats.getMessages('default', '1234567890@c.us', {
    limit: 100,
    offset: 0,
    downloadMedia: false,
    fromMe: true,        // Only messages sent by you
    ack: ['READ'],       // Only read messages
    fromTimestamp: Date.now() - 86400000 // Last 24 hours
});
```

## TypeScript Support

The SDK is built with TypeScript and provides complete type definitions:

```typescript
import { 
    WahaClient, 
    WahaClientConfig, 
    SessionInfo, 
    WAMessage, 
    ContactInfo,
    ChatInfo
} from 'waha-sdk';

// Full type safety and IntelliSense support
const config: WahaClientConfig = {
    baseUrl: 'http://localhost:3000',
    apiKey: 'your-key'
};

const client = new WahaClient(config);

// Types are automatically inferred
const sessions: SessionInfo[] = await client.sessions.list();
const messages: WAMessage[] = await client.chats.getMessages('default', 'chat-id');
```

## Common Use Cases

### Chatbot Integration

```typescript
class WhatsAppBot {
    private client: WahaClient;

    constructor() {
        this.client = new WahaClient({
            baseUrl: process.env.WAHA_URL!,
            apiKey: process.env.WAHA_API_KEY!
        });
    }

    async handleIncomingMessage(message: WAMessage) {
        if (message.body.startsWith('/help')) {
            await this.client.messages.sendText({
                session: 'default',
                chatId: message.from,
                text: 'Available commands: /help, /status, /info'
            });
        }
    }

    async broadcastMessage(chatIds: string[], message: string) {
        for (const chatId of chatIds) {
            await this.client.messages.sendText({
                session: 'default',
                chatId,
                text: message
            });
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
```

### Customer Support Integration

```typescript
class CustomerSupport {
    private client: WahaClient;

    constructor() {
        this.client = new WahaClient({
            baseUrl: process.env.WAHA_URL!,
            apiKey: process.env.WAHA_API_KEY!
        });
    }

    async createTicket(customerPhone: string, issue: string) {
        const ticketId = `TICKET-${Date.now()}`;
        
        await this.client.messages.sendText({
            session: 'default',
            chatId: `${customerPhone}@c.us`,
            text: `Thank you for contacting us! 

Your ticket ID: ${ticketId}
Issue: ${issue}

We'll get back to you within 24 hours.`
        });

        // Add label for organization
        await this.client.labels.setChatLabels('default', `${customerPhone}@c.us`, ['support-ticket']);
        
        return ticketId;
    }
}
```

## Best Practices

### 1. Error Handling
Always wrap API calls in try-catch blocks and handle different error types appropriately.

### 2. Rate Limiting
Implement delays between bulk operations to avoid overwhelming the WhatsApp servers.

### 3. Session Management
Monitor session status and handle disconnections gracefully.

### 4. Media Handling
For large media files, consider using URLs instead of base64 encoding to reduce memory usage.

### 5. Logging
Implement proper logging for debugging and monitoring:

```typescript
import { WahaClient, WahaApiError } from 'waha-sdk';

const client = new WahaClient(config);

// Add request logging
async function sendMessageWithLogging(request: any) {
    console.log('Sending message:', request);
    
    try {
        const result = await client.messages.sendText(request);
        console.log('Message sent successfully:', result);
        return result;
    } catch (error) {
        if (error instanceof WahaApiError) {
            console.error('WAHA API Error:', {
                status: error.status,
                message: error.message,
                response: error.response
            });
        }
        throw error;
    }
}
```

## Troubleshooting

### Common Issues

1. **Session not working**: Check session status and ensure QR code was scanned
2. **API Key errors**: Verify your API key is correct and has proper permissions
3. **Timeout errors**: Increase timeout value or check network connectivity
4. **Media upload fails**: Ensure base64 data is properly formatted
5. **Chat ID format**: Use proper format: `phone@c.us` for individual chats, `groupid@g.us` for groups

### Debug Mode

Enable detailed logging by checking response objects:

```typescript
try {
    const response = await client.sessions.get('default');
    console.log('Full response:', response);
} catch (error) {
    console.error('Detailed error:', error);
}
```

## Support and Documentation

- **WAHA Documentation**: [https://waha.devlike.pro](https://waha.devlike.pro)
- **GitHub Issues**: Report bugs and request features
- **Community**: Join discussions about WAHA integration

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by the Wavez Team
</div>