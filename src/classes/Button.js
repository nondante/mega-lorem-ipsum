export class Button { 
    constructor (id, textContent, className) {
        this.id = id;
        this.className = className;
        this.textContent = textContent;
    }

    renderButton () {
        const button = document.createElement('button');
        button.id = this.id;
        button.className = this.className;
        button.textContent = this.textContent;
        return button;
    }
}