import Search from './js/Search.js';
import TopSites from './js/TopSites.js';
import Bookmarks from './js/Bookmarks.js';
import Clock from './js/Clock.js';
import Weather from './js/Weather.js';
import EditSettings from './js/EditSettings.js';

import { addOverlay } from './js/services/overlay.js';

const loadContent = async () => {
    const clock = new Clock();
    clock.start();

    const search = new Search();
    const topSites = new TopSites();
    const bookmarks = new Bookmarks();
    const weather = new Weather();
    const editSettings = new EditSettings();

    await Promise.all([
        search.initialised,
        topSites.initialised,
        bookmarks.initialised,
        weather.initialised,
        editSettings.initialised,
    ]);

    topSites.render();
    editSettings.render();

    addOverlay('info-button', 'info-overlay');
};

window.addEventListener('DOMContentLoaded', () => {
    loadContent();
});
