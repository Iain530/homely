import { loadSettings } from './services/settings.js';
import { createElement } from './utils.js';

export default class Clock {
    constructor() {

        this.clockSettings = {};
        this.interval = null;
        this.enabled = null;

        this.initialised = this.init();
    }

    async init() {
        this.clockElement = document.getElementById('clock');
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');

        const settings = await loadSettings();
        this.enabled = settings.clockEnabled;
        this.clockSettings.hour12 = settings.clockHour12;

        if (!this.enabled) {
            this.clockElement.style.display = 'none';
        }

        this.updateClock();
    }

    render() {
        if (this.enabled)
            this.interval = setInterval(() => this.updateClock(), 500);
    }

    updateClock() {
        const time = new Date();

        const timeString = time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: this.clockSettings.hour12
        });

        if (this.clockSettings.hour12) {
            this.timeElement.innerHTML = '';
            const splitTime = timeString.split(' ');
            this.timeElement.textContent = splitTime[0];
            this.timeElement.appendChild(createElement('span', [], null, {textContent: ' ' + splitTime[1].toUpperCase()}));
        } else {
            this.timeElement.innerHTML = timeString;
        }

        this.dateElement.innerHTML = time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
}