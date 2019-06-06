import Storage from '../Storage.js';

const storage = new Storage('SETTINGS');
const SETTINGS_KEY = 'all_settings';

let settings;
const defaultSettings = {
    topSitesEnabled: true,
    topSitesRows: 2,
    weatherEnabled: true,
};

export const details = {
    topSitesEnabled: {
        title: 'Top Sites',
        description: 'Quick links to your most visited sites',
        type: 'boolean',
    },
    // topSitesRows: {
    //     title: 'Top Sites',
    //     description: 'Number of rows to display',
    //     type: 'int',
    // },
    weatherEnabled: {
        title: 'Local Weather',
        description: 'Weather forecast in your location',
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