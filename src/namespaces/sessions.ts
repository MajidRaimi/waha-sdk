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
        return response.data as SessionInfo[];
    }

    async create(request: SessionCreateRequest): Promise<SessionDTO> {
        const response = await this.http.post('/api/sessions', request);
        return response.data as SessionDTO;
    }

    async get(session: string = 'default'): Promise<SessionInfo> {
        const response = await this.http.get(`/api/sessions/${session}`);
        return response.data as SessionInfo;
    }

    async update(
        session: string = 'default',
        request: SessionUpdateRequest
    ): Promise<SessionDTO> {
        const response = await this.http.put(
            `/api/sessions/${session}`,
            request
        );
        return response.data as SessionDTO;
    }

    async delete(session: string = 'default'): Promise<void> {
        await this.http.delete(`/api/sessions/${session}`);
    }

    async start(session: string = 'default'): Promise<SessionDTO> {
        const response = await this.http.post(`/api/sessions/${session}/start`);
        return response.data as SessionDTO;
    }

    async stop(session: string = 'default'): Promise<SessionDTO> {
        const response = await this.http.post(`/api/sessions/${session}/stop`);
        return response.data as SessionDTO;
    }

    async logout(session: string = 'default'): Promise<SessionDTO> {
        const response = await this.http.post(
            `/api/sessions/${session}/logout`
        );
        return response.data as SessionDTO;
    }

    async restart(session: string = 'default'): Promise<SessionDTO> {
        const response = await this.http.post(
            `/api/sessions/${session}/restart`
        );
        return response.data as SessionDTO;
    }

    async getMe(session: string = 'default'): Promise<MeInfo> {
        const response = await this.http.get(`/api/sessions/${session}/me`);
        return response.data as MeInfo;
    }
}
