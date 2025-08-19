import { test, expect } from 'bun:test';
import { SessionsNamespace } from './namespaces/sessions';
import { HttpClient } from './client';

// Mock HTTP client for testing
const createMockHttpClient = (mockData: any = null): HttpClient => ({
    get: () =>
        Promise.resolve({ data: mockData, status: 200, statusText: 'OK' }),
    post: () =>
        Promise.resolve({ data: mockData, status: 200, statusText: 'OK' }),
    put: () =>
        Promise.resolve({ data: mockData, status: 200, statusText: 'OK' }),
    delete: () =>
        Promise.resolve({ data: mockData, status: 200, statusText: 'OK' }),
    defaults: {
        baseURL: 'http://localhost:3000',
        headers: { 'X-Api-Key': 'test-key' },
    },
});

test('SessionsNamespace should call list endpoint correctly', async () => {
    const mockSessions = [
        { name: 'default', status: 'WORKING' },
        { name: 'session2', status: 'STOPPED' },
    ];

    const mockHttpClient = createMockHttpClient(mockSessions);
    const sessions = new SessionsNamespace(mockHttpClient);

    const result = await sessions.list();
    expect(result).toEqual(mockSessions);
});

test('SessionsNamespace should create session', async () => {
    const mockSession = { name: 'new-session', status: 'STARTING' };
    const mockHttpClient = createMockHttpClient(mockSession);
    const sessions = new SessionsNamespace(mockHttpClient);

    const result = await sessions.create({ name: 'new-session', start: true });
    expect(result).toEqual(mockSession);
});

test('SessionsNamespace should get session info', async () => {
    const mockSession = { name: 'default', status: 'WORKING' };
    const mockHttpClient = createMockHttpClient(mockSession);
    const sessions = new SessionsNamespace(mockHttpClient);

    const result = await sessions.get('default');
    expect(result).toEqual(mockSession);
});

test('SessionsNamespace should start session', async () => {
    const mockSession = { name: 'default', status: 'STARTING' };
    const mockHttpClient = createMockHttpClient(mockSession);
    const sessions = new SessionsNamespace(mockHttpClient);

    const result = await sessions.start('default');
    expect(result).toEqual(mockSession);
});

test('SessionsNamespace should stop session', async () => {
    const mockSession = { name: 'default', status: 'STOPPING' };
    const mockHttpClient = createMockHttpClient(mockSession);
    const sessions = new SessionsNamespace(mockHttpClient);

    const result = await sessions.stop('default');
    expect(result).toEqual(mockSession);
});
