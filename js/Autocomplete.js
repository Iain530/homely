const SUGGESTIONS_URL = 'https://api.datamuse.com/sug';

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
            this.timeout = setTimeout(() => this.fetchAutocompletions(callback),
                                      delay);
        });
    };

    async fetchAutocompletions(callback = () => {}) {
        const query = this.inputElement.value;
        if (query === '') return callback([], '');
        if (query === this.lastQuery) return callback(this.completions, query);

        this.loading = true;
        this.lastQuery = query;

        const request = new XMLHttpRequest();
        const url = new URL(SUGGESTIONS_URL);
        url.searchParams.set('s', query);
        url.searchParams.set('max', this.max);
        
        request.open('GET', url.toString(), true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                let scores = JSON.parse(request.response);
                if (this.lastQuery === query) {
                    this.loading = false;
                    scores = scores.filter(({word, score}) => word !== query && score > this.threshhold);
                    this.completions = scores;
                    callback(scores, query);
                }
            }
        };
        request.send();
    };
};