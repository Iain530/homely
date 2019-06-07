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
    const clock = new Clock();
    const search = new Search();
    const topSites = new TopSites();
    const bookmarks = new Bookmarks();
    const weather = new Weather();
    const editSettings = new EditSettings();
    const quote = new Quote();

    const settings = await loadSettings();

    if (!settings.backgroundImagesEnabled)
        removeBackgroundImages();

    await Promise.all([
        clock.initialised,
        search.initialised,
        topSites.initialised,
        bookmarks.initialised,
        weather.initialised,
        editSettings.initialised,
        quote.initialised,
    ]);

    quote.render();
    clock.render();
    topSites.render();
    editSettings.render();

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
