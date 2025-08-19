import { WahaClient, WahaApiError } from './client';

async function setupSession(client: WahaClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Setting up session...');

    const session = await client.sessions.create({
        name: 'default',
        start: true,
    });
    const qr = await client.auth.getQR('default', 'raw');

    // eslint-disable-next-line no-console
    console.log('Session created:', session);
    // eslint-disable-next-line no-console
    console.log('QR Code:', qr);

    await new Promise(resolve => setTimeout(resolve, 5000));
}

async function demonstrateMessaging(client: WahaClient): Promise<void> {
    const sessionInfo = await client.sessions.get('default');

    if (sessionInfo.status === 'WORKING') {
        // eslint-disable-next-line no-console
        console.log('Sending messages...');

        await client.messages.sendText({
            chatId: '1234567890@c.us',
            text: 'Hello from WAHA SDK!',
            session: 'default',
        });

        await client.messages.sendImage({
            chatId: '1234567890@c.us',
            file: { url: 'https://example.com/image.jpg' },
            caption: 'Check this out!',
            session: 'default',
        });
    }
}

async function demonstrateDataOperations(client: WahaClient): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Fetching data...');

    const chats = await client.chats.overview('default', { limit: 10 });
    const contacts = await client.contacts.getAll('default', { limit: 50 });
    const labels = await client.labels.getAll('default');

    // eslint-disable-next-line no-console
    console.log(
        `Found: ${chats.length} chats, ${contacts.length} contacts, ${labels.length} labels`
    );
}

function handleExampleError(error: unknown): void {
    if (error instanceof WahaApiError) {
        // eslint-disable-next-line no-console
        console.error('WAHA API Error:', {
            status: error.status,
            message: error.message,
        });
    } else {
        // eslint-disable-next-line no-console
        console.error('Other error:', error);
    }
}

/**
 * Example demonstrating basic WAHA SDK usage
 */
export async function basicExample(): Promise<void> {
    const client = new WahaClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'your-api-key-here',
    });

    try {
        await setupSession(client);
        await demonstrateMessaging(client);
        await demonstrateDataOperations(client);
    } catch (error) {
        handleExampleError(error);
    }
}

/**
 * Advanced example demonstrating bulk operations and session management
 */
export async function advancedExample(): Promise<void> {
    const client = new WahaClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'your-api-key-here',
        timeout: 60000, // 1 minute timeout
    });

    try {
        // Get multiple sessions
        const sessions = await client.sessions.list(true); // Include stopped sessions
        // eslint-disable-next-line no-console
        console.log('All sessions:', sessions);

        // Manage multiple sessions
        for (const session of sessions) {
            if (session.status === 'STOPPED') {
                await client.sessions.start(session.name);
                // eslint-disable-next-line no-console
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
                // eslint-disable-next-line no-console
                console.log(`Marked ${chat.name} as read`);
            }
        }

        // Update API key dynamically
        client.updateApiKey('new-api-key');

        // Access raw http client for custom requests
        const httpClient = client.getHttpClient();
        const _customResponse = await httpClient.get('/custom-endpoint');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Advanced example error:', error);
    }
}

// Uncomment to run the examples
// example();
// advancedExample();
