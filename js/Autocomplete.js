import { get } from './requests.js';

const SUGGESTIONS_URL = 'https://suggestqueries.google.com/complete/search';
const CLIENT = 'firefox';

export default class Autocomplete {
    constructor(inputElement, callback, delay = 500, threshhold = 50, max = 5) {
        this.inputElement = inputElement;
        this.loading = false;
        this.completions = null;
        this.lastQuery = null;
        this.timeout = null;
        this.threshhold = threshhold;
        this.max = max;

        this.inputElement.addEventListener('input', () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(
                () => this.fetchAutocompletions(callback),
                delay,
            );
        });
    }

    async fetchAutocompletions(callback = () => {}) {
        const query = this.inputElement.value;
        if (query === '') return callback([], '');
        if (query === this.lastQuery) return callback(this.completions, query);

        this.loading = true;
        this.lastQuery = query;

        const url = new URL(SUGGESTIONS_URL);
        url.searchParams.set('q', query);
        url.searchParams.set('client', CLIENT);
        
        get(url, (request) => {
            if (this.lastQuery === query) {
                const response = JSON.parse(request.response);
                const completions = response[1].slice(0, 5);
                this.completions = completions;
                this.loading = false;
                callback(completions, query);
            }
        }, (error) => {
            console.log(`${error.status}: Error calling ${url.toString()}`);
        });
    }
}
