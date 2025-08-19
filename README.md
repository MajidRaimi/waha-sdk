# WAHA SDK

A comprehensive TypeScript SDK for the WAHA (WhatsApp HTTP API) service with organized namespaces and full response schema support.

## Installation

```bash
npm install waha-sdk
```

## Features

✅ **Organized Namespaces** - Clean API structure (waha.profile, waha.sessions, etc.)  
✅ **Axios Integration** - All responses return `response.data` automatically  
✅ **Full TypeScript Support** - Complete type definitions and IntelliSense  
✅ **Proper Error Handling** - Custom `WahaApiError` with detailed error info  
✅ **Response Schemas** - Validated response types for all endpoints  
✅ **Modern Architecture** - Built with axios, timeout support, interceptors  
✅ **Flexible Configuration** - Configurable base URL, API key, and timeout

## Quick Start

```typescript
import { WahaClient } from 'waha-sdk';

const waha = new WahaClient({
    baseUrl: 'http://localhost:3000',
    apiKey: 'your-api-key',
    timeout: 30000, // optional
});

// All methods are organized by namespace
await waha.sessions.create({ name: 'default', start: true });
await waha.auth.getQR('default', 'image');
await waha.messages.sendText({
    chatId: '1234567890@c.us',
    text: 'Hello World!',
    session: 'default',
});
```

## Organized API Structure

The SDK is organized into logical namespaces:

### 🔐 Authentication (`waha.auth`)

```typescript
// Get QR code for pairing
const qr = await waha.auth.getQR('default', 'image');

// Request authentication code
await waha.auth.requestCode('default', {
    phoneNumber: '+1234567890',
    method: 'sms',
});
```

### 🖥️ Session Management (`waha.sessions`)

```typescript
// Create and manage sessions
const session = await waha.sessions.create({
    name: 'my-session',
    start: true,
});

await waha.sessions.start('my-session');
await waha.sessions.stop('my-session');
await waha.sessions.restart('my-session');

// Get session info
const info = await waha.sessions.get('my-session');
const me = await waha.sessions.getMe('my-session');

// List all sessions
const sessions = await waha.sessions.list();
```

### 👤 Profile Management (`waha.profile`)

```typescript
// Get profile info
const profile = await waha.profile.get('default');

// Update profile
await waha.profile.setName('default', { name: 'My Bot Name' });
await waha.profile.setStatus('default', { status: 'Available' });

// Manage profile picture
await waha.profile.setPicture('default', {
    file: {
        mimetype: 'image/png',
        filename: 'avatar.png',
        data: 'base64-encoded-data',
    },
});

await waha.profile.deletePicture('default');
```

### 📤 Messaging (`waha.messages`)

```typescript
// Send different types of messages
await waha.messages.sendText({
    chatId: '1234567890@c.us',
    text: 'Hello World!',
    session: 'default',
});

await waha.messages.sendImage({
    chatId: '1234567890@c.us',
    file: { url: 'https://example.com/image.jpg' },
    caption: 'Check this out!',
    session: 'default',
});

await waha.messages.sendFile({
    chatId: '1234567890@c.us',
    file: { url: 'https://example.com/document.pdf' },
    filename: 'document.pdf',
    session: 'default',
});

await waha.messages.sendLocation({
    chatId: '1234567890@c.us',
    latitude: 40.7128,
    longitude: -74.006,
    name: 'New York City',
    session: 'default',
});

// Message interactions
await waha.messages.setReaction({
    chatId: '1234567890@c.us',
    messageId: 'message-id',
    reaction: '👍',
    session: 'default',
});

await waha.messages.setStar({
    chatId: '1234567890@c.us',
    messageId: 'message-id',
    star: true,
    session: 'default',
});

// Typing indicators
await waha.messages.startTyping({
    chatId: '1234567890@c.us',
    session: 'default',
});
await waha.messages.stopTyping({
    chatId: '1234567890@c.us',
    session: 'default',
});
```

### 💬 Chat Management (`waha.chats`)

```typescript
// Get chats
const chats = await waha.chats.list('default', {
    limit: 20,
    sortBy: 'conversationTimestamp',
    sortOrder: 'desc',
});

// Get chat overview (optimized for UI)
const overview = await waha.chats.overview('default', { limit: 50 });

// Get chat messages
const messages = await waha.chats.getMessages('default', '1234567890@c.us', {
    limit: 50,
    downloadMedia: false,
    'filter.fromMe': false,
});

// Get specific message
const message = await waha.chats.getMessage(
    'default',
    '1234567890@c.us',
    'message-id'
);

// Chat operations
await waha.chats.archive('default', '1234567890@c.us');
await waha.chats.unarchive('default', '1234567890@c.us');
await waha.chats.delete('default', '1234567890@c.us');

// Message operations
await waha.chats.deleteMessage('default', '1234567890@c.us', 'message-id');
await waha.chats.editMessage('default', '1234567890@c.us', 'message-id', {
    text: 'Updated text',
});

await waha.chats.pinMessage('default', '1234567890@c.us', 'message-id', {
    duration: 86400, // 24 hours
});
```

### 👥 Contact Management (`waha.contacts`)

```typescript
// Check if number exists on WhatsApp
const exists = await waha.contacts.checkExists('1234567890', 'default');

// Get contact info
const contact = await waha.contacts.get('1234567890@c.us', 'default');

// Get all contacts
const contacts = await waha.contacts.getAll('default', {
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
});

// Get contact details
const about = await waha.contacts.getAbout('1234567890@c.us', 'default');
const picture = await waha.contacts.getProfilePicture(
    '1234567890@c.us',
    'default'
);
```

### 📢 Channel Management (`waha.channels`)

```typescript
// Get channels
const channels = await waha.channels.list('default');
const ownedChannels = await waha.channels.list('default', 'OWNER');

// Create and manage channels
const channel = await waha.channels.create('default', {
    name: 'My Channel',
    description: 'Channel description',
});

// Channel operations
await waha.channels.follow('default', 'channel-id');
await waha.channels.unfollow('default', 'channel-id');
await waha.channels.mute('default', 'channel-id');

// Preview messages
const messages = await waha.channels.previewMessages(
    'default',
    'channel-id',
    false,
    10
);

// Search channels
const searchResult = await waha.channels.searchByText('default', {
    query: 'news',
    limit: 20,
});
```

### 🏷️ Label Management (`waha.labels`)

```typescript
// Get all labels
const labels = await waha.labels.getAll('default');

// Create and manage labels
const label = await waha.labels.create('default', {
    name: 'Important',
    color: '#FF0000',
});

await waha.labels.update('default', 'label-id', {
    name: 'Very Important',
    color: '#FF5722',
});

// Assign labels to chats
await waha.labels.setChatLabels('default', '1234567890@c.us', {
    labels: ['label-id-1', 'label-id-2'],
});

// Get chats by label
const labeledChats = await waha.labels.getChatsByLabel('default', 'label-id');
```

### 🟢 Status Updates (`waha.status`)

```typescript
// Send different status types
await waha.status.sendText('default', {
    text: 'Hello World!',
    backgroundColor: '#FF5722',
    textColor: '#FFFFFF',
});

await waha.status.sendImage('default', {
    file: { url: 'https://example.com/image.jpg' },
    caption: 'My status update',
});

await waha.status.sendVideo('default', {
    file: { url: 'https://example.com/video.mp4' },
    caption: 'Video status',
});

// Delete status
await waha.status.delete('default', { id: 'status-id' });

// Generate message ID for batch operations
const messageId = await waha.status.getNewMessageId('default');
```

## Advanced Usage

### Error Handling

```typescript
import { WahaApiError } from 'waha-sdk';

try {
    const message = await waha.messages.sendText({
        chatId: '1234567890@c.us',
        text: 'Hello!',
        session: 'default',
    });
} catch (error) {
    if (error instanceof WahaApiError) {
        console.error('API Error:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            response: error.response, // Full response data
        });
    } else {
        console.error('Other error:', error.message);
    }
}
```

### Response Data Access

With axios integration, all responses automatically return the `data` property:

```typescript
// Response structure: { data: WAMessage, status: 200, headers: {...} }
// But you get the WAMessage directly:
const message: WAMessage = await waha.messages.sendText({...});

// Same for arrays:
const chats: ChatSummary[] = await waha.chats.overview('default');
```

### Configuration Management

```typescript
const waha = new WahaClient({
    baseUrl: 'http://localhost:3000',
    apiKey: 'initial-key',
    timeout: 30000,
});

// Update configuration dynamically
waha.updateApiKey('new-api-key');
waha.updateBaseUrl('https://api.example.com');

// Access raw axios instance for custom requests
const httpClient = waha.getHttpClient();
const response = await httpClient.get('/custom-endpoint');
```

### Batch Operations

```typescript
// Process multiple chats
const chats = await waha.chats.overview('default', { limit: 100 });

for (const chat of chats) {
    if (chat.unreadCount > 0) {
        await waha.chats.readMessages('default', chat.id);
        console.log(`Marked ${chat.name} as read`);
    }
}

// Manage multiple sessions
const sessions = await waha.sessions.list(true);
for (const session of sessions) {
    if (session.status === 'STOPPED') {
        await waha.sessions.start(session.name);
    }
}
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type {
    WAMessage,
    SessionInfo,
    ChatSummary,
    MessageTextRequest,
    WahaClientConfig,
} from 'waha-sdk';

// All types are properly inferred
const request: MessageTextRequest = {
    chatId: '1234567890@c.us',
    text: 'Hello!',
    session: 'default',
};

const message: WAMessage = await waha.messages.sendText(request);
```

## Response Schemas

The SDK includes proper response schemas for all endpoints. Every response is typed and validated:

```typescript
interface WAMessage {
    id: string;
    timestamp: number;
    from: string;
    fromMe: boolean;
    to: string;
    body?: string;
    type: 'chat' | 'image' | 'video' | 'audio' | 'document' | 'location';
    ack?: 'ERROR' | 'PENDING' | 'SERVER' | 'DEVICE' | 'READ' | 'PLAYED';
    hasMedia: boolean;
    // ... more properties
}
```

## API Coverage

This SDK covers all WAHA API endpoints:

- ✅ Authentication (QR code, request code)
- ✅ Session management (create, start, stop, restart, delete)
- ✅ Messaging (text, images, files, voice, video, location, contacts)
- ✅ Chat operations (list, messages, archive, pin, delete)
- ✅ Contact management (check existence, get info, profile pictures)
- ✅ Profile management (get/set name, status, picture)
- ✅ Channel operations (create, follow, search, messages)
- ✅ Label management (create, assign, filter)
- ✅ Status updates (text, image, video, voice)

## License

MIT
