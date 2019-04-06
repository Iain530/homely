

export default class Clock {
    constructor() {
        this.clockElement = document.getElementById('clock');
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.settings = {
            hour12: false,
        }
        this.interval = null;
        this.updateClock();
    };

    start() {
        this.interval = setInterval(() => this.updateClock(), 500);
    }

    updateClock() {
        const time = new Date();
        this.timeElement.innerHTML = time.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: this.settings.hour12 });
        this.dateElement.innerHTML = time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
};