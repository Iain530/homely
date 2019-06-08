import Search from './js/Search.js';
import TopSites from './js/TopSites.js';
import Bookmarks from './js/Bookmarks.js';
import Clock from './js/Clock.js';
import Weather from './js/Weather.js';
import EditSettings from './js/EditSettings.js';
import Quote from './js/Quote.js';

import { addOverlay } from './js/services/overlay.js';
import { loadSettings } from './js/services/settings.js';

const loadContent = async () => {   
    // eslint-disable-next-line no-unused-vars
    const search = new Search();

    const components = [
        new Clock(),
        new TopSites(),
        new Bookmarks(),
        new Weather(),
        new Quote(),
        new EditSettings(),
    ];

    components.forEach((component) => {
        component.initialised.then(() => component.render());
    });

    const settings = await loadSettings();
    if (!settings.backgroundImagesEnabled)
        removeBackgroundImages();

    addOverlay('info-button', 'info-overlay');
};


const removeBackgroundImages = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/no-background.css';

    const head = document.getElementById('head');
    head.appendChild(link);
};


window.addEventListener('DOMContentLoaded', () => {
    loadContent();
});
