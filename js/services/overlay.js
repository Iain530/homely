const ESC = 27;

const visible = new Set();

const buttons = {};
const overlayElements = {};

const overlay = document.getElementById('overlay');
const background = document.getElementById('page-bg-blur');

background.addEventListener('click', () => hideOverlay());
document.addEventListener('keydown', (e) => {
    if (e.keyCode === ESC) {
        hideOverlay();
    }
});

const showOverlay = () => {
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    background.style.visibility = 'visible';
    background.style.opacity = '0'; // TODO: show background?
};

const hideOverlay = () => {
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
    background.style.visibility = 'hidden';
    background.style.opacity = '0';
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
