import { getQuoteOfTheDay } from './services/quotes.js';
import { loadSettings } from './services/settings.js';
import { buildBlurSection, createElement } from './utils.js';


export default class Quote {
    constructor() {
        this.quoteElement = null;
        this.quote = null;
        this.enabled = null;
    
        this.initialised = this.init();
    }

    async init() {
        this.quoteElement = document.getElementById('quote');

        const settings = await loadSettings();
        this.enabled = settings.quoteEnabled;
        if (!this.enabled) {
            this.quoteElement.style.display = 'none';
            return;
        }

        getQuoteOfTheDay((quote) => {
            this.quote = quote;
            this.render();
        });
    }

    render() {
        if (this.enabled) {
            if (this.quote) {
                this.quoteElement.innerHTML = '';

                const quoteText = createElement('span', ['quote-text'], [], {textContent: '"' + this.quote.quote + '"'});
                const author = createElement('span', ['quote-author'], [], {textContent: ' - ' + this.quote.author});

                const {
                    section,
                    blurContent
                } = buildBlurSection();
                blurContent.className += ' med-pad-v';
                section.className += ' no-margin';
                
                blurContent.appendChild(createElement('div', [], [quoteText, author]));
                
                this.quoteElement.appendChild(createElement('div', [], [quoteText, author]));
            } else {
                // render placeholder
            }
        }
    }
}