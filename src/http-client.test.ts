import { test, expect, beforeEach } from 'bun:test';
import { WahaClient, WahaApiError, FetchHttpClient } from './client';

// Simple tests that work with Bun
test('WahaClient should initialize all namespaces', () => {
    const client = new WahaClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-api-key',
    });

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

test('WahaClient should strip trailing slash from baseUrl', () => {
    const client = new WahaClient({
        baseUrl: 'http://localhost:3000/',
        apiKey: 'test-key',
    });

    const httpClient = client.getHttpClient();
    expect(httpClient.defaults.baseURL).toBe('http://localhost:3000');
});

test('WahaClient should update API key', () => {
    const client = new WahaClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'initial-key',
    });

    client.updateApiKey('new-key');
    const httpClient = client.getHttpClient();
    expect(httpClient.defaults.headers['X-Api-Key']).toBe('new-key');
});

test('WahaClient should update base URL', () => {
    const client = new WahaClient({
        baseUrl: 'http://localhost:3000',
        apiKey: 'test-key',
    });

    client.updateBaseUrl('https://api.example.com/');
    const httpClient = client.getHttpClient();
    expect(httpClient.defaults.baseURL).toBe('https://api.example.com');
});

test('WahaApiError should have correct properties', () => {
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

test('WahaApiError should use statusText as default message', () => {
    const error = new WahaApiError(500, 'Internal Server Error');
    expect(error.message).toBe('Internal Server Error');
});

test('FetchHttpClient should construct with proper defaults', () => {
    const httpClient = new FetchHttpClient(
        'http://localhost:3000',
        { 'X-Api-Key': 'test-key' },
        5000
    );

    expect(httpClient.defaults.baseURL).toBe('http://localhost:3000');
    expect(httpClient.defaults.headers['X-Api-Key']).toBe('test-key');
});
