import { messageBoxTemplate } from "./MessageBox.tpl.js";

export default class MessageBox extends HTMLElement {
  #closeButton; // trigger to remove the message element from page
  #messageText; // element, where to place the message text
  #titleText; // Title (=type) for message
  #messageBox; // wrapper element, where "animation" is put on via CSS class

  constructor() {
    super();

    // when shadow mode is "open", then this.shadowRoot is not null and can be set
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(messageBoxTemplate.content.cloneNode(true));

    // select all needed elements from shadowRoot
    this.#closeButton = this.shadowRoot.querySelector("#closeButton");
    this.#messageText = this.shadowRoot.querySelector("#messageText");
    this.#titleText = this.shadowRoot.querySelector("#titleText");
    this.#messageBox = this.shadowRoot.querySelector("#messageBox");
  }

  connectedCallback() {
    this.#closeButton.addEventListener("click", this.#startCloseAnimation.bind(this));
    this.#messageBox.addEventListener("animationend", this.#endCloseAnimation.bind(this));

    // remove <message-box> automatically after waiting some seconds
    const secondsToWait = 10;
    setTimeout(() => { 
      this.#startCloseAnimation();
    }, (secondsToWait * 1000));
  }

  disconnectedCallback() {
    this.#closeButton.removeEventListener("click", this.#startCloseAnimation);
    this.#messageBox.removeEventListener("animationend", this.#endCloseAnimation);
  }

  // return attributes to "observe", they trigger attributeChangedCallback(), when changed
  static get observedAttributes() {
    return ["message", "type"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case "type":
        // set new title text with "type" value
        this.#titleText.textContent = newValue;
        break;
      case "message":
        this.#messageText.textContent = newValue;
        break;
    }
  }

  #startCloseAnimation() {
    // add CSS animation class to messageBox to trigger CSS animation
    this.#messageBox.classList.add("animate-moveright");
  }

  #endCloseAnimation() {
    // remove <message-box> element after animation was finished
    this.remove();
  }
}

window.customElements.define("message-box", MessageBox);
