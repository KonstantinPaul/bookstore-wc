import { tableTemplate, tableRowTemplate } from "./BookList.tpl.js";

// This is imported, because it is a subcomponent in <book-list>
import BookSearch from "../bookSearch/BookSearch.js";

export default class BookList extends HTMLElement {

  #controller;
  #tableBody; // this is the tbody, where "book" rows are added
  #books; // this is the new list of books

  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(tableTemplate.content.cloneNode(true));

    // select table and inner tbody element for specified DOM access
    this.#tableBody = this.shadowRoot.querySelector("#bookListTable > tbody");
  }

  // one-way setter for controller
  set controller(newController) {
    if (!!this.#controller) {
      throw new TypeError("BookAdder: Controller was already set");
    }
    this.#controller = newController;
  }

  get controller() {
    throw new Error("BookList: Controller is a read-only property");
  }

  set books(newBookList) {
    // add books to tbody as table rows
    this.#books = newBookList;

    // remove all tr from tbody
    for (const row of this.#tableBody.querySelectorAll("tr")) {
      row.remove();
    }
    
    // add books as rows to tbody
    for (const newBook of this.#books) {
      this.#addBook(newBook);
    }

    this.#updateBookCounter();
  }

  // TODO: Evlt. Remove or transform it to "read-only" property
  get books() {
    return this.#books;
  }

  connectedCallback() {

  }

  disconnectedCallback() {
    // remove event listeners from all delete buttons
    const allDeleteButtons = this.#tableBody.querySelectorAll("tr #deleteButton");
    for (const deleteButton of allDeleteButtons) {
      deleteButton.removeEventListener("click", this.#deleteBook);
    }
  }


  /** PRIVATE methods for processing **/

  /* This method adding a new table row
   * 
   * @param newBook (type object): {
   *  "title": "new title",
   *  "isbn": "isbn ...",
   *  "author": "author"
   * }
   */
  #addBook(newBook) {
    const isbn = newBook.isbn || "";

    const row = tableRowTemplate.content.cloneNode(true).querySelector("tr");
    row.setAttribute("data-isbn", isbn);

    // set title, author and ISBN as table data
    const tdIds = ["title", "author", "isbn"];
    for (const tdId of tdIds) {
      const td = row.querySelector(`#${tdId}`);
      td.textContent = newBook[tdId];
    }

    // append isbn to detail link
    const detailLink = row.querySelector("#detailLink");
    detailLink.href += isbn;

    // set isbn to reference book to delete
    const deleteButton = row.querySelector("#deleteButton");
    deleteButton.addEventListener("click", this.#deleteBook.bind(this, isbn));

    // append row to tbody
    this.#tableBody.appendChild(row);
  }

  #updateBookCounter() {
    const rowCount = this.#tableBody.rows.length;
    this.shadowRoot.querySelector("#bookCount").textContent = rowCount;
  }

  /**
   * This function is an event handler for the delete button 
   *
   * @param isbn: ISBN to search book and delete
   * @param clickEvent: This is the clickEvent to extract the button (trigger element) from 
   */
  async #deleteBook(isbn, clickEvent) {
    // select book row and delete it
    const rowToDelete = this.#tableBody.querySelector(`tr[data-isbn="${isbn}"]`);
    const deleteButton = clickEvent.target;
    deleteButton.disabled = true;
    rowToDelete.classList.add("in-deletion");

    // delete book from storage
    try {
      this.#controller.deleteBook(isbn);

      // start row deletion animation
      rowToDelete.classList.add("animate-moveright");
      rowToDelete.addEventListener("animationend", () => {
        // remove row and update book counter
        rowToDelete.remove();
        this.#updateBookCounter();
      });
    } catch (deletionError) {
      // reset table row on error
      deleteButton.disabled = false;
      rowToDelete.classList.remove("in-deletion");
    }
  }
}


window.customElements.define("book-list", BookList);
