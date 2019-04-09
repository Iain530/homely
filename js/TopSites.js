import { buildBlurSection } from './Blur.js';

const api = browser.topSites;

export default class TopSites {
    constructor(limit = 12) {
        this.topSites = null;
        this.topSitesElement = null;
        this.limit = limit;

        this.initialised = this.init();
    };

    async init() {
        this.topSitesElement = document.getElementById('top-sites');

        this.topSites = await api.get({
            includeFavicon: true,
            limit: this.limit,
        });
    };

    render() {
        this.topSites.forEach((site) => {
            const link = document.createElement('a');
            link.href = site.url;
            link.className = 'remove-style';
        
            const box = document.createElement('div');
            box.className = 'box-link';
        
            const favicon = document.createElement('img');
            favicon.src = site.favicon;
            favicon.alt = ''
        
            const name = document.createElement('p');
            name.textContent = site.title;
        
            link.appendChild(box);
            box.appendChild(favicon);
            box.appendChild(name);
            
            const { section, blurContent } = buildBlurSection();
            section.className = `${section.className} close-top close-bottom shadow-hover`;
            blurContent.className = `${blurContent.className} no-pad`;

            blurContent.appendChild(link);
            this.topSitesElement.appendChild(section);
        });
    };
}