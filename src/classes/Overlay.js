import { Confirmation } from './Confirmation.js';
import { Button } from './Button.js';

export class Overlay {
    constructor (type) {
        this.type = type;
        this.postItem = this.postItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.renderSubmitButton = this.renderSubmitButton.bind(this);
        this.closeOverlay = this.closeOverlay.bind(this);
        this.overlay = this.renderOverlay();
    }
    renderOverlay () {
      const overlay  = this.createOverlay();
      if (this.type === "add" || this.type === "update") {
        this.createFormMessage();
      }
      overlay.classList.add("show");
      overlay.focus();
      overlay.addEventListener("keydown", (e) => {
        if(e.key === 'Escape') {
          this.closeOverlay(null, "overlay");
        }
      })
      return overlay
    }

    closeOverlay (e, id) {
      const isOverlay = (id === "overlay" ||  e.target.id === "overlay" || e.target.id === "closeButton");
      if (isOverlay) {
        this.overlay.classList.remove("show");
        document.body.removeChild(this.overlay);
      }
    }

    async getConfirmation () {
      const confirmationPopup = new Confirmation(this.type);
      const confirmation = await confirmationPopup.getConfirmation();
      return confirmation
    }

    async postItem () {
      const addButton = document.getElementById("postNewItem");

      return new Promise((resolve) => {
        addButton.addEventListener('click',function(e) {
            e.preventDefault();
            const formData = new FormData(document.querySelector("form"));
            const data = {
              firstName: formData.get("firstName"),
              lastName: formData.get("lastName"),
              gender: formData.get("gender"),
              company: formData.get("company")
            };
            resolve(data);
        }, {once: true});
      })
    }

    async updateItem () {
      const updateButton = document.getElementById("updateItem");
      return new Promise((resolve) => {
        updateButton.addEventListener('click',function(e) {
            e.preventDefault();
            resolve(true);
        }, {once: true});
      })
    } 

    getUpdatedItem () {
      const formData = new FormData(document.querySelector("form"));
      const data = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        gender: formData.get("gender"),
        company: formData.get("company")
      };
      return data;
    }

    loadItem(data) {
      document.getElementsByName("firstName")[0].value = data.firstName;
      document.getElementsByName("lastName")[0].value = data.lastName;
      document.getElementsByName("gender")[0].value = data.gender;
      document.getElementsByName("company")[0].value = data.company;
    }

    renderSubmitButton (type, form) {
      let button;
      if(type === "add") {
        button = new Button("postNewItem", "Add").renderButton();
      } else if (type === "update") {
        button = new Button("updateItem", "Update").renderButton();
      }
      form.append(button);
    }

    unmountFormMessage () {
      const formContainer = document.getElementById("form-container")
      const form = document.getElementById("addForm");
      formContainer.remove(form);
    }

    createFormMessage () {
      const formData = [
        {
          label : "First Name",
          name: "firstName"
        },
        {
          label : "Last Name",
          name: "lastName"
        },
        {
          label : "Gender",
          name: "gender"
        },
        {
          label : "Company",
          name: "company"
        }
      ]
      const popup = document.getElementById('myPopup');
      const formContainer = document.createElement('div');
      const form = document.createElement("form");
      formData.forEach( data => {
        const record = document.createElement('div');
        record.className = "record";
        const label = document.createElement("label");
        const labelText = document.createTextNode(data.label)
        label.appendChild(labelText);
        const input = document.createElement("input");
        input.type = "text"
        input.name = data.name;
        record.appendChild(label);
        record.appendChild(input);
        form.appendChild(record);
      })
      formContainer.id = "form-container";
      form.id = "addForm";
      form.className = "add-item-form";
      formContainer.appendChild(form);
      popup.appendChild(formContainer);
      this.renderSubmitButton(this.type, form)
      return formContainer;
    }

    createOverlay () {
      const overlay = document.createElement('div');
      const popup = document.createElement('div');
      const closeButton = new Button("closeButton", "X").renderButton();
      overlay.id = "overlay";
      overlay.onclick = this.closeOverlay;
      overlay.tabIndex = "-1";
      popup.className = "popup";
      popup.id = "myPopup";
      overlay.appendChild(popup);
      popup.appendChild(closeButton);
      document.body.appendChild(overlay);
      return overlay;
    }
}
