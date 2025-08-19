import { WahaClient, WahaApiError } from './client';

describe('WahaClient', () => {
    let client: WahaClient;

    beforeEach(() => {
        client = new WahaClient({
            baseUrl: 'http://localhost:3000',
            apiKey: 'test-api-key',
            timeout: 5000,
        });
    });

    it('should create a client with correct configuration', () => {
        expect(client).toBeInstanceOf(WahaClient);
        expect(client.auth).toBeDefined();
        expect(client.sessions).toBeDefined();
        expect(client.messages).toBeDefined();
        expect(client.chats).toBeDefined();
        expect(client.contacts).toBeDefined();
        expect(client.profile).toBeDefined();
        expect(client.channels).toBeDefined();
        expect(client.labels).toBeDefined();
        expect(client.status).toBeDefined();
    });

    it('should strip trailing slash from baseUrl', () => {
        const clientWithSlash = new WahaClient({
            baseUrl: 'http://localhost:3000/',
            apiKey: 'test-key',
        });

        const httpClient = clientWithSlash.getHttpClient();
        expect(httpClient.defaults.baseURL).toBe('http://localhost:3000');
    });

    it('should update API key', () => {
        const newApiKey = 'new-api-key';
        client.updateApiKey(newApiKey);

        const httpClient = client.getHttpClient();
        expect(httpClient.defaults.headers['X-Api-Key']).toBe(newApiKey);
    });

    it('should update base URL', () => {
        const newBaseUrl = 'http://new-host:3000';
        client.updateBaseUrl(newBaseUrl);

        const httpClient = client.getHttpClient();
        expect(httpClient.defaults.baseURL).toBe(newBaseUrl);
    });

    it('should strip trailing slash from new base URL', () => {
        const newBaseUrl = 'http://new-host:3000/';
        client.updateBaseUrl(newBaseUrl);

        const httpClient = client.getHttpClient();
        expect(httpClient.defaults.baseURL).toBe('http://new-host:3000');
    });
});

describe('WahaApiError', () => {
    it('should create error with correct properties', () => {
        const error = new WahaApiError(
            404,
            'Not Found',
            { error: 'Resource not found' },
            'Custom message'
        );

        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.response).toEqual({ error: 'Resource not found' });
        expect(error.message).toBe('Custom message');
        expect(error.name).toBe('WahaApiError');
    });

    it('should use statusText as message when no custom message provided', () => {
        const error = new WahaApiError(500, 'Internal Server Error');

        expect(error.message).toBe('Internal Server Error');
    });
});
