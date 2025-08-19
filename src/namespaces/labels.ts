import { HttpClient } from '../client';
import { Label, LabelBody, SetLabelsRequest, ChatSummary } from '../types';

export class LabelsNamespace {
    constructor(private readonly http: HttpClient) {}

    async getAll(session: string = 'default'): Promise<Label[]> {
        const response = await this.http.get(`/api/${session}/labels`);
        return response.data as Label[];
    }

    async create(
        session: string = 'default',
        label: LabelBody
    ): Promise<Label> {
        const response = await this.http.post(`/api/${session}/labels`, label);
        return response.data as Label;
    }

    async update(
        session: string = 'default',
        labelId: string,
        label: LabelBody
    ): Promise<Label> {
        const response = await this.http.put(
            `/api/${session}/labels/${labelId}`,
            label
        );
        return response.data as Label;
    }

    async delete(session: string = 'default', labelId: string): Promise<void> {
        await this.http.delete(`/api/${session}/labels/${labelId}`);
    }

    async getChatLabels(
        session: string = 'default',
        chatId: string
    ): Promise<Label[]> {
        const response = await this.http.get(
            `/api/${session}/labels/chats/${chatId}`
        );
        return response.data as Label[];
    }

    async setChatLabels(
        session: string = 'default',
        chatId: string,
        labels: SetLabelsRequest
    ): Promise<void> {
        await this.http.put(`/api/${session}/labels/chats/${chatId}`, labels);
    }

    async getChatsByLabel(
        session: string = 'default',
        labelId: string
    ): Promise<ChatSummary[]> {
        const response = await this.http.get(
            `/api/${session}/labels/${labelId}/chats`
        );
        return response.data as ChatSummary[];
    }
}
