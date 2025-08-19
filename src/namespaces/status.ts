import { HttpClient } from '../client';
import {
    TextStatus,
    ImageStatus,
    VoiceStatus,
    VideoStatus,
    DeleteStatusRequest,
    NewMessageIDResponse,
} from '../types';

export class StatusNamespace {
    constructor(private readonly http: HttpClient) {}

    async sendText(
        session: string = 'default',
        status: TextStatus
    ): Promise<void> {
        await this.http.post(`/api/${session}/status/text`, status);
    }

    async sendImage(
        session: string = 'default',
        status: ImageStatus
    ): Promise<void> {
        await this.http.post(`/api/${session}/status/image`, status);
    }

    async sendVoice(
        session: string = 'default',
        status: VoiceStatus
    ): Promise<void> {
        await this.http.post(`/api/${session}/status/voice`, status);
    }

    async sendVideo(
        session: string = 'default',
        status: VideoStatus
    ): Promise<void> {
        await this.http.post(`/api/${session}/status/video`, status);
    }

    async delete(
        session: string = 'default',
        request: DeleteStatusRequest
    ): Promise<void> {
        await this.http.post(`/api/${session}/status/delete`, request);
    }

    async getNewMessageId(
        session: string = 'default'
    ): Promise<NewMessageIDResponse> {
        const response = await this.http.get(
            `/api/${session}/status/new-message-id`
        );
        return response.data;
    }
}
