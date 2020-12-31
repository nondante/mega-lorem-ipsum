import {getData, getOne, postData, deleteData, updateData} from 'api';
import { Overlay } from './Overlay.js';
import { Button } from './Button.js';

export class Table {
    constructor () {
        this.addItem = this.addItem.bind(this);
        this.domUpdate = this.domUpdate.bind(this);
        this.editItem = this.editItem.bind(this);
    }

    renderTable () {
        this.createTable();
        this.fillTableData();
    }

    createTable () {
        const containerDiv = document.createElement('div');
        const innerContainerDiv = document.createElement('div');
        const addItemButton = new Button("addItem", "Add Item").renderButton();
        const table = document.createElement("table");
        const thead = table.createTHead();
        const tbody = table.createTBody();
        const tableHeaderRow = thead.insertRow();
        const columnNames = ["First Name", "Last Name", "Gender", "Company", "Actions"];

        columnNames.forEach((columnName) => {
            let th = document.createElement("th");
            let text = document.createTextNode(columnName);
            th.className = "header__item";
            th.scope = "col";
            th.appendChild(text);
            tableHeaderRow.appendChild(th);
        })
        
        containerDiv.className = 'container';
        innerContainerDiv.className = "inner-container";
        addItemButton.onclick = this.addItem;
        table.className = "table";
        tableHeaderRow.className = "table-header";
        innerContainerDiv.appendChild(addItemButton);
        table.appendChild(thead);
        table.appendChild(tbody);
        innerContainerDiv.appendChild(table);
        containerDiv.appendChild(innerContainerDiv)
        document.body.appendChild(containerDiv);
    }

    insertRecordRow (record) {
        let table = document.getElementsByTagName("tbody")[0];
        let row = table.insertRow();
        row.id = `row-${record.id}`;
        row.setAttribute("class", "table-row");
        for (let key in record) {
            if(key !== "id"){
              let cell = row.insertCell();
              cell.setAttribute("class", "table-data");
              let text = document.createTextNode(record[key]);
              cell.appendChild(text);
            }
        }
        let actionCell = row.insertCell();
        actionCell.setAttribute("class", "table-data");
        actionCell.id ="actionCell";
        let editButton =  new Button(record.id, null, "edit-btn").renderButton();
        let deleteButton =  new Button(record.id, null, "delete-btn").renderButton();
        deleteButton.onclick = this.deleteItem;
        editButton.onclick = this.editItem;
        let editImg = document.createElement('img');
        editImg.setAttribute("src", "images/edit.png");
        editImg.setAttribute("class", "action-img");
        editImg.id = record.id;
        let deleteImg = document.createElement('img');
        deleteImg.setAttribute("src", "images/delete.png");
        deleteImg.setAttribute("class", "action-img");
        deleteImg.id = record.id;
        editButton.appendChild(editImg);
        deleteButton.appendChild(deleteImg);
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
    }

    async fillTableData () {
        const data = await getData();
        for (let element of data.people) {
            this.insertRecordRow(element)
        }
    }

    async deleteItem (e) {
        e.preventDefault();
        const id = e.target.id
        const overlay = new Overlay("delete");
        const confirmation = await overlay.getConfirmation();
        if(confirmation === "confirmed") {
            deleteData(id);
            document.getElementById(`row-${id}`).remove();
            overlay.closeOverlay(null, "overlay");
        } else if (confirmation === "canceled") {
            overlay.closeOverlay(null, "overlay");
        }
    }

    async editItem (e) {
        const id = e.target.id;
        const data = await getOne(id);
        const overlay = new Overlay("update");
        overlay.loadItem(data);
        await overlay.updateItem();
        const updatedData = overlay.getUpdatedItem();
        overlay.unmountFormMessage();
        const confirmation = await overlay.getConfirmation();
        if(confirmation === "confirmed") {
            await updateData(id, updatedData);
            this.domUpdate(id, updatedData);
            overlay.closeOverlay(null, "overlay");
        } else if (confirmation === "canceled") {
            overlay.closeOverlay(null, "overlay");
        }
    }

    async addItem () {
        const overlay = new Overlay("add");
        const data  = await overlay.postItem();
        overlay.unmountFormMessage();
        const confirmation = await overlay.getConfirmation();
        if(confirmation === "confirmed") {
            const record = await postData(data);

            this.insertRecordRow(record);
            overlay.closeOverlay(null, "overlay");
        } else if (confirmation === "canceled") {
            overlay.closeOverlay(null, "overlay");
        }
    }

    domUpdate (id, data) {
        const row = document.getElementById(`row-${id}`);
        const cells = row.childNodes;
        Array.from(cells).forEach((cell, index) => {
            if(cell.id !== "actionCell"){
                cell.textContent = data[Object.keys(data)[index]]
            }
        })
    }
}
