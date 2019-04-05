const api = browser.search;
const BACKSPACE = 8;
const TAB = 9;
const ENTER = 13;

// Example usage:
// <div class="search-bar">
//     <div class="bar-content">
//         <img id="search-icon" src="" alt="">
//         <input id="search" type="search" name="q" placeholder="Search" autocomplete="off">
//         <button id="search-submit" type="submit">
//             <svg class="svg-icon" viewBox="0 0 20 20">
//                 <path fill="none" d="M19.129,18.164l-4.518-4.52c1.152-1.373,1.852-3.143,1.852-5.077c0-4.361-3.535-7.896-7.896-7.896
//                 c-4.361,0-7.896,3.535-7.896,7.896s3.535,7.896,7.896,7.896c1.934,0,3.705-0.698,5.078-1.853l4.52,4.519
//                 c0.266,0.268,0.699,0.268,0.965,0C19.396,18.863,19.396,18.431,19.129,18.164z M8.567,15.028c-3.568,0-6.461-2.893-6.461-6.461
//                 s2.893-6.461,6.461-6.461c3.568,0,6.46,2.893,6.46,6.461S12.135,15.028,8.567,15.028z"></path>
//             </svg>
//         </button>
//     </div>
// </div>
export default class Search {
    constructor() {
        this.engines = null;
        this.currentEngine = null;
        this.defaultEngine = null;
        this.focussed = false;
        this.suggested = null;

        // elements
        this.searchIconElement = null;
        this.searchEngineNameElement = null;
        this.searchBoxElement = null;
        this.searchSubmitButtonElement = null;
        this.dropDownElement = null;

        this.initialised = this.init();
    }

    async init() {
        this.searchIconElement = document.getElementById('search-icon');
        this.searchEngineNameElement = document.getElementById('engine-name');
        this.searchBoxElement = document.getElementById('search');
        this.searchSubmitButtonElement = document.getElementById('search-submit');
        this.dropDownElement = document.getElementById('search-dropdown');

        document.addEventListener('click', () => {
            if (!this.focussed) {
                this.searchBoxElement.focus();
            }
            this.focussed = this.searchBoxElement === document.activeElement;
        });

        const engines = await api.get();
        if (engines.length === 0)
            throw new Error('No search engines');
        this.defaultEngine = engines.find(e => e.isDefault);
        if (this.defaultEngine === undefined)
            throw new Error('No default engine');
        this.setCurrentEngine(this.defaultEngine);
        this.engines = engines.filter(e => !e.isDefault);

        this.searchSubmitButtonElement.addEventListener('focus', () => {
            this.searchBoxElement.focus();
        });

        this.searchSubmitButtonElement.addEventListener('click', () => {
            this.search(this.searchBoxElement.value);
        });
        
        this.searchBoxElement.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case BACKSPACE:
                    if (this.searchBoxElement.value === '') {
                        this.setCurrentEngine(this.defaultEngine);
                    }
                    break;
                case TAB:
                    if (this.suggested !== null)
                        this.setCurrentEngine(this.suggested);
                    break;
                case ENTER:
                    this.search(this.searchBoxElement.value);
            }
            this.updateDropDown();
            return false;
        });

        this.searchBoxElement.addEventListener('input', () => {
            this.suggested = this.suggestEngine(this.searchBoxElement.value);
            this.updateDropDown();
        });
    };

    updateDropDown() {
        let content = '';
        if (this.suggested !== null) {
            content = `Search on ${this.suggested.name}`;
        }
        this.dropDownElement.innerHTML = content;
    };

    async search(query) {
        const tabId = (await browser.tabs.getCurrent()).id;
        api.search({
            query,
            engine: this.currentEngine.name,
            tabId,
        });
    };

    setCurrentEngine(engine) {
        this.currentEngine = engine;
        this.searchBoxElement.value = '';
        this.searchIconElement.src = this.currentEngine.favIconUrl; // TODO: use background img
        if (this.currentEngine.isDefault) {
            this.searchEngineNameElement.parentElement.style = 'display: none';
        } else {
            this.searchEngineNameElement.innerHTML = this.currentEngine.name;
            this.searchEngineNameElement.parentElement.style = '';
        }
        this.suggested = null;
    };

    suggestEngine(query) {
        if (this.currentEngine !== this.defaultEngine) return null;

        const split = query.split(' ');
        if (query === '' || split.length !== 1)
            return null;
        const prefix = split[0].toLowerCase().trim();
        const suggested = this.engines.find((e) => {
            return e.name.toLowerCase().startsWith(prefix) || prefix === e.alias;
        });
        return suggested || null;
    };
}

// const searchIcon = document.getElementById('search-icon');
// searchIcon.src = search.currentEngine.favIconUrl;

// const searchBox = document.getElementById('search');
// searchBox.addEventListener('keydown', (e) => {
//     const suggested = search.suggestEngine(searchBox.value);
//     if (e.keyCode == TAB && suggested !== null) {
//         searchBox.value = suggested.name;
//         searchIcon.src = suggested.favIconUrl;
//         return false;
//     }
// });

// give focus back to search
