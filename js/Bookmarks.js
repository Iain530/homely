import { buildBlurSection } from './utils.js';

// eslint-disable-next-line no-undef
const api = browser.bookmarks;
const HOMELY_FOLDER = 'Homely';
const FAVICON_URL = 'https://www.google.com/s2/favicons?domain=';

export default class Bookmarks {
    constructor() {
        this.bookmarks = null;
        this.bookmarksElement = null;

        this.initialised = this.init();
    }

    async init() {
        this.bookmarksElement = document.getElementById('bookmarks');

        const folders = await api.search({
            title: HOMELY_FOLDER,
        });

        if (folders.length > 0) {
            this.bookmarks = (await api.getSubTree(folders[0].id))[0].children;
        }
    }

    render() {
        if (!this.bookmarks) return;

        this.bookmarks.forEach((bookmark) => {
            const link = document.createElement('a');
            link.href = bookmark.url;
            link.className = 'remove-style';

            const box = document.createElement('div');
            box.className = 'box-link';

            const favicon = document.createElement('img');
            favicon.src = FAVICON_URL + bookmark.url;
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
        });
    }
}