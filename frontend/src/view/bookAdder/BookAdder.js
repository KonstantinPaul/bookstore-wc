import { bookAdderTemplate } from "./BookAdder.tpl.js";
import Book from "../../model/Book.js";

export default class BookAdder extends HTMLElement {

  #form; // <form> element, which is submitted
  #submitButton; // <input type="submit" ... /> which invokes the submitting
  #controller;
  #newBook; // The new book to add via submit event. It is updated via onChange events

  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(bookAdderTemplate.content.cloneNode(true));

    // select form element
    this.#form = this.shadowRoot.getElementById("bookAdderForm");
    this.#submitButton = this.#form.querySelector("input[type='submit']");
    this.#newBook = new Book();
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

    for (const fieldId of ["isbn", "title", "author", "description"]) {
      const field = this.#form.querySelector(`#${fieldId}`);
      field.addEventListener("change", this.#handleInputChanges.bind(this))
    }
  }

  disconnectedCallback() {
    // remove submit event listeners
    this.#form.removeEventListener("submit", this.#handleFormSubmit);
    this.#submitButton.removeEventListener("click", this.#handleFormSubmit);

    // remove onChange event handlers on fields
    for (const fieldId of ["isbn", "title", "author", "description"]) {
      const field = this.#form.querySelector(`#${fieldId}`);
      field.removeEventListener("change", this.#handleInputChanges.bind(this))
    }
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

    // add book via controller
    try {
      this.#controller.addBook(this.#newBook);
    } catch (addingError) {
      // mark ISBN field as invalid, because of duplicate ISBN error
      const isbnField = this.#form.querySelector("#isbn");
      isbnField.setCustomValidity(addingError.message);
      isbnField.reportValidity();
      
      // ISBN-Duplicate error is currently the only error (Stand: 2021-01-21)
      // TODO: Further error processing??
    }

    // enalbe submit button again after error was thrown
    this.#submitButton.disabled = false;
  }

  #handleInputChanges(changeEvent) {
    const field = changeEvent.target;

    // reset custom errors
    if (field.validity.customError) {
      field.setCustomValidity("");
    }

    // update book with changed values
    const bookProperties = ["isbn", "title", "author", "description"];
    if (bookProperties.includes(field.id)) {
      this.#newBook[field.id] = field.value;
    }
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
