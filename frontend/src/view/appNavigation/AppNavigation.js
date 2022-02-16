import { appNavigationTemplate } from "./AppNavigation.tpl.js";

export default class AppNavigation extends HTMLElement {

  #nav; // all navigation links

  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(appNavigationTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    try {
      // set event handlers for callbacks
      this.#nav = this.shadowRoot.querySelector("#navigation");
      window.addEventListener("hashchange", this.#updateActiveLink.bind(this));
      //this.#updateActiveLink();
    } catch (err) {
      console.error(err);
    }
  }


  disconnectedCallback() {
    window.removeEventListener("hashchange", this.#updateActiveLink);
  }

  #updateActiveLink() {
    const hashWithoutParams = window.location.hash.split("?")[0];
    const $currentLink = this.#nav.querySelector(".nav-link.active");
    const $targetLink = this.#nav.querySelector(`.nav-link[href*='${hashWithoutParams}'`);

    // remove current active tag, when targetLink is not found. (404-Error page is shown)
    if ($currentLink && !$targetLink) {
      $currentLink.classList.remove("active");
    } else if (!$currentLink || !$targetLink || $currentLink.href === $targetLink.href) {
      // When either targetLink nor currentLink does not exists or if they are the same,
      // then nothing needs to be updated.
      return ;
    }

    // switch active class from current to target link
    $currentLink.classList.remove("active");
    $targetLink.classList.add("active");
  }
}

window.customElements.define("app-navigation", AppNavigation);
