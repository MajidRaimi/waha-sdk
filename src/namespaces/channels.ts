import { HttpClient } from '../client';
import {
    Channel,
    ChannelMessage,
    CreateChannelRequest,
    ChannelSearchByView,
    ChannelSearchByText,
    ChannelListResult,
    ChannelView,
    ChannelCountry,
    ChannelCategory,
} from '../types';

export class ChannelsNamespace {
    constructor(private readonly http: HttpClient) {}

    async list(
        session: string = 'default',
        role?: 'OWNER' | 'ADMIN' | 'SUBSCRIBER'
    ): Promise<Channel[]> {
        const response = await this.http.get(`/api/${session}/channels`, {
            params: role ? { role } : undefined,
        });
        return response.data as Channel[];
    }

    async create(
        session: string = 'default',
        request: CreateChannelRequest
    ): Promise<Channel> {
        const response = await this.http.post(
            `/api/${session}/channels`,
            request
        );
        return response.data as Channel;
    }

    async get(session: string = 'default', id: string): Promise<Channel> {
        const response = await this.http.get(`/api/${session}/channels/${id}`);
        return response.data as Channel;
    }

    async delete(session: string = 'default', id: string): Promise<void> {
        await this.http.delete(`/api/${session}/channels/${id}`);
    }

    async previewMessages(
        session: string = 'default',
        id: string,
        downloadMedia = false,
        limit = 10
    ): Promise<ChannelMessage[]> {
        const response = await this.http.get(
            `/api/${session}/channels/${id}/messages/preview`,
            {
                params: { downloadMedia, limit },
            }
        );
        return response.data as ChannelMessage[];
    }

    async follow(session: string = 'default', id: string): Promise<void> {
        await this.http.post(`/api/${session}/channels/${id}/follow`);
    }

    async unfollow(session: string = 'default', id: string): Promise<void> {
        await this.http.post(`/api/${session}/channels/${id}/unfollow`);
    }

    async mute(session: string = 'default', id: string): Promise<void> {
        await this.http.post(`/api/${session}/channels/${id}/mute`);
    }

    async unmute(session: string = 'default', id: string): Promise<void> {
        await this.http.post(`/api/${session}/channels/${id}/unmute`);
    }

    async searchByView(
        session: string = 'default',
        request: ChannelSearchByView
    ): Promise<ChannelListResult> {
        const response = await this.http.post(
            `/api/${session}/channels/search/by-view`,
            request
        );
        return response.data as ChannelListResult;
    }

    async searchByText(
        session: string = 'default',
        request: ChannelSearchByText
    ): Promise<ChannelListResult> {
        const response = await this.http.post(
            `/api/${session}/channels/search/by-text`,
            request
        );
        return response.data as ChannelListResult;
    }

    async getSearchViews(session: string = 'default'): Promise<ChannelView[]> {
        const response = await this.http.get(
            `/api/${session}/channels/search/views`
        );
        return response.data as ChannelView[];
    }

    async getSearchCountries(
        session: string = 'default'
    ): Promise<ChannelCountry[]> {
        const response = await this.http.get(
            `/api/${session}/channels/search/countries`
        );
        return response.data as ChannelCountry[];
    }

    async getSearchCategories(
        session: string = 'default'
    ): Promise<ChannelCategory[]> {
        const response = await this.http.get(
            `/api/${session}/channels/search/categories`
        );
        return response.data as ChannelCategory[];
    }
}
