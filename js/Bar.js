export default class Bar {
    constructor() {
        this.overlay = document.getElementById('overlay');
        this.infoButton = document.getElementById('info-button');
        this.infoOverlay = document.getElementById('info-overlay');

        this.visible = new Set();

        this.infoButton.addEventListener('click', () => {
            this.toggle(this.infoOverlay);
        });

        // document.addEventListener('click', () => this.hideAll());

        this.initialised = this.init();
    }

    async init() {

    }

    showOverlay() {
        this.overlay.style.visibility = 'visible';
        this.overlay.style.opacity = '1';
    }

    hideOverlay() {
        this.overlay.style.visibility = 'hidden';
        this.overlay.style.opacity = '0';
    }

    toggle(element) {
        if (!this.visible.has(element)) {
            this.hideAll();
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            this.visible.add(element);
            this.showOverlay();
        } else {
            this.hideOverlay();
            this.hide(element);
        }
    }

    hide(element) {
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        this.visible.delete(element);
    }

    hideAll() {
        this.visible.forEach((element) => this.hide(element));
    }
}