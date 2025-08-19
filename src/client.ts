import { AuthNamespace } from './namespaces/auth';
import { ChannelsNamespace } from './namespaces/channels';
import { ChatsNamespace } from './namespaces/chats';
import { ContactsNamespace } from './namespaces/contacts';
import { LabelsNamespace } from './namespaces/labels';
import { MessagesNamespace } from './namespaces/messages';
import { ProfileNamespace } from './namespaces/profile';
import { SessionsNamespace } from './namespaces/sessions';
import { StatusNamespace } from './namespaces/status';

export interface WahaClientConfig {
    baseUrl: string;
    apiKey: string;
    timeout?: number;
}

export class WahaApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public response?: unknown,
        message?: string
    ) {
        super(message ?? statusText);
        this.name = 'WahaApiError';
    }
}

export interface HttpClient {
    get<T = unknown>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpResponse<T>>;
    post<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig
    ): Promise<HttpResponse<T>>;
    put<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig
    ): Promise<HttpResponse<T>>;
    delete<T = unknown>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpResponse<T>>;
    defaults: {
        baseURL: string;
        headers: Record<string, string>;
    };
}

export interface RequestConfig {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

export interface HttpResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
}

export class FetchHttpClient implements HttpClient {
    public defaults: {
        baseURL: string;
        headers: Record<string, string>;
    };

    constructor(
        baseURL: string,
        headers: Record<string, string>,
        private readonly timeout: number = 30000
    ) {
        this.defaults = { baseURL, headers };
    }

    private async makeRequest<T>(
        url: string,
        options: RequestInit = {}
    ): Promise<HttpResponse<T>> {
        const fullUrl = url.startsWith('http')
            ? url
            : `${this.defaults.baseURL}${url}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await this.performFetch(
                fullUrl,
                options,
                controller
            );
            clearTimeout(timeoutId);
            const data = await this.parseResponse<T>(response);

            if (!response.ok) {
                throw this.createErrorFromResponse(response, data);
            }

            return {
                data,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error: unknown) {
            clearTimeout(timeoutId);
            return this.handleRequestError(error);
        }
    }

    private async performFetch(
        url: string,
        options: RequestInit,
        controller: AbortController
    ): Promise<Response> {
        return fetch(url, {
            ...options,
            headers: { ...this.defaults.headers, ...options.headers },
            signal: controller.signal,
        });
    }

    private async parseResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return response.json() as Promise<T>;
        }
        return response.text() as unknown as T;
    }

    private createErrorFromResponse<T>(
        response: Response,
        data: T
    ): WahaApiError {
        const errorMessage = this.extractErrorMessage(
            data,
            response.statusText
        );
        return new WahaApiError(
            response.status,
            response.statusText,
            data,
            errorMessage
        );
    }

    private extractErrorMessage<T>(data: T, fallback: string): string {
        if (typeof data === 'string') return data;
        if (data && typeof data === 'object') {
            const errorData = data as Record<string, unknown>;
            return (
                (typeof errorData.message === 'string'
                    ? errorData.message
                    : '') ||
                (typeof errorData.error === 'string' ? errorData.error : '') ||
                fallback
            );
        }
        return fallback;
    }

    private handleRequestError(error: unknown): never {
        if (error instanceof WahaApiError) throw error;
        if (error instanceof Error && error.name === 'AbortError') {
            throw new WahaApiError(
                0,
                'Request timeout',
                null,
                'Request timed out'
            );
        }
        throw new WahaApiError(
            0,
            'Network error',
            null,
            error instanceof Error ? error.message : 'Unknown error'
        );
    }

    async get<T = unknown>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpResponse<T>> {
        let fullUrl = url;
        if (config?.params) {
            const searchParams = new URLSearchParams();
            Object.entries(config.params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    const stringValue =
                        typeof value === 'string'
                            ? value
                            : JSON.stringify(value);
                    searchParams.append(key, stringValue);
                }
            });
            fullUrl += `?${searchParams.toString()}`;
        }

        return this.makeRequest<T>(fullUrl, {
            method: 'GET',
            headers: config?.headers,
        });
    }

    async post<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig
    ): Promise<HttpResponse<T>> {
        return this.makeRequest<T>(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig
    ): Promise<HttpResponse<T>> {
        return this.makeRequest<T>(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T = unknown>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpResponse<T>> {
        return this.makeRequest<T>(url, {
            method: 'DELETE',
            headers: config?.headers,
        });
    }
}

export class WahaClient {
    private readonly http: HttpClient;

    // Organized namespaces
    public readonly auth: AuthNamespace;
    public readonly sessions: SessionsNamespace;
    public readonly profile: ProfileNamespace;
    public readonly messages: MessagesNamespace;
    public readonly chats: ChatsNamespace;
    public readonly contacts: ContactsNamespace;
    public readonly channels: ChannelsNamespace;
    public readonly labels: LabelsNamespace;
    public readonly status: StatusNamespace;

    constructor(config: WahaClientConfig) {
        // Create fetch-based http client with configuration
        this.http = new FetchHttpClient(
            config.baseUrl.replace(/\/$/, ''),
            {
                'Content-Type': 'application/json',
                'X-Api-Key': config.apiKey,
            },
            config.timeout ?? 30000
        );

        // Initialize namespaces
        this.auth = new AuthNamespace(this.http);
        this.sessions = new SessionsNamespace(this.http);
        this.profile = new ProfileNamespace(this.http);
        this.messages = new MessagesNamespace(this.http);
        this.chats = new ChatsNamespace(this.http);
        this.contacts = new ContactsNamespace(this.http);
        this.channels = new ChannelsNamespace(this.http);
        this.labels = new LabelsNamespace(this.http);
        this.status = new StatusNamespace(this.http);
    }

    // Utility method to get raw http client if needed
    public getHttpClient(): HttpClient {
        return this.http;
    }

    // Method to update API key
    public updateApiKey(apiKey: string): void {
        this.http.defaults.headers['X-Api-Key'] = apiKey;
    }

    // Method to update base URL
    public updateBaseUrl(baseUrl: string): void {
        this.http.defaults.baseURL = baseUrl.replace(/\/$/, '');
    }
}
