import { HttpClient } from '../client';
import {
    ChatSummary,
    WAMessage,
    ChatsQuery,
    ChatMessagesQuery,
    PaginationQuery,
    ReadChatMessagesResponse,
    EditMessageRequest,
    PinMessageRequest,
} from '../types';

export class ChatsNamespace {
    constructor(private readonly http: HttpClient) {}

    async list(
        session: string = 'default',
        query?: ChatsQuery
    ): Promise<ChatSummary[]> {
        const response = await this.http.get(`/api/${session}/chats`, {
            params: query,
        });
        return response.data;
    }

    async overview(
        session: string = 'default',
        query?: PaginationQuery & { ids?: string[] }
    ): Promise<ChatSummary[]> {
        if (query?.ids && query.ids.length > 50) {
            // Use POST for large number of IDs
            const response = await this.http.post(
                `/api/${session}/chats/overview`,
                {
                    limit: query.limit,
                    offset: query.offset,
                    ids: query.ids,
                }
            );
            return response.data;
        } else {
            const response = await this.http.get(
                `/api/${session}/chats/overview`,
                {
                    params: query,
                }
            );
            return response.data;
        }
    }

    async delete(session: string = 'default', chatId: string): Promise<void> {
        await this.http.delete(`/api/${session}/chats/${chatId}`);
    }

    async getPicture(
        session: string = 'default',
        chatId: string,
        refresh = false
    ): Promise<{ url?: string }> {
        const response = await this.http.get(
            `/api/${session}/chats/${chatId}/picture`,
            {
                params: { refresh },
            }
        );
        return response.data;
    }

    async getMessages(
        session: string = 'default',
        chatId: string,
        query?: ChatMessagesQuery
    ): Promise<WAMessage[]> {
        const response = await this.http.get(
            `/api/${session}/chats/${chatId}/messages`,
            {
                params: query,
            }
        );
        return response.data;
    }

    async clearMessages(
        session: string = 'default',
        chatId: string
    ): Promise<void> {
        await this.http.delete(`/api/${session}/chats/${chatId}/messages`);
    }

    async readMessages(
        session: string = 'default',
        chatId: string,
        messages?: number,
        days = 7
    ): Promise<ReadChatMessagesResponse> {
        const response = await this.http.post(
            `/api/${session}/chats/${chatId}/messages/read`,
            null,
            {
                params: { messages, days },
            }
        );
        return response.data;
    }

    async getMessage(
        session: string = 'default',
        chatId: string,
        messageId: string,
        downloadMedia = true
    ): Promise<WAMessage> {
        const response = await this.http.get(
            `/api/${session}/chats/${chatId}/messages/${messageId}`,
            {
                params: { downloadMedia },
            }
        );
        return response.data;
    }

    async deleteMessage(
        session: string = 'default',
        chatId: string,
        messageId: string
    ): Promise<void> {
        await this.http.delete(
            `/api/${session}/chats/${chatId}/messages/${messageId}`
        );
    }

    async editMessage(
        session: string = 'default',
        chatId: string,
        messageId: string,
        request: EditMessageRequest
    ): Promise<void> {
        await this.http.put(
            `/api/${session}/chats/${chatId}/messages/${messageId}`,
            request
        );
    }

    async pinMessage(
        session: string = 'default',
        chatId: string,
        messageId: string,
        request: PinMessageRequest
    ): Promise<void> {
        await this.http.post(
            `/api/${session}/chats/${chatId}/messages/${messageId}/pin`,
            request
        );
    }

    async unpinMessage(
        session: string = 'default',
        chatId: string,
        messageId: string
    ): Promise<void> {
        await this.http.post(
            `/api/${session}/chats/${chatId}/messages/${messageId}/unpin`
        );
    }

    async archive(session: string = 'default', chatId: string): Promise<void> {
        await this.http.post(`/api/${session}/chats/${chatId}/archive`);
    }

    async unarchive(
        session: string = 'default',
        chatId: string
    ): Promise<void> {
        await this.http.post(`/api/${session}/chats/${chatId}/unarchive`);
    }

    async unread(session: string = 'default', chatId: string): Promise<void> {
        await this.http.post(`/api/${session}/chats/${chatId}/unread`);
    }
}
