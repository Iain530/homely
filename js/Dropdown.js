export default class Dropdown {
    constructor(containerElement) {
        this.containerElement = containerElement;
        // [{content: 'text', onSelect: () => fn(), }, ...]
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
            const { content } = row;
            const rowElement = document.createElement('div');
            let className = 'dropdown-row';
            if (i === this.selected) className = `${className} selected-row`;
            rowElement.className = className;
            rowElement.textContent = content;
            return rowElement;
        });
        this.containerElement.innerHTML = '';
        elements.forEach(ele => this.containerElement.appendChild(ele));
        
        // show only if there are elements
        if (elements.length > 0) {
            this.show();
        } else {
            this.hide();
        }
    }


}