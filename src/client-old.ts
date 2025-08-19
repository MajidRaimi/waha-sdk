import {
    ApiResponse,
    Base64File,
    QRCodeValue,
    SessionInfo,
    SessionDTO,
    SessionCreateRequest,
    SessionUpdateRequest,
    MeInfo,
    MyProfile,
    ProfileNameRequest,
    ProfileStatusRequest,
    ProfilePictureRequest,
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
    ChatSummary,
    Channel,
    ChannelMessage,
    WANumberExistResult,
    RequestCodeRequest,
    Result,
    Label,
    LabelBody,
    SetLabelsRequest,
    MessageFormat,
    PaginationQuery,
    ChatsQuery,
    ChatMessagesQuery,
    ContactsQuery,
    Contact,
} from './types';

export interface WahaClientConfig {
    baseUrl: string;
    apiKey: string;
    timeout?: number;
}

export class WahaApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        message?: string
    ) {
        super(message || statusText);
        this.name = 'WahaApiError';
    }
}

export class WahaClient {
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly timeout: number;

    constructor(config: WahaClientConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, '');
        this.apiKey = config.apiKey;
        this.timeout = config.timeout || 30000;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': this.apiKey,
                    ...options.headers,
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response
                    .text()
                    .catch(() => 'Unknown error');
                throw new WahaApiError(
                    response.status,
                    response.statusText,
                    errorText
                );
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return response.text() as any;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof WahaApiError) {
                throw error;
            }
            throw new Error(`Request failed: ${error}`);
        }
    }

    // Authentication methods
    async getQR(
        session: string = 'default',
        format: MessageFormat = 'image'
    ): Promise<Base64File | QRCodeValue | string> {
        return this.request(`/api/${session}/auth/qr?format=${format}`);
    }

    async requestCode(
        session: string = 'default',
        request: RequestCodeRequest
    ): Promise<void> {
        return this.request(`/api/${session}/auth/request-code`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Session management
    async getSessions(all?: boolean): Promise<SessionInfo[]> {
        const params = all ? '?all=true' : '';
        return this.request(`/api/sessions${params}`);
    }

    async createSession(request: SessionCreateRequest): Promise<SessionDTO> {
        return this.request('/api/sessions', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async getSession(session: string = 'default'): Promise<SessionInfo> {
        return this.request(`/api/sessions/${session}`);
    }

    async updateSession(
        session: string = 'default',
        request: SessionUpdateRequest
    ): Promise<SessionDTO> {
        return this.request(`/api/sessions/${session}`, {
            method: 'PUT',
            body: JSON.stringify(request),
        });
    }

    async deleteSession(session: string = 'default'): Promise<void> {
        return this.request(`/api/sessions/${session}`, {
            method: 'DELETE',
        });
    }

    async getMe(session: string = 'default'): Promise<MeInfo> {
        return this.request(`/api/sessions/${session}/me`);
    }

    async startSession(session: string = 'default'): Promise<SessionDTO> {
        return this.request(`/api/sessions/${session}/start`, {
            method: 'POST',
        });
    }

    async stopSession(session: string = 'default'): Promise<SessionDTO> {
        return this.request(`/api/sessions/${session}/stop`, {
            method: 'POST',
        });
    }

    async logoutSession(session: string = 'default'): Promise<SessionDTO> {
        return this.request(`/api/sessions/${session}/logout`, {
            method: 'POST',
        });
    }

    async restartSession(session: string = 'default'): Promise<SessionDTO> {
        return this.request(`/api/sessions/${session}/restart`, {
            method: 'POST',
        });
    }

    // Profile methods
    async getProfile(session: string = 'default'): Promise<MyProfile> {
        return this.request(`/api/${session}/profile`);
    }

    async setProfileName(
        session: string = 'default',
        request: ProfileNameRequest
    ): Promise<Result> {
        return this.request(`/api/${session}/profile/name`, {
            method: 'PUT',
            body: JSON.stringify(request),
        });
    }

    async setProfileStatus(
        session: string = 'default',
        request: ProfileStatusRequest
    ): Promise<Result> {
        return this.request(`/api/${session}/profile/status`, {
            method: 'PUT',
            body: JSON.stringify(request),
        });
    }

    async setProfilePicture(
        session: string = 'default',
        request: ProfilePictureRequest
    ): Promise<Result> {
        return this.request(`/api/${session}/profile/picture`, {
            method: 'PUT',
            body: JSON.stringify(request),
        });
    }

    async deleteProfilePicture(session: string = 'default'): Promise<Result> {
        return this.request(`/api/${session}/profile/picture`, {
            method: 'DELETE',
        });
    }

    // Messaging methods
    async sendText(request: MessageTextRequest): Promise<WAMessage> {
        return this.request('/api/sendText', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async sendImage(request: MessageImageRequest): Promise<any> {
        return this.request('/api/sendImage', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async sendFile(request: MessageFileRequest): Promise<any> {
        return this.request('/api/sendFile', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async sendVoice(request: MessageVoiceRequest): Promise<any> {
        return this.request('/api/sendVoice', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async sendVideo(request: MessageVideoRequest): Promise<void> {
        return this.request('/api/sendVideo', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async sendLocation(request: MessageLocationRequest): Promise<any> {
        return this.request('/api/sendLocation', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async sendContactVcard(request: MessageContactVcardRequest): Promise<void> {
        return this.request('/api/sendContactVcard', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async sendSeen(request: SendSeenRequest): Promise<any> {
        return this.request('/api/sendSeen', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async startTyping(request: ChatRequest): Promise<void> {
        return this.request('/api/startTyping', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async stopTyping(request: ChatRequest): Promise<void> {
        return this.request('/api/stopTyping', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async setReaction(request: MessageReactionRequest): Promise<any> {
        return this.request('/api/reaction', {
            method: 'PUT',
            body: JSON.stringify(request),
        });
    }

    async setStar(request: MessageStarRequest): Promise<void> {
        return this.request('/api/star', {
            method: 'PUT',
            body: JSON.stringify(request),
        });
    }

    // Chat methods
    async getChats(
        session: string = 'default',
        query?: ChatsQuery
    ): Promise<any> {
        const params = new URLSearchParams();
        if (query?.sortBy) params.append('sortBy', query.sortBy);
        if (query?.sortOrder) params.append('sortOrder', query.sortOrder);
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.offset) params.append('offset', query.offset.toString());

        const queryString = params.toString();
        return this.request(
            `/api/${session}/chats${queryString ? `?${queryString}` : ''}`
        );
    }

    async getChatsOverview(
        session: string = 'default',
        query?: PaginationQuery & { ids?: string[] }
    ): Promise<ChatSummary[]> {
        const params = new URLSearchParams();
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.offset) params.append('offset', query.offset.toString());
        if (query?.ids) {
            query.ids.forEach(id => params.append('ids', id));
        }

        const queryString = params.toString();
        return this.request(
            `/api/${session}/chats/overview${queryString ? `?${queryString}` : ''}`
        );
    }

    async deleteChat(
        session: string = 'default',
        chatId: string
    ): Promise<void> {
        return this.request(`/api/${session}/chats/${chatId}`, {
            method: 'DELETE',
        });
    }

    async getChatMessages(
        session: string = 'default',
        chatId: string,
        query?: ChatMessagesQuery
    ): Promise<WAMessage[]> {
        const params = new URLSearchParams();
        if (query?.downloadMedia !== undefined)
            params.append('downloadMedia', query.downloadMedia.toString());
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.offset) params.append('offset', query.offset.toString());
        if (query?.['filter.timestamp.lte'])
            params.append(
                'filter.timestamp.lte',
                query['filter.timestamp.lte'].toString()
            );
        if (query?.['filter.timestamp.gte'])
            params.append(
                'filter.timestamp.gte',
                query['filter.timestamp.gte'].toString()
            );
        if (query?.['filter.fromMe'] !== undefined)
            params.append('filter.fromMe', query['filter.fromMe'].toString());
        if (query?.['filter.ack'])
            params.append('filter.ack', query['filter.ack']);

        const queryString = params.toString();
        return this.request(
            `/api/${session}/chats/${chatId}/messages${queryString ? `?${queryString}` : ''}`
        );
    }

    async getChatMessage(
        session: string = 'default',
        chatId: string,
        messageId: string,
        downloadMedia = true
    ): Promise<WAMessage> {
        return this.request(
            `/api/${session}/chats/${chatId}/messages/${messageId}?downloadMedia=${downloadMedia}`
        );
    }

    async deleteMessage(
        session: string = 'default',
        chatId: string,
        messageId: string
    ): Promise<void> {
        return this.request(
            `/api/${session}/chats/${chatId}/messages/${messageId}`,
            {
                method: 'DELETE',
            }
        );
    }

    async archiveChat(
        session: string = 'default',
        chatId: string
    ): Promise<any> {
        return this.request(`/api/${session}/chats/${chatId}/archive`, {
            method: 'POST',
        });
    }

    async unarchiveChat(
        session: string = 'default',
        chatId: string
    ): Promise<any> {
        return this.request(`/api/${session}/chats/${chatId}/unarchive`, {
            method: 'POST',
        });
    }

    // Contact methods
    async getAllContacts(
        session: string = 'default',
        query?: ContactsQuery
    ): Promise<any> {
        const params = new URLSearchParams();
        params.append('session', session);
        if (query?.sortBy) params.append('sortBy', query.sortBy);
        if (query?.sortOrder) params.append('sortOrder', query.sortOrder);
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.offset) params.append('offset', query.offset.toString());

        const queryString = params.toString();
        return this.request(`/api/contacts/all?${queryString}`);
    }

    async getContact(
        contactId: string,
        session: string = 'default'
    ): Promise<any> {
        return this.request(
            `/api/contacts?contactId=${contactId}&session=${session}`
        );
    }

    async checkNumberExists(
        phone: string,
        session: string = 'default'
    ): Promise<WANumberExistResult> {
        return this.request(
            `/api/contacts/check-exists?phone=${phone}&session=${session}`
        );
    }

    async getContactAbout(
        contactId: string,
        session: string = 'default'
    ): Promise<any> {
        return this.request(
            `/api/contacts/about?contactId=${contactId}&session=${session}`
        );
    }

    async getContactProfilePicture(
        contactId: string,
        session: string = 'default',
        refresh = false
    ): Promise<any> {
        return this.request(
            `/api/contacts/profile-picture?contactId=${contactId}&session=${session}&refresh=${refresh}`
        );
    }

    // Channel methods
    async getChannels(
        session: string = 'default',
        role?: 'OWNER' | 'ADMIN' | 'SUBSCRIBER'
    ): Promise<Channel[]> {
        const params = role ? `?role=${role}` : '';
        return this.request(`/api/${session}/channels${params}`);
    }

    async getChannel(
        session: string = 'default',
        id: string
    ): Promise<Channel> {
        return this.request(`/api/${session}/channels/${id}`);
    }

    async followChannel(
        session: string = 'default',
        id: string
    ): Promise<void> {
        return this.request(`/api/${session}/channels/${id}/follow`, {
            method: 'POST',
        });
    }

    async unfollowChannel(
        session: string = 'default',
        id: string
    ): Promise<void> {
        return this.request(`/api/${session}/channels/${id}/unfollow`, {
            method: 'POST',
        });
    }

    // Label methods
    async getLabels(session: string = 'default'): Promise<Label[]> {
        return this.request(`/api/${session}/labels`);
    }

    async createLabel(
        session: string = 'default',
        label: LabelBody
    ): Promise<Label> {
        return this.request(`/api/${session}/labels`, {
            method: 'POST',
            body: JSON.stringify(label),
        });
    }

    async updateLabel(
        session: string = 'default',
        labelId: string,
        label: LabelBody
    ): Promise<Label> {
        return this.request(`/api/${session}/labels/${labelId}`, {
            method: 'PUT',
            body: JSON.stringify(label),
        });
    }

    async deleteLabel(
        session: string = 'default',
        labelId: string
    ): Promise<any> {
        return this.request(`/api/${session}/labels/${labelId}`, {
            method: 'DELETE',
        });
    }

    async getChatLabels(
        session: string = 'default',
        chatId: string
    ): Promise<Label[]> {
        return this.request(`/api/${session}/labels/chats/${chatId}`);
    }

    async setChatLabels(
        session: string = 'default',
        chatId: string,
        labels: SetLabelsRequest
    ): Promise<void> {
        return this.request(`/api/${session}/labels/chats/${chatId}`, {
            method: 'PUT',
            body: JSON.stringify(labels),
        });
    }
}
