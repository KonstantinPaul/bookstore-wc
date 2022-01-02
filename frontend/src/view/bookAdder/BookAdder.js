import { bookAdderTemplate } from "./BookAdder.tpl.js";
import Book from "../../model/Book.js";

export default class BookAdder extends HTMLElement {

  #form; // <form> element, which is submitted
  #submitButton; // <input type="submit" ... /> which invokes the submitting
  #controller;

  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(bookAdderTemplate.content.cloneNode(true));

    // select form element
    this.#form = this.shadowRoot.getElementById("bookAdderForm");
    this.#submitButton = this.#form.querySelector("input[type='submit']");
  }

  // one-way setter for controller to process form submit
  set controller(newController) {
    if (!!this.#controller) {
      throw new TypeError("BookAdder: Controller was already set");
    }
    
    this.#controller = newController;
  }

  get controller() {
    throw new Error("BookAdder: Controller is a read-only property");
  }

  connectedCallback() {
    // add submit event listener
    this.#form.addEventListener("submit", this.#handleFormSubmit.bind(this));
    this.#submitButton.addEventListener("click", this.#handleFormSubmit.bind(this));
  }

  disconnectedCallback() {
    // remove submit event listeners
    this.#form.removeEventListener("submit", this.#handleFormSubmit);
    this.#submitButton.removeEventListener("click", this.#handleFormSubmit);
  }

  #handleFormSubmit(event) {
    if (!this.#controller) {
      throw new Error("BookAdder: Controller was not set for form processing");
    }
    
    if (!this.#form.checkValidity()) {
      return ;
    }

    // disable button and prevent form from submitting
    this.#submitButton.disabled = true;
    event.preventDefault();

    // run through form elements and set book values
    const newBook = new Book();
    const fieldNames = ["isbn", "title", "author", "description"];
    for (const fieldName of fieldNames) {
      const field = this.#form.querySelector(`#${fieldName}`);
      newBook[fieldName] = field.value;
    }

    // add book via controller
    try {
      this.#controller.addBook(newBook);
    } catch (addingError) {
      // TODO: Further error processing??
    }

    // enalbe submit button again after error was thrown
    this.#submitButton.disabled = false;
  }

  /*
   * Foreshadowing, when you want to implement: "change book"-feature
   *
   * Attributes are not needed for the "book-adder"
  static get observerdAttributes() {
    // return attributes to "observe", they trigger attributeChangedCallback(), when changed
    return ["id"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    console.info({attrName, oldValue, newValue});
  }
  */
}


window.customElements.define("book-adder", BookAdder);
