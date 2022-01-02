import { appNavigationTemplate } from "./AppNavigation.tpl.js";

export default class AppNavigation extends HTMLElement {

  #nav; // all navigation links

  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(appNavigationTemplate.content.cloneNode(true));

    // set event handlers for callbacks
    this.#nav = this.shadowRoot.querySelector("#navigation");
    window.addEventListener("hashchange", this.#updateActiveLink.bind(this));
  }

  connectedCallback() {
    this.#updateActiveLink();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.#updateActiveLink);
  }

  #updateActiveLink() {
    const hashWithoutParams = window.location.hash.split("?")[0];
    const $currentLink = this.#nav.querySelector(".nav-link.active");
    const $targetLink = this.#nav.querySelector(`.nav-link[href*='${hashWithoutParams}'`);

    // Nothing needs to be updated, 
    // when targetLink either does not exists or is the same as current.
    if (!$currentLink || !$targetLink || $currentLink.href === $targetLink.href) {
      return ;
    }

    // switch active class from current to target link
    $currentLink.classList.remove("active");
    $targetLink.classList.add("active");
  }
}

window.customElements.define("app-navigation", AppNavigation);
