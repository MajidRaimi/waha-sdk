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
        public response?: any,
        message?: string
    ) {
        super(message || statusText);
        this.name = 'WahaApiError';
    }
}

export interface HttpClient {
    get<T = any>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;
    post<T = any>(
        url: string,
        data?: any,
        config?: RequestConfig
    ): Promise<HttpResponse<T>>;
    put<T = any>(
        url: string,
        data?: any,
        config?: RequestConfig
    ): Promise<HttpResponse<T>>;
    delete<T = any>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpResponse<T>>;
    defaults: {
        baseURL: string;
        headers: Record<string, string>;
    };
}

export interface RequestConfig {
    params?: Record<string, any>;
    headers?: Record<string, string>;
}

export interface HttpResponse<T = any> {
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
            const response = await fetch(fullUrl, {
                ...options,
                headers: {
                    ...this.defaults.headers,
                    ...options.headers,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            let data: T;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = (await response.text()) as unknown as T;
            }

            if (!response.ok) {
                let errorMessage = response.statusText;
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data && typeof data === 'object') {
                    errorMessage =
                        (data as any).message ||
                        (data as any).error ||
                        response.statusText;
                }
                throw new WahaApiError(
                    response.status,
                    response.statusText,
                    data,
                    errorMessage
                );
            }

            return {
                data,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof WahaApiError) {
                throw error;
            }

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
    }

    async get<T = any>(
        url: string,
        config?: RequestConfig
    ): Promise<HttpResponse<T>> {
        let fullUrl = url;
        if (config?.params) {
            const searchParams = new URLSearchParams();
            Object.entries(config.params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            fullUrl += `?${searchParams.toString()}`;
        }

        return this.makeRequest<T>(fullUrl, {
            method: 'GET',
            headers: config?.headers,
        });
    }

    async post<T = any>(
        url: string,
        data?: any,
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

    async put<T = any>(
        url: string,
        data?: any,
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

    async delete<T = any>(
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
            config.timeout || 30000
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
