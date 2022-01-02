import { appHeaderTemplate } from "./AppHeader.tpl.js";

export default class AppHeader extends HTMLElement {
  #lightThemeLink = new URL("./assets/css/lightTheme.css", location);
  #lightThemeText = "Switch to Light Theme";

  #darkThemeLink = new URL("./assets/css/darkTheme.css", location);
  #darkThemeText = "Switch to Dark Theme";

  #themeCSSLink; // This is the <link id="theme"> element in main document 
  #themeSwitch; // Checkbox for theme switching
  #themeLabel; // Theme label for indicating which theme is active

  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(appHeaderTemplate.content.cloneNode(true));

    // select label and checkbox element for later usage
    this.#themeSwitch = this.shadowRoot.querySelector("#themeSwitch");
    this.#themeLabel = this.shadowRoot.querySelector("#themeLabel");
    this.#themeLabel.textContent = this.#darkThemeText;
    this.#themeCSSLink = document.head.querySelector("#theme");
  }

  connectedCallback() {
    // set event handlers for callbacks
    this.#themeSwitch.addEventListener("click", this.#toggleTheme.bind(this));
  }

  disconnectedCallback() {
    this.#themeSwitch.removeEventListener("click", this.#toggleTheme);
  }

  #toggleTheme() {
    // switch theme link and label
    if (this.#themeCSSLink.href === this.#lightThemeLink.href) {
      this.#themeCSSLink.href = this.#darkThemeLink;
      this.#themeLabel.textContent = this.#lightThemeText; 
    } else {
      this.#themeCSSLink.href = this.#lightThemeLink;
      this.#themeLabel.textContent = this.#darkThemeText; 
    }
  }
}

window.customElements.define("app-header", AppHeader);
