import { Button } from './Button.js';

export class Confirmation {
    constructor (type) {
        this.type = type;
        this.renderConfirmationMessageDom();
    }

    async getConfirmation () {
        return new Promise((resolve) => {
            const agreeButton = document.getElementById("yes");
            const cancelButton = document.getElementById("cancel");
            agreeButton.addEventListener('click',function(e) {
                resolve("confirmed");
            }, {once: true});
            cancelButton.addEventListener('click',function(e) {
            resolve("canceled");
        }, {once: true});
        });
    }

    getMessageText () {
        return `Are you sure you want to ${this.type} the record?`
    }

    renderConfirmationMessageDom () {
        const popup = document.getElementById("myPopup");
        const deleteMessage = document.createElement('div');
        const messageContainer = document.createElement("span");
        const messageText = document.createTextNode(this.getMessageText());
        const buttonGroup = document.createElement('div');
        const agreeButton = new Button("yes", "Yes").renderButton();
        const cancelButton = new Button("cancel", "Cancel").renderButton();
        deleteMessage.id = "deleteMessage";
        messageContainer.appendChild(messageText);
        buttonGroup.appendChild(agreeButton);
        buttonGroup.appendChild(cancelButton);
        buttonGroup.className = "button-group";
        deleteMessage.appendChild(messageContainer);
        deleteMessage.appendChild(buttonGroup);
        popup.appendChild(deleteMessage);
    }
}