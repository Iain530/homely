import { addOverlay } from './services/overlay.js';
import { loadSettings, setSetting, details } from './services/settings.js';

export default class EditSettings {
    constructor() {
        this.editSettingsElement = null;
        this.settings = null;
        
        this.initialised = this.init();
    }
    
    async init() {
        addOverlay('settings-button', 'settings-overlay');
        this.editSettingsElement = document.getElementById('settings-overlay');
        this.settings = await loadSettings();
    }

    renderTitle(detail) {
        const title = document.createElement('h2');
        title.textContent = detail.title;
        return title;
    }

    renderDescription(detail) {
        const desc = document.createElement('div');
        desc.textContent = detail.description;
        return desc;
    }

    renderInput(setting, detail) {
        const input = document.createElement('div');
        input.className = 'input';

        const onChange = (value) => setSetting(setting, value);

        if (detail.type === 'boolean') {
            const label = document.createElement('label');
            label.className = 'switch';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            if (this.settings[setting] === true) {
                checkbox.checked = true;
            }

            checkbox.addEventListener('change', () => onChange(checkbox.checked));

            const span = document.createElement('span');
            span.className = 'slider round';

            label.appendChild(checkbox);
            label.appendChild(span);

            input.appendChild(label);
        } else if (detail.type === 'int') {
            const numberInput = document.createElement('input');
            numberInput.type = 'number';
            numberInput.min = '1';
            numberInput.max = '3';
            numberInput.value = this.settings.topSitesRows.toString();

            numberInput.addEventListener('change', () => onChange(parseInt(numberInput.value)));
            numberInput.addEventListener('change', () => console.log(numberInput.value));

            input.appendChild(numberInput);
        } else if (detail.type === 'color') {
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = this.settings.backgroundColor;

            input.appendChild(colorPicker);
            colorPicker.addEventListener('change', () => onChange(colorPicker.value));
        }
        return input;
    }

    render() {
        let prevTitle = '';
        const container = document.createElement('div');
        container.className = 'settings-container';
        Object.entries(details).forEach(([setting, detail]) => {
            if (detail.title !== prevTitle) {
                container.appendChild(this.renderTitle(detail));
                prevTitle = detail.title;
            }
            const groupedDescription = document.createElement('div');
            groupedDescription.className = 'settings row';
            groupedDescription.appendChild(this.renderDescription(detail));
            groupedDescription.appendChild(this.renderInput(setting, detail));
            container.appendChild(groupedDescription);
        });
        
        this.editSettingsElement.appendChild(container);
    }
}