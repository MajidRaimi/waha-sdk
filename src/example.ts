import { WahaClient, WahaApiError } from './client';

// Example usage of the WAHA SDK with organized namespaces
async function example() {
    const client = new WahaClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'your-api-key-here',
    });

    try {
        // Session Management (waha.sessions.*)
        console.log('Creating session...');
        const session = await client.sessions.create({
            name: 'default',
            start: true,
        });
        console.log('Session created:', session);

        // Authentication (waha.auth.*)
        console.log('Getting QR code...');
        const qr = await client.auth.getQR('default', 'raw');
        console.log('QR Code:', qr);

        // Wait for authentication...
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Check session status
        const sessionInfo = await client.sessions.get('default');
        console.log('Session status:', sessionInfo.status);

        if (sessionInfo.status === 'WORKING') {
            // Messages (waha.messages.*)
            console.log('Sending test message...');
            const message = await client.messages.sendText({
                chatId: '1234567890@c.us', // Replace with actual chat ID
                text: 'Hello from WAHA SDK!',
                session: 'default',
            });
            console.log('Message sent:', message);

            // Send an image
            await client.messages.sendImage({
                chatId: '1234567890@c.us',
                file: {
                    url: 'https://example.com/image.jpg',
                },
                caption: 'Check this out!',
                session: 'default',
            });

            // Chats (waha.chats.*)
            console.log('Getting chats...');
            const chats = await client.chats.overview('default', {
                limit: 10,
            });
            console.log(`Found ${chats.length} chats`);

            // Get messages from a specific chat
            const messages = await client.chats.getMessages(
                'default',
                '1234567890@c.us',
                {
                    limit: 20,
                    downloadMedia: false,
                }
            );
            console.log(`Found ${messages.length} messages`);

            // Profile (waha.profile.*)
            console.log('Getting profile...');
            const profile = await client.profile.get('default');
            console.log('Profile:', profile);

            // Update profile name
            await client.profile.setName('default', {
                name: 'My Bot Name',
            });

            // Contacts (waha.contacts.*)
            console.log('Checking if number exists...');
            const exists = await client.contacts.checkExists(
                '1234567890',
                'default'
            );
            console.log('Number exists:', exists.numberExists);

            // Get all contacts
            const contacts = await client.contacts.getAll('default', {
                limit: 50,
                sortBy: 'name',
            });
            console.log(`Found ${contacts.length} contacts`);

            // Labels (waha.labels.*)
            const labels = await client.labels.getAll('default');
            console.log('Available labels:', labels);

            // Create a new label
            const newLabel = await client.labels.create('default', {
                name: 'Important',
                color: '#FF0000',
            });
            console.log('Created label:', newLabel);

            // Status updates (waha.status.*)
            await client.status.sendText('default', {
                text: 'Hello World!',
                backgroundColor: '#FF5722',
            });

            // Channels (waha.channels.*)
            const channels = await client.channels.list('default');
            console.log('My channels:', channels);
        }
    } catch (error) {
        if (error instanceof WahaApiError) {
            console.error('WAHA API Error:', {
                status: error.status,
                statusText: error.statusText,
                message: error.message,
                response: error.response,
            });
        } else {
            console.error('Other error:', error);
        }
    }
}

// Advanced usage example
async function advancedExample() {
    const client = new WahaClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'your-api-key-here',
        timeout: 60000, // 1 minute timeout
    });

    try {
        // Get multiple sessions
        const sessions = await client.sessions.list(true); // Include stopped sessions
        console.log('All sessions:', sessions);

        // Manage multiple sessions
        for (const session of sessions) {
            if (session.status === 'STOPPED') {
                await client.sessions.start(session.name);
                console.log(`Started session: ${session.name}`);
            }
        }

        // Bulk operations on chats
        const chatOverviews = await client.chats.overview('default', {
            limit: 100,
        });

        for (const chat of chatOverviews) {
            if (chat.unreadCount > 0) {
                // Mark as read
                await client.chats.readMessages('default', chat.id);
                console.log(`Marked ${chat.name} as read`);
            }
        }

        // Update API key dynamically
        client.updateApiKey('new-api-key');

        // Access raw http client for custom requests
        const httpClient = client.getHttpClient();
        const customResponse = await httpClient.get('/custom-endpoint');
    } catch (error) {
        console.error('Advanced example error:', error);
    }
}

// Uncomment to run the examples
// example();
// advancedExample();
