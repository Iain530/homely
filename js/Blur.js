export const buildBlurSection = () => {
    const section = document.createElement('div');
    section.className = 'section';

    const blur = document.createElement('div');
    blur.className = 'blur';

    const blurBg = document.createElement('div');
    blurBg.className = 'blur-background';

    const blurColour = document.createElement('div');
    blurColour.className = 'blur-color light';

    let blurContent = document.createElement('div');
    blurContent.className = 'blur-content';

    section.appendChild(blur);
    blur.appendChild(blurBg);
    blur.appendChild(blurColour);
    blur.appendChild(blurContent);

    // return the full section and a reference to the content div
    return { section, blurContent };
};