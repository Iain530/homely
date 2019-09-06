import { buildBlurSection } from './utils.js';
import { loadSettings } from './services/settings.js';
import Storage from './services/storage.js';
import { get } from './services/requests.js';

const storage = new Storage('BOOKMARKS');

// eslint-disable-next-line no-undef
const api = browser.bookmarks;
const HOMELY_FOLDER = 'Homely';
const FAVICON_URL = 'https://besticon-demo.herokuapp.com/allicons.json?url=';

export default class Bookmarks {
    constructor() {
        this.bookmarks = null;
        this.favicons = {};
        this.bookmarksElement = null;

        this.initialised = this.init();
    }

    async init() {
        this.bookmarksElement = document.getElementById('bookmarks');

        const settings = await loadSettings();
        this.enabled = settings.bookmarksEnabled;
        if (!this.enabled) return;

        const folders = await api.search({
            title: HOMELY_FOLDER,
        });

        if (folders.length > 0) {
            this.bookmarks = (await api.getSubTree(folders[0].id))[0].children;

            this.bookmarks.forEach((bookmark) => {
                get(FAVICON_URL + bookmark.url, (request) => {
                    this.favicons[bookmark.url] = JSON.parse(request.response).icons[0].url;
                    this.render();
                });
            });
        }
    }

    render() {
        if (!this.enabled || !this.bookmarks) return;

        this.bookmarksElement.innerHTML = '';

        this.bookmarks.forEach((bookmark) => {
            if (bookmark.type === 'bookmark') {
                const link = document.createElement('a');
                link.href = bookmark.url;
                link.className = 'remove-style';
                const box = document.createElement('div');
                box.className = 'box-link';
    
                const favicon = document.createElement('img');
                favicon.src = this.favicons[bookmark.url] || '';
                favicon.alt = '';
    
                const name = document.createElement('p');
                name.textContent = bookmark.title;
    
                link.appendChild(box);
                box.appendChild(favicon);
                box.appendChild(name);
    
                const {
                    section,
                    blurContent
                } = buildBlurSection();
                section.className = `${section.className} close-top close-bottom shadow-hover`;
                blurContent.className = `${blurContent.className} no-pad`;
    
                blurContent.appendChild(link);
                this.bookmarksElement.appendChild(section);
            }
        });
    }
}