import { createElement } from './utils.js';

const TAB_ICON = document.getElementById('keyboard-tab').cloneNode(true);
TAB_ICON.style = '';

export default class Dropdown {
    constructor(searchBoxElement, containerElement, queryInput, autocompleteInput) {
        this.searchBoxElement = searchBoxElement;
        this.containerElement = containerElement;
        this.autocompleteInput = autocompleteInput;
        this.queryInput = queryInput;
        this.query = null;
        this.selected = -1;
        this.mouseSelectionEnabled = false;

        document.addEventListener('mousemove', () => {
            this.mouseSelectionEnabled = true; 
        });
        // [{content: 'text', onSelect: () => fn(), }, autocompleteDisabled: true, ...]
        this.rows = [];
    }

    setQuery(query) {
        // current user input query
        this.query = query;
        this.mouseSelectionEnabled = false;
    }

    setRows(rows) {
        this.rows = rows;
        this.selected = -1;
        this.mouseSelectionEnabled = false;
    }

    moveSelectionDown() {
        this.selected = Math.min(this.selected + 1, this.rows.length - 1);
        this.render();
        this.mouseSelectionEnabled = false;
    }

    moveSelectionUp() {
        this.selected = Math.max(this.selected - 1, -1);
        this.render();
        this.mouseSelectionEnabled = false;
    }

    acceptCurrentSelection() {
        this.acceptSelectionIndex(this.selected);
    }

    acceptTopSelection() {
        this.acceptSelectionIndex(0);
    }

    acceptSelectionIndex(i) {
        if (i >= 0 && i < this.rows.length) {
            this.rows[i].onSelect();
        }
        this.mouseSelectionEnabled = false;
    }

    show() {
        this.containerElement.style = '';
    }

    hide() {
        this.containerElement.style = 'display: none';
    }

    render() {
        // draw rows
        const elements = this.rows.map((row, i) => {
            return createRow(row, i, i === this.selected);
        });
        this.containerElement.innerHTML = '';
        elements.forEach(ele => this.containerElement.appendChild(ele));
        const children = this.containerElement.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.addEventListener('mousedown', (e) => {
                this.rows[i].onSelect();
                e.preventDefault();
            });
            child.addEventListener('mouseover', () => {
                if (this.mouseSelectionEnabled && this.selected !== i) {
                    this.selected = i;
                    this.render();
                }
            });
        }
        
        if (elements.length > 0) {
            this.show();
            if (this.selected === -1 || this.rows[this.selected].disableAutocomplete) {
                this.searchBoxElement.value = this.query;
            }
            else
                this.showAutocompletion(this.rows[this.selected]);
        } else {
            this.hide();
        }
    }

    showAutocompletion(selected) {
        const query = this.query;
        if (!selected.disableAutocomplete && selected.content.startsWith(query) && selected.content !== query) {
            const autocompleteStartIndex = this.query.length;
            this.searchBoxElement.value = selected.content;
            this.searchBoxElement.setSelectionRange(
                autocompleteStartIndex,
                this.searchBoxElement.value.length,
                'backward',
            );
        }
    }
}


const createRow = (row, index, isSelected) => {
    const children = [];
    
    if (row.favicon) {
        const img = createElement('img', [], null, {src: row.favicon});

        const icon = createElement('div', ['icon'], [img]);
        children.push(icon);
    }

    const content = createElement('p', ['row-content'], null, {textContent: row.content});
    children.push(content);

    
    const rowClasses = ['dropdown-row'];
    if (isSelected) {
        if (row.actionContent) {
            const selectedAction = createElement('p', [], null, {textContent: row.actionContent});
            const enterIcon = createElement('img', ['enter'], null, {src: 'icons/enter.png'});

            children.push(selectedAction);
            children.push(enterIcon);
        } else if (index === 0) {
            children.push(TAB_ICON.cloneNode(true));
        }
        rowClasses.push('selected-row');
    } else if (index === 0) {
        // tab shortcut for top suggestions
        children.push(TAB_ICON.cloneNode(true));
    }

    return createElement('div', rowClasses, children);
};
