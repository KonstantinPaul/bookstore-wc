import { tableTemplate, tableRowTemplate } from "./BookList.tpl.js";

// This is imported, because it is a subcomponent in <book-list>
import BookSearch from "../bookSearch/BookSearch.js";

export default class BookList extends HTMLElement {

  #controller;
  #table; // this is the table element, where the books are stored
  #tableBody; // this is the tbody, where "book" rows are added
  #bookSearch; // This is the custom element <book-search>
  #books; // this is the new list of books

  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(tableTemplate.content.cloneNode(true));

    // set event handlers for callbacks
    this.#table = this.shadowRoot.getElementById("bookListTable");
    this.#table.addEventListener("click", this.#evaluateTableClick.bind(this));

    this.#tableBody = this.#table.querySelector("tbody");
    this.#bookSearch = new BookSearch();
  }

  // one-way setter for controller
  set controller(newController) {
    if (!!this.#controller) {
      throw new TypeError("BookAdder: Controller was already set");
    }
    this.#controller = newController;

    // set controller for bookSearch as well
    this.#bookSearch.controller = newController;
  }

  get controller() {
    throw new Error("BookList: Controller is a read-only property");
  }

  get bookSearch() {
    return this.#bookSearch;
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
    const bookSearch = this.shadowRoot.querySelector("book-search");
    bookSearch.replaceWith(this.#bookSearch);
  }

  disconnectedCallback() {
    this.#table.removeEventListener("click", this.#evaluateTableClick);
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
    deleteButton.dataset.isbn = isbn;

    // append row to tbody
    this.#tableBody.appendChild(row);
  }

  #updateBookCounter() {
    const rowCount = this.#tableBody.rows.length;
    this.shadowRoot.querySelector("#bookCount").textContent = rowCount;
  }

  #evaluateTableClick(clickEvent) {
    if (!this.#controller) {
      throw new Error("BookList: Controller was not set for processing");
    }

    const { target } = clickEvent;

    // evaluate delete button 
    const isDeleteButton = (target.type === "button" && target.id === "deleteButton");
    if (isDeleteButton) {
      // remove book by ISBN
      const { isbn } = target.dataset;
      this.#deleteBook(isbn, target);
    }
  }

  async #deleteBook(isbn, deleteButton) {
    try {
      // select book row and delete it
      const rowToDelete = this.shadowRoot.querySelector(`tr[data-isbn="${isbn}"]`);
      deleteButton.disabled = true;
      rowToDelete.classList.add("in-deletion");

      // delete book from storage
      try {
        this.#controller.deleteBook(isbn);

        // start row deletion animation
        rowToDelete.classList.add("delete-animation", "animate-moveright");
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
    } catch (err) {
      console.error(err);
    }
  }
}


window.customElements.define("book-list", BookList);
