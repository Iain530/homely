export const minsToMillis = mins => mins * 60000;

export const createElement = (tag, classes, children, attrs) => {
    const ele = document.createElement(tag);
    ele.className = classes.join(' ');

    if (children)
        children.forEach(child => ele.appendChild(child));

    if (attrs)
        Object.entries(attrs).forEach(([attr, value]) => {
            ele[attr] = value;
        });

    return ele;
};

export const buildBlurSection = () => {
    const blurBg = createElement('div', ['blur-background']);
    const blurColor = createElement('div', ['blur-color', 'accent']);
    const blurContent = createElement('div', ['blur-content']);

    const blur = createElement('div', ['blur'], [blurBg, blurColor, blurContent]);
    const section = createElement('div', ['section'], [blur]);
    
    // return the full section and a reference to the content div
    return {
        section,
        blurContent,
    };
};
