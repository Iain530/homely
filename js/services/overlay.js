const ESC = 27;

const visible = new Set();

const buttons = {};
const overlayElements = {};

const overlay = document.getElementById('overlay');
const background = document.getElementById('page-bg');

background.addEventListener('click', () => hideOverlay());
document.addEventListener('keydown', (e) => {
    if (e.keyCode === ESC) {
        hideOverlay();
    }
});

const showOverlay = () => {
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
};

const hideOverlay = () => {
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
    hideAll();
};

const hide = (element) => {
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    element.style.display = 'none';
    visible.delete(element);
};

const hideAll = () => {
    visible.forEach(element => hide(element));
};

const toggle = (overlayElement) => {
    if (!visible.has(overlayElement)) {
        hideAll();
        overlayElement.style.visibility = 'visible';
        overlayElement.style.opacity = '1';
        overlayElement.style.display = 'block';
        visible.add(overlayElement);
        showOverlay();
    } else {
        hideOverlay();
        hide(overlayElement);
    }
};


export const addOverlay = (buttonId, overlayId) => {
    buttons[buttonId] = document.getElementById(buttonId);
    overlayElements[overlayId] = document.getElementById(overlayId);
    hide(overlayElements[overlayId]);

    buttons[buttonId].addEventListener('click', () => toggle(overlayElements[overlayId]));
};



// class Bar {
//     constructor() {
//         this.overlay = document.getElementById('overlay');

//         this.infoButton = document.getElementById('info-button');
//         this.infoOverlay = document.getElementById('info-overlay');

//         this.settingsButton = document.getElementById('settings-button');
//         this.settingsOverlay = document.getElementById('settings-overlay');

//         this.visible = new Set();

//         this.infoButton.addEventListener('click', () => {
//             this.toggle(this.infoOverlay);
//         });

//         // document.addEventListener('click', () => this.hideAll());

//         this.initialised = this.init();
//     }

//     showOverlay() {
//         this.overlay.style.visibility = 'visible';
//         this.overlay.style.opacity = '1';
//     }

//     hideOverlay() {
//         this.overlay.style.visibility = 'hidden';
//         this.overlay.style.opacity = '0';
//     }

//     toggle(element) {
//         if (!this.visible.has(element)) {
//             this.hideAll();
//             element.style.visibility = 'visible';
//             element.style.opacity = '1';
//             this.visible.add(element);
//             this.showOverlay();
//         } else {
//             this.hideOverlay();
//             this.hide(element);
//         }
//     }

//     hide(element) {
//         element.style.visibility = 'hidden';
//         element.style.opacity = '0';
//         this.visible.delete(element);
//     }

//     hideAll() {
//         this.visible.forEach((element) => this.hide(element));
//     }
// }