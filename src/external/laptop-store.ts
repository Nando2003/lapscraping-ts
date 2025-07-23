import got, { Got } from 'got';
import { BASE_URL, DEFAULT_HEADERS } from '../config/settings';

const SESSION: Got = got.extend({
    prefixUrl: BASE_URL,
    headers: DEFAULT_HEADERS,
    retry: { limit: 3 },
});

export async function getPageBody(url: string = ''): Promise<string> {
    const response = await SESSION.get(url);
    return response.body;
};