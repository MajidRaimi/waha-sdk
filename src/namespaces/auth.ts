import { HttpClient } from '../client';
import {
    Base64File,
    QRCodeValue,
    RequestCodeRequest,
    MessageFormat,
} from '../types';

export class AuthNamespace {
    constructor(private readonly http: HttpClient) {}

    async getQR(
        session: string = 'default',
        format: MessageFormat = 'image'
    ): Promise<Base64File | QRCodeValue | string> {
        const response = await this.http.get(`/api/${session}/auth/qr`, {
            params: { format },
        });
        return response.data as Base64File | QRCodeValue | string;
    }

    async requestCode(
        session: string = 'default',
        request: RequestCodeRequest
    ): Promise<void> {
        await this.http.post(`/api/${session}/auth/request-code`, request);
    }
}
