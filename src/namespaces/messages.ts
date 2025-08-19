import { HttpClient } from '../client';
import {
    MessageTextRequest,
    MessageImageRequest,
    MessageFileRequest,
    MessageVoiceRequest,
    MessageVideoRequest,
    MessageLocationRequest,
    MessageContactVcardRequest,
    MessageReactionRequest,
    MessageStarRequest,
    SendSeenRequest,
    ChatRequest,
    WAMessage,
} from '../types';

export class MessagesNamespace {
    constructor(private readonly http: HttpClient) {}

    async sendText(request: MessageTextRequest): Promise<WAMessage> {
        const response = await this.http.post('/api/sendText', request);
        return response.data;
    }

    async sendImage(request: MessageImageRequest): Promise<WAMessage> {
        const response = await this.http.post('/api/sendImage', request);
        return response.data;
    }

    async sendFile(request: MessageFileRequest): Promise<WAMessage> {
        const response = await this.http.post('/api/sendFile', request);
        return response.data;
    }

    async sendVoice(request: MessageVoiceRequest): Promise<WAMessage> {
        const response = await this.http.post('/api/sendVoice', request);
        return response.data;
    }

    async sendVideo(request: MessageVideoRequest): Promise<WAMessage> {
        const response = await this.http.post('/api/sendVideo', request);
        return response.data;
    }

    async sendLocation(request: MessageLocationRequest): Promise<WAMessage> {
        const response = await this.http.post('/api/sendLocation', request);
        return response.data;
    }

    async sendContactVcard(
        request: MessageContactVcardRequest
    ): Promise<WAMessage> {
        const response = await this.http.post('/api/sendContactVcard', request);
        return response.data;
    }

    async sendSeen(request: SendSeenRequest): Promise<void> {
        await this.http.post('/api/sendSeen', request);
    }

    async startTyping(request: ChatRequest): Promise<void> {
        await this.http.post('/api/startTyping', request);
    }

    async stopTyping(request: ChatRequest): Promise<void> {
        await this.http.post('/api/stopTyping', request);
    }

    async setReaction(request: MessageReactionRequest): Promise<void> {
        await this.http.put('/api/reaction', request);
    }

    async setStar(request: MessageStarRequest): Promise<void> {
        await this.http.put('/api/star', request);
    }
}
