import {
  bookDetailTemplate
} from "./BookDetail.tpl.js";

export default class BookDetail extends HTMLElement {
  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({
      mode: "open"
    });
    this.shadowRoot.appendChild(bookDetailTemplate.content.cloneNode(true));
  }

  connectedCallback() {}

  // return attributes to "observe", they trigger attributeChangedCallback(), when changed
  static get observedAttributes() {
    return ["title", "author", "isbn", "description"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    const element = this.shadowRoot.getElementById(attrName);
    // set simple data (beware: objects or other complex stuff will not work that easily)
    element.textContent = newValue;
  }
}


window.customElements.define("book-detail", BookDetail);
