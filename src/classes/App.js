import { Table } from './Table.js';

export class App {
  constructor() {
    this.init()
  }

  init () {
    const table = new Table;
    table.renderTable();
  }
}

