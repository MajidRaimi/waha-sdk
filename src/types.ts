export interface Base64File {
    mimetype: string;
    filename: string;
    data: string;
}

export interface QRCodeValue {
    value: string;
}

export interface SessionInfo {
    name: string;
    status: 'STOPPED' | 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED';
    config?: Record<string, unknown>;
    me?: Contact;
}

export interface SessionDTO {
    name: string;
    status: string;
    config?: Record<string, unknown>;
}

export interface SessionCreateRequest {
    name: string;
    config?: Record<string, unknown>;
    start?: boolean;
}

export interface SessionUpdateRequest {
    config?: Record<string, unknown>;
}

export interface MeInfo {
    id: string;
    pushName: string;
}

export interface Contact {
    id: string;
    name?: string;
    pushname?: string;
    shortName?: string;
    number?: string;
}

export interface MyProfile {
    id: string;
    name: string;
    pushname: string;
    status?: string;
}

export interface ProfileNameRequest {
    name: string;
}

export interface ProfileStatusRequest {
    status: string;
}

export interface ProfilePictureRequest {
    file: Base64File;
}

export interface MessageTextRequest {
    chatId: string;
    text: string;
    session: string;
    reply_to?: string;
}

export interface MessageImageRequest {
    chatId: string;
    file: Base64File | { url: string };
    caption?: string;
    session: string;
    reply_to?: string;
}

export interface MessageFileRequest {
    chatId: string;
    file: Base64File | { url: string };
    filename: string;
    caption?: string;
    session: string;
    reply_to?: string;
}

export interface MessageVoiceRequest {
    chatId: string;
    file: Base64File | { url: string };
    session: string;
    reply_to?: string;
}

export interface MessageVideoRequest {
    chatId: string;
    file: Base64File | { url: string };
    caption?: string;
    session: string;
    reply_to?: string;
}

export interface MessageLocationRequest {
    chatId: string;
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
    session: string;
}

export interface MessageContactVcardRequest {
    chatId: string;
    contactsId: string[];
    session: string;
}

export interface MessageReactionRequest {
    chatId: string;
    messageId: string;
    reaction: string;
    session: string;
}

export interface MessageStarRequest {
    chatId: string;
    messageId: string;
    star: boolean;
    session: string;
}

export interface SendSeenRequest {
    chatId: string;
    messageId?: string;
    participant?: string;
    session: string;
}

export interface ChatRequest {
    chatId: string;
    session: string;
}

export interface WAMessage {
    id: string;
    timestamp: number;
    from: string;
    fromMe: boolean;
    to: string;
    body?: string;
    type:
        | 'chat'
        | 'image'
        | 'video'
        | 'audio'
        | 'document'
        | 'location'
        | 'vcard'
        | 'multi_vcard'
        | 'revoked'
        | 'order'
        | 'product'
        | 'unknown';
    ack?: 'ERROR' | 'PENDING' | 'SERVER' | 'DEVICE' | 'READ' | 'PLAYED';
    hasMedia: boolean;
    media?: {
        url?: string;
        mimetype?: string;
        data?: string;
        filename?: string;
    };
    location?: {
        latitude: number;
        longitude: number;
        description?: string;
    };
    vCards?: string[];
    mentionedIds?: string[];
    author?: string;
    deviceType?: string;
    isForwarded?: boolean;
    isStarred?: boolean;
    links?: Array<{
        link: string;
        isSuspicious: boolean;
    }>;
}

export interface ChatSummary {
    id: string;
    name: string;
    isGroup: boolean;
    isReadOnly: boolean;
    unreadCount: number;
    lastMessage?: {
        id: string;
        type: string;
        timestamp: number;
        from: string;
        fromMe: boolean;
        body?: string;
    };
    picture?: string;
    timestamp: number;
}

export interface Channel {
    id: string;
    name: string;
    description?: string;
    picture?: string;
    followers?: number;
    verified?: boolean;
}

export interface ChannelMessage {
    id: string;
    timestamp: number;
    from: string;
    body?: string;
    type: string;
    hasMedia: boolean;
    reactions?: Array<{
        reaction: string;
        count: number;
    }>;
}

export interface WANumberExistResult {
    numberExists: boolean;
    chatId?: string;
}

export interface RequestCodeRequest {
    phoneNumber: string;
    method: 'sms' | 'voice';
    code?: string;
}

export interface Result {
    success: boolean;
    message?: string;
}

export interface Label {
    id: string;
    name: string;
    color: string;
    colorId: number;
}

export interface LabelBody {
    name: string;
    color: string;
}

export interface SetLabelsRequest {
    labels: string[];
}

export type MessageFormat = 'image' | 'raw';

export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    status: number;
}

export interface PaginationQuery {
    limit?: number;
    offset?: number;
}

export interface MessageFilter {
    'filter.timestamp.lte'?: number;
    'filter.timestamp.gte'?: number;
    'filter.fromMe'?: boolean;
    'filter.ack'?:
        | 'ERROR'
        | 'PENDING'
        | 'SERVER'
        | 'DEVICE'
        | 'READ'
        | 'PLAYED';
}

export type ChatSortBy = 'conversationTimestamp' | 'id' | 'name';
export type SortOrder = 'desc' | 'asc';

export interface ChatsQuery extends PaginationQuery {
    sortBy?: ChatSortBy;
    sortOrder?: SortOrder;
}

export interface ChatMessagesQuery extends PaginationQuery, MessageFilter {
    downloadMedia?: boolean;
}

export interface ContactsQuery extends PaginationQuery {
    sortBy?: 'id' | 'name';
    sortOrder?: SortOrder;
}

// Additional response schemas
export interface ReadChatMessagesResponse {
    success: boolean;
    messagesRead: number;
}

export interface EditMessageRequest {
    text: string;
}

export interface PinMessageRequest {
    duration?: number; // Duration in seconds
}

export interface CreateChannelRequest {
    name: string;
    description?: string;
}

export interface ChannelSearchByView {
    view: string;
    limit?: number;
    offset?: number;
}

export interface ChannelSearchByText {
    query: string;
    limit?: number;
    offset?: number;
}

export interface ChannelListResult {
    channels: Channel[];
    hasMore: boolean;
    nextOffset?: number;
}

export interface ChannelView {
    id: string;
    name: string;
}

export interface ChannelCountry {
    code: string;
    name: string;
}

export interface ChannelCategory {
    id: string;
    name: string;
}

// Status types
export interface TextStatus {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    font?: string;
}

export interface ImageStatus {
    file: Base64File | { url: string };
    caption?: string;
}

export interface VoiceStatus {
    file: Base64File | { url: string };
    backgroundColor?: string;
}

export interface VideoStatus {
    file: Base64File | { url: string };
    caption?: string;
}

export interface DeleteStatusRequest {
    id: string;
}

export interface NewMessageIDResponse {
    messageId: string;
}
