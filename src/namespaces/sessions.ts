import { HttpClient } from '../client';
import {
    SessionInfo,
    SessionDTO,
    SessionCreateRequest,
    SessionUpdateRequest,
    MeInfo,
} from '../types';

export class SessionsNamespace {
    constructor(private readonly http: HttpClient) {}

    async list(all?: boolean): Promise<SessionInfo[]> {
        const response = await this.http.get('/api/sessions', {
            params: all ? { all: true } : undefined,
        });
        return response.data;
    }

    async create(request: SessionCreateRequest): Promise<SessionDTO> {
        const response = await this.http.post('/api/sessions', request);
        return response.data;
    }

    async get(session: string = 'default'): Promise<SessionInfo> {
        const response = await this.http.get(`/api/sessions/${session}`);
        return response.data;
    }

    async update(
        session: string = 'default',
        request: SessionUpdateRequest
    ): Promise<SessionDTO> {
        const response = await this.http.put(
            `/api/sessions/${session}`,
            request
        );
        return response.data;
    }

    async delete(session: string = 'default'): Promise<void> {
        await this.http.delete(`/api/sessions/${session}`);
    }

    async start(session: string = 'default'): Promise<SessionDTO> {
        const response = await this.http.post(`/api/sessions/${session}/start`);
        return response.data;
    }

    async stop(session: string = 'default'): Promise<SessionDTO> {
        const response = await this.http.post(`/api/sessions/${session}/stop`);
        return response.data;
    }

    async logout(session: string = 'default'): Promise<SessionDTO> {
        const response = await this.http.post(
            `/api/sessions/${session}/logout`
        );
        return response.data;
    }

    async restart(session: string = 'default'): Promise<SessionDTO> {
        const response = await this.http.post(
            `/api/sessions/${session}/restart`
        );
        return response.data;
    }

    async getMe(session: string = 'default'): Promise<MeInfo> {
        const response = await this.http.get(`/api/sessions/${session}/me`);
        return response.data;
    }
}
