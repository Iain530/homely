import { get } from './requests.js';
import Storage from './storage.js';
import { minsToMillis } from '../utils.js';

const storage = new Storage('QUOTES');

const LAST_RETRIEVED_KEY = 'last_request';
const LAST_QUOTE_KEY = 'last_quote';

const QUOTE_URL = 'https://quotes.rest/qod';

export const getQuoteOfTheDay = async (callback) => {
    const lastRequest = await storage.get(LAST_RETRIEVED_KEY);

    const useCachedQuote = async () => {
        const quote = await storage.get(LAST_QUOTE_KEY);
        if (quote)
            callback(quote);
    };

    // cache for six hours
    if (lastRequest && Date.now() - lastRequest <= minsToMillis(600)) {
        useCachedQuote();
    } else {
        get(QUOTE_URL, (request) => {
            const response = JSON.parse(request.response);
            const quote = response.contents.quotes[0];
            storage.set(LAST_QUOTE_KEY, quote);
            storage.set(LAST_RETRIEVED_KEY, Date.now());
            callback(quote);
        }, useCachedQuote);
    }
};
