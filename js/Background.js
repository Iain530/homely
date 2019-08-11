import { loadSettings } from './services/settings.js';

export default class Background {
    constructor() {
        this.settings = null;
        this.backgroundColor = null;

        this.initialised = this.init();
    }

    async init() {
        this.settings = await loadSettings();
        this.backgroundColor = this.settings.backgroundColor;
    }

    render() {
        const style = document.documentElement.style;
        if (validHex(this.settings.backgroundColor)) {
            style.setProperty('--background-color-transparent', this.backgroundColor + 'cc');
            if (!this.settings.backgroundImagesEnabled)
                style.setProperty('--background-color-main', this.backgroundColor);
        }
    }
}

const validHex = (hex) => {
    return hex.length == 7 && hex[0] == '#';
};