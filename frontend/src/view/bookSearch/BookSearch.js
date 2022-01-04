import {
  bookSearchTemplate
} from "./BookSearch.tpl.js";

export default class BookSearch extends HTMLElement {

  #form; // <form id="bookSearchForm"> element, which is submitted
  #searchButton; // <input id="searchButton" .../> which invokes the submitting
  #resetButton; // <input id="resetButton" .../> which invokes the submitting
  #controller;

  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({
      mode: "open"
    });
    this.shadowRoot.appendChild(bookSearchTemplate.content.cloneNode(true));

    // get search form, search and reset button
    this.#form = this.shadowRoot.getElementById("bookSearchForm");
    this.#searchButton = this.#form.querySelector("#searchButton");
    this.#resetButton = this.#form.querySelector("#resetButton");
  }

  connectedCallback() {
    // add search button and reset button events
    this.#searchButton.addEventListener("click", this.#handleSearch.bind(this));
    this.#resetButton.addEventListener("click", this.#handleSearchReset.bind(this));
  }

  disconnectedCallback() {
    // remove search button and reset button events
    this.#searchButton.removeEventListener("click", this.#handleSearch);
    this.#resetButton.removeEventListener("click", this.#handleSearchReset);
  }

  // one-way setter for controller to process form submit
  set controller(newController) {
    if (!!this.#controller) {
      throw new TypeError("BookSearch: Controller was already set");
    }

    this.#controller = newController;
  }

  get controller() {
    throw new Error("BookSearch: Controller is a read-only property");
  }

  // return attributes to "observe", they trigger attributeChangedCallback(), when changed
  static get observedAttributes() {
    return ["search-value", "search-key"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    // prevent updates, when no values have changed
    if (oldValue === newValue) {
      return;
    }

    // set values for "searchValue" and "searchKey" fields
    if (attrName === "search-value") {
      const searchValue = this.#form.querySelector("#searchValue");
      searchValue.value = newValue;
    } else if (attrName === "search-key") {
      const validKeys = ["title", "author", "isbn", "description"];
      const searchKey = this.#form.querySelector("#searchKey");

      // check if key is valid
      if (validKeys.includes(newValue)) {
        searchKey.value = newValue;
      } else {
        // reset back to default key: "title"
        searchKey.value = "title";
      }
    }
  }


  /** PRIVATE methods for handle search and reset **/

  #handleSearchReset() {
    // trigger an empty search
    this.#controller.searchBook();

    // reset form elements back to initial state
    this.#form.reset();
  }

  #handleSearch(event) {
    if (!this.#controller) {
      throw new Error("BookSearch: Controller was not set for form processing");
    }

    if (!this.#form.checkValidity()) {
      return;
    }

    // disable buttons and prevent form from submitting
    this.#searchButton.disabled = true;
    this.#resetButton.disabled = true;
    event.preventDefault();

    // build search object with key and value
    const searchValue = this.#form.querySelector("#searchValue").value;
    const searchKey = this.#form.querySelector("#searchKey").value;
    const searchObject = {};
    searchObject[searchKey] = searchValue;

    // searchBook() via BookController, which triggers a hashchange even to search for a book
    this.#controller.searchBook(searchObject);

    // enable buttons after search again
    this.#searchButton.disabled = false;
    this.#resetButton.disabled = false;
  }
}


window.customElements.define("book-search", BookSearch);
