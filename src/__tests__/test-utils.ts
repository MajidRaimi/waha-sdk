// Test utilities for mocking fetch and creating test data

export const createMockResponse = (
    data: any,
    status = 200,
    statusText = 'OK'
): Promise<Response> => {
    const mockHeaders = new Headers();
    mockHeaders.set('content-type', 'application/json');

    return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        statusText,
        headers: mockHeaders,
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(JSON.stringify(data)),
        blob: () => Promise.resolve(new Blob()),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        formData: () => Promise.resolve(new FormData()),
        clone: () => ({}) as Response,
        redirected: false,
        type: 'basic' as ResponseType,
        url: 'http://localhost:3000/test',
        body: null,
        bodyUsed: false,
    } as Response);
};

export const createMockError = (
    status = 500,
    statusText = 'Internal Server Error',
    data?: any
): Promise<Response> => {
    const mockHeaders = new Headers();
    mockHeaders.set('content-type', 'application/json');

    return Promise.resolve({
        ok: false,
        status,
        statusText,
        headers: mockHeaders,
        json: () => Promise.resolve(data || { error: statusText }),
        text: () =>
            Promise.resolve(JSON.stringify(data || { error: statusText })),
        blob: () => Promise.resolve(new Blob()),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        formData: () => Promise.resolve(new FormData()),
        clone: () => ({}) as Response,
        redirected: false,
        type: 'basic' as ResponseType,
        url: 'http://localhost:3000/test',
        body: null,
        bodyUsed: false,
    } as Response);
};

export const mockFetch = (mockResponse: Promise<Response>) => {
    const mockFn = (() => mockResponse) as any;
    (globalThis as any).fetch = mockFn;
    return mockFn;
};

export const mockAbortController = () => {
    const mockAbort = () => {};
    const mockController = {
        abort: mockAbort,
        signal: { aborted: false } as AbortSignal,
    };

    (globalThis as any).AbortController = (() => mockController) as any;
    return { mockAbort, mockController };
};

// Test data factories
export const createTestSession = () => ({
    name: 'test-session',
    status: 'WORKING',
    config: {
        webhooks: [],
    },
    me: {
        id: '1234567890@c.us',
        pushName: 'Test User',
    },
});

export const createTestMessage = () => ({
    id: 'msg-123',
    timestamp: 1234567890,
    from: '1234567890@c.us',
    fromMe: false,
    body: 'Test message',
    type: 'chat',
    notifyName: 'Test User',
});

export const createTestContact = () => ({
    id: '1234567890@c.us',
    name: 'Test Contact',
    pushname: 'Test',
    isMyContact: true,
    isUser: true,
    isGroup: false,
    isBlocked: false,
});
