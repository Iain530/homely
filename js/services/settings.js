import Storage from './storage.js';

const storage = new Storage('SETTINGS');
const SETTINGS_KEY = 'all_settings';

let settings;
const defaultSettings = {
    searchBarEnabled: true,
    googleAutocompleteEnabled: true,
    topSitesEnabled: true,
    topSitesRows: 2,
    bookmarksEnabled: false,
    weatherEnabled: true,
    backgroundImagesEnabled: true,
    clockEnabled: true,
    clockHour12: false,
    quoteEnabled: true,
};

export const details = {
    searchBarEnabled: {
        title: 'Search',
        description: 'Search bar with support for most search engines with keyword switching, autcomplete and support for searching open tabs by title',
        type: 'boolean',
    },
    googleAutocompleteEnabled: {
        title: 'Search',
        description: 'Get suggestions when typing a query (all suggestions are from Google no matter which engine is currently selected)',
        type: 'boolean',
    },
    topSitesEnabled: {
        title: 'Top Sites',
        description: 'Show links to your most visited sites',
        type: 'boolean',
    },
    // topSitesRows: {
    //     title: 'Top Sites',
    //     description: 'Number of rows to display',
    //     type: 'int',
    // },
    bookmarksEnabled: {
        title: 'Bookmarks',
        description: 'Show links to your bookmarks. Place bookmarks in a folder named "Homely" to make them appear. This feature uses a third party service for retrieving favicons as this is not yet support natively.',
        type: 'boolean',
    },
    clockEnabled: {
        title: 'Clock',
        description: 'Display a digital clock with the current date and time',
        type: 'boolean',
    },
    clockHour12: {
        title: 'Clock',
        description: 'Use 12 hour time',
        type: 'boolean',
    },
    weatherEnabled: {
        title: 'Local Weather',
        description: 'Show weather forecast in your location',
        type: 'boolean',
    },
    quoteEnabled: {
        title: 'Quote of the Day',
        description: 'Show a motivational or inspiring quote of the day',
        type: 'boolean',
    },
    backgroundImagesEnabled: {
        title: 'Background Image',
        description: 'Show a daily background image',
        type: 'boolean',
    },
};

const validateSettings = {
    topSiteRows: (rows) => rows > 0 && rows < 5,
};

export const loadSettings = async () => {
    if (!settings) {
        const savedSettings = await storage.get(SETTINGS_KEY);
        settings = {...defaultSettings};
        if (savedSettings)
            Object.entries(savedSettings).forEach(([key, value]) => {
                settings[key] = value;
            });
    }
    return settings;
};

export const setSetting = (name, value) => {
    if (name in settings && typeof value === typeof defaultSettings[name]) {
        if (name in validateSettings && !validateSettings[name](value))
            return false;  // given value is not allowed
        settings[name] = value;
        saveSettings();
        return true;
    }
    return false;
};

export const saveSettings = () => {
    storage.set(SETTINGS_KEY, settings);
};