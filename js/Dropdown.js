const TAB_ICON = document.getElementById('keyboard-tab').cloneNode(true);
TAB_ICON.style = '';

export default class Dropdown {
    constructor(searchBoxElement, containerElement, queryInput, autocompleteInput) {
        this.searchBoxElement = searchBoxElement;
        this.containerElement = containerElement;
        this.autocompleteInput = autocompleteInput;
        this.queryInput = queryInput;
        this.query = null;
        // [{content: 'text', onSelect: () => fn(), }, autocompleteDisabled: true, ...]
        this.rows = [];
        this.selected = -1;
    }

    setQuery(query) {
        // current user input query
        this.query = query;
    }

    setRows(rows) {
        this.rows = rows;
        this.selected = -1;
    }

    moveSelectionDown() {
        this.selected = Math.min(this.selected + 1, this.rows.length - 1);
        this.update();
    }

    moveSelectionUp() {
        this.selected = Math.max(this.selected - 1, -1);
        this.update();
    }

    acceptCurrentSelection() {
        if (this.selected !== -1)
            this.rows[this.selected].onSelect();
    }

    acceptTopSelection() {
        this.acceptSelectionIndex(0);
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
        }
        
        // show only if there are elements
        if (elements.length > 0) {
            this.show();
            if (this.selected === -1 || this.rows[this.selected].disableAutocomplete)
                this.searchBoxElement.value = this.query;
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
                'backward'
            );
        }
    }
}


const createRow = (row, index, isSelected) => {
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
            const enterIcon = document.createElement('img');
            enterIcon.src = 'icons/enter.png';
            enterIcon.className = 'enter';
            children.push(enterIcon);
        }
        rowClasses.push('selected-row');
    } else if (index === 0) {
        children.push(TAB_ICON.cloneNode(true));
    }
    const rowElement = create('div', rowClasses, ...children);

    return rowElement;
};

const create = (ele, classes, ...children) => {
    const element = document.createElement(ele);
    element.className = classes.join(' ');
    children.forEach(c => element.appendChild(c));
    return element;
};