import Autocomplete from './Autocomplete.js';
import Dropdown from './Dropdown.js';

import { loadSettings } from './services/settings.js';

const BACKSPACE = 8;
const TAB = 9;
const ENTER = 13;
const ESC = 27;
const ARROWUP = 38;
const ARROWDOWN = 40;

// eslint-disable-next-line no-undef
const searchApi = browser.search;
// eslint-disable-next-line no-undef
const tabsApi = browser.tabs;

// TODO: update
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
    constructor(autocompleteDelay = 50) {
        // attributes
        this.engines = null;
        this.currentEngine = null;
        this.defaultEngine = null;
        this.suggested = null;
        this.autocomplete = null;
        this.dropdown = null;
        this.suggestedTabs = null;
        this.allTabs = null;
        this.tabId = null;
        
        // elements
        this.searchElement = null;
        this.searchIconElement = null;
        this.searchEngineNameElement = null;
        this.searchBoxElement = null;
        this.searchSubmitButtonElement = null;
        this.dropDownElement = null;
        this.dropDownContainer = null;
        this.autocompleteElement = null;

        this.initialised = this.init(autocompleteDelay);
    }

    async init(autocompleteDelay) {

        this.searchElement = document.getElementById('search-bar');

        const settings = await loadSettings();
        if (!settings.searchBarEnabled) {
            this.searchElement.style.display = 'none';
            return;
        }

        this.searchIconElement = document.getElementById('search-icon');
        this.searchEngineNameElement = document.getElementById('engine-name');
        this.searchBoxElement = document.getElementById('search');
        this.searchSubmitButtonElement = document.getElementById('search-submit');
        this.dropDownElement = document.getElementById('search-dropdown');
        this.dropDownContainer = document.getElementById('search-dropdown-container');
        this.autocompleteElement = document.getElementById('autocomplete-input');

        if (settings.googleAutocompleteEnabled) {
            this.autocomplete = new Autocomplete(
                this.searchBoxElement,
                (completions, query) => this.onCompletionsReturn(completions, query),
                autocompleteDelay,
            );
        }
        
        this.dropdown = new Dropdown(
            this.searchBoxElement,
            this.dropDownContainer,
            this.searchBoxElement,
            this.autocompleteElement
        );

        this.allTabs = await tabsApi.query({currentWindow: true});
        // sort and remove most recent which current New Tab
        this.allTabs.sort((a, b) => b.lastAccessed - a.lastAccessed);
        this.tabId = this.allTabs.shift().id;

        const engines = await searchApi.get();
        if (engines.length === 0) throw new Error('No search engines');
        const defaultEngine = engines.find(e => e.isDefault);
        if (defaultEngine === undefined) throw new Error('No default engine');

        this.engines = engines.filter(e => !e.isDefault);
        this.defaultEngine = defaultEngine;
        this.setCurrentEngine(defaultEngine);

        // focus the search element when the page is comes in to focus
        document.addEventListener('focus', () => this.searchBoxElement.focus());

        // refocus text element on tab from search box
        this.searchSubmitButtonElement.addEventListener('focus', () => this.searchBoxElement.focus());
        // click the search button to search
        this.searchSubmitButtonElement.addEventListener('click', () => this.search(this.searchBoxElement.value));

        // update the dropdown immediately on focus of search box
        this.searchBoxElement.addEventListener('focus', () => this.dropdown.render());

        this.searchBoxElement.addEventListener('focusout', () => this.onUnfocus());
        this.searchBoxElement.addEventListener('keydown', (e) => this.onKeyDown(e));
        this.searchBoxElement.addEventListener('input', () => this.onInput());
        this.searchBoxElement.addEventListener('change', () => this.onInput());
    }

    onKeyDown(event) {
        switch (event.keyCode) {
        case BACKSPACE:
            if (this.searchBoxElement.value === '')
                this.setCurrentEngine(this.defaultEngine);
            this.updateDropDown();
            break;
        case ARROWUP:
            this.dropdown.moveSelectionUp();
            event.preventDefault(); // don't move cursor
            break;
        case ARROWDOWN:
            this.dropdown.moveSelectionDown();
            event.preventDefault();
            break;
        case ENTER:
            if (this.dropdown.selected === -1)
                this.search(this.searchBoxElement.value);
            this.dropdown.acceptCurrentSelection();
            this.updateDropDown();
            break;
        case TAB:
            this.dropdown.acceptTopSelection();
            this.updateDropDown();
            break;
        case ESC:
            this.searchBoxElement.blur(); // remove focus
            break;
        }
    }

    onInput() {
        const query = this.searchBoxElement.value;
        this.suggested = this.suggestEngine(query);
        this.suggestedTabs = this.suggestOpenTab(query);
        this.dropdown.setQuery(query);
        this.updateDropDown();
    }

    isFocussed() {
        const activeElement = document.activeElement;
        return activeElement === this.searchBoxElement || activeElement === this.searchSubmitButtonElement;  
    }

    onUnfocus() {
        if (!this.isFocussed()) {
            this.dropdown.hide();
        }
    }

    onCompletionsReturn(completions, query) {
        this.completions = completions;
        this.completionsQuery = query;
        this.updateDropDown();
    }

    updateDropDown() {
        const rows = [];
        if (this.suggested !== null) {
            rows.push({
                content: `Search on ${this.suggested.name}`,
                onSelect: () => this.setCurrentEngine(this.suggested),
                disableAutocomplete: true,
                actionContent: 'Switch search engine',
                favicon: this.suggested.favIconUrl,
            });
        }

        if (this.suggestedTabs) {
            this.suggestedTabs.forEach((tab) => {
                rows.push({
                    content: tab.title,
                    onSelect: () => this.switchToTab(tab.id),
                    disableAutocomplete: true,
                    actionContent: 'Switch to tab',
                    favicon: tab.favIconUrl,
                });
            });
        }

        const currentQuery = this.searchBoxElement.value;
        if (currentQuery !== '' && this.completions) {
            this.completions.forEach((suggestion) => {
                rows.push({
                    content: suggestion,
                    onSelect: () => this.search(suggestion),
                });
            });
        }
        
        // change the state and update document
        this.dropdown.setRows(rows);
        this.dropdown.render();
    }

    switchToTab(tabId) {
        tabsApi.update(tabId, { active: true });
        tabsApi.remove(this.tabId);
    }

    async search(query) {
        const tabId = (await tabsApi.getCurrent()).id;
        searchApi.search({
            query,
            engine: this.currentEngine.name,
            tabId,
        });
    }

    setCurrentEngine(engine) {
        this.currentEngine = engine;
        const query = this.searchBoxElement.value;
        const split = query.split(' ');
        if (split.length > 1) {
            this.searchBoxElement.value = split.slice(0, split.length-1).join(' ');
        } else {
            this.searchBoxElement.value = '';
        }
        this.searchIconElement.src = this.currentEngine.favIconUrl;
        if (this.currentEngine.isDefault) {
            this.searchEngineNameElement.parentElement.style = 'display: none';
        } else {
            this.searchEngineNameElement.innerHTML = this.currentEngine.name;
            this.searchEngineNameElement.parentElement.style = '';
        }
        this.suggested = null;
    }

    suggestEngine(query) {
        if (this.currentEngine !== this.defaultEngine || query === '') return null;

        const split = query.split(' ');
        const prefix = split[split.length-1].toLowerCase().trim();
        if (split.length > 1 && prefix.length < 2) return null;
        const suggested = this.engines.find((e) => {
            return e.name.toLowerCase().startsWith(prefix) || prefix === e.alias;
        });
        return suggested || null;
    }

    suggestOpenTab(query) {
        if (query.length === 0) return null;
        return this.allTabs.filter((tab) => {
            return tab.title.toLowerCase().startsWith(query.toLowerCase());
        }).slice(0, 5) || null;
    }
}
