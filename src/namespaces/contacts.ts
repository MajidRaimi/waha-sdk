import { HttpClient } from '../client';
import { Contact, WANumberExistResult, ContactsQuery } from '../types';

export class ContactsNamespace {
    constructor(private readonly http: HttpClient) {}

    async getAll(
        session: string = 'default',
        query?: ContactsQuery
    ): Promise<Contact[]> {
        const response = await this.http.get('/api/contacts/all', {
            params: { session, ...query },
        });
        return response.data as Contact[];
    }

    async get(
        contactId: string,
        session: string = 'default'
    ): Promise<Contact> {
        const response = await this.http.get('/api/contacts', {
            params: { contactId, session },
        });
        return response.data as Contact;
    }

    async checkExists(
        phone: string,
        session: string = 'default'
    ): Promise<WANumberExistResult> {
        const response = await this.http.get('/api/contacts/check-exists', {
            params: { phone, session },
        });
        return response.data as WANumberExistResult;
    }

    async getAbout(
        contactId: string,
        session: string = 'default'
    ): Promise<{ about?: string }> {
        const response = await this.http.get('/api/contacts/about', {
            params: { contactId, session },
        });
        return response.data as { about?: string };
    }

    async getProfilePicture(
        contactId: string,
        session: string = 'default',
        refresh = false
    ): Promise<{ url?: string }> {
        const response = await this.http.get('/api/contacts/profile-picture', {
            params: { contactId, session, refresh },
        });
        return response.data as { url?: string };
    }
}
