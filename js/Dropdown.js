const TAB_ICON = document.getElementById('keyboard-tab').cloneNode(true);
TAB_ICON.style = '';

export default class Dropdown {
    constructor(containerElement, queryInput, autocompleteInput) {
        this.containerElement = containerElement;
        this.autocompleteInput = autocompleteInput;
        this.queryInput = queryInput;
        // [{content: 'text', onSelect: () => fn(), }, autocompleteDisabled: true, ...]
        this.rows = [];
        this.selected = -1;
    };

    setRows(rows) {
        this.rows = rows;
        this.selected = rows.length > 0 ? 0 : -1;
    }

    moveSelectionDown() {
        if (this.selected !== -1)
            this.selected = (this.selected + 1) % this.rows.length;
        this.update();
    }

    moveSelectionUp() {
        if (this.selected !== -1)
            this.selected--;
            if (this.selected < 0) this.selected = this.rows.length - 1;
        this.update();
    }

    acceptCurrentSelection() {
        if (this.selected !== -1)
            this.rows[this.selected].onSelect();
    }

    acceptSelectionIndex(i) {
        if (i >= 0 && i < this.rows.length) {
            this.rows[i].onSelect();
        }
    }

    show() {
        this.containerElement.style = '';
    }

    hide() {
        this.containerElement.style = 'display: none';
    }

    update() {
        // draw rows
        const elements = this.rows.map((row, i) => {
            return createRow(row, i === this.selected);
        });
        this.containerElement.innerHTML = '';
        elements.forEach(ele => this.containerElement.appendChild(ele));
        const children = this.containerElement.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.addEventListener('click', () => this.rows[i].onSelect());
        }
        
        // show only if there are elements
        if (elements.length > 0) {
            this.show();
            const selected = this.rows[this.selected];
            const query = this.queryInput.value;
            if (!selected.disableAutocomplete && selected.content.startsWith(query) && selected.content !== query) {
                this.autocompleteInput.value = selected.content;
            } else {
                this.autocompleteInput.value = '';
            }
        } else {
            this.hide();
            this.autocompleteInput.value = '';
        }
    }
}


const createRow = (row, isSelected) => {
    const children = [];
    
    if (row.favicon) {
        const img = create('img', []);
        img.src = row.favicon;
        const icon = create('div', ['icon'], img);
        children.push(icon);
    }
    
    const content = create('p', ['row-content']);
    content.textContent = row.content;
    children.push(content);

    
    const rowClasses = ['dropdown-row'];
    if (isSelected) {
        if (row.actionContent) {
            const selectedAction = create('p', []);
            selectedAction.textContent = row.actionContent;
            children.push(selectedAction);
        }
        rowClasses.push('selected-row');
        children.push(TAB_ICON.cloneNode(true));
    }
    const rowElement = create('div', rowClasses, ...children);
    console.log(rowElement);
    return rowElement;
};

const create = (ele, classes, ...children) => {
    const element = document.createElement(ele);
    element.className = classes.join(' ');
    children.forEach(c => element.appendChild(c));
    return element;
};