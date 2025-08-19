import { HttpClient } from '../client';
import {
    MyProfile,
    ProfileNameRequest,
    ProfileStatusRequest,
    ProfilePictureRequest,
    Result,
} from '../types';

export class ProfileNamespace {
    constructor(private readonly http: HttpClient) {}

    async get(session: string = 'default'): Promise<MyProfile> {
        const response = await this.http.get(`/api/${session}/profile`);
        return response.data as MyProfile;
    }

    async setName(
        session: string = 'default',
        request: ProfileNameRequest
    ): Promise<Result> {
        const response = await this.http.put(
            `/api/${session}/profile/name`,
            request
        );
        return response.data as Result;
    }

    async setStatus(
        session: string = 'default',
        request: ProfileStatusRequest
    ): Promise<Result> {
        const response = await this.http.put(
            `/api/${session}/profile/status`,
            request
        );
        return response.data as Result;
    }

    async setPicture(
        session: string = 'default',
        request: ProfilePictureRequest
    ): Promise<Result> {
        const response = await this.http.put(
            `/api/${session}/profile/picture`,
            request
        );
        return response.data as Result;
    }

    async deletePicture(session: string = 'default'): Promise<Result> {
        const response = await this.http.delete(
            `/api/${session}/profile/picture`
        );
        return response.data as Result;
    }
}
