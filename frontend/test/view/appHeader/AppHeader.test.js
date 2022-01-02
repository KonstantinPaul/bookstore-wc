const assert = chai.assert; // using chaijs as an "comparison" library
import AppHeader from "../../../src/view/appHeader/AppHeader.js";
import TestHelpers from "../../TestHelpers.js";

describe("<app-header> is tested", () => {

  before(async function() {
    this.iframe = await TestHelpers.loadIframe("http://localhost:8888/index.html");
    this.appHeader = this.iframe.contentDocument.querySelector("app-header");
  });

  after(function() {
    this.iframe.remove();
  });

  it("Check 'light theme' state (default state)", function() {
    // create an AppHeader component
    const themeLabel = this.appHeader.shadowRoot.querySelector("#themeLabel");
    const themeSwitch = this.appHeader.shadowRoot.querySelector("#themeSwitch");

    // check label to be default text and theme switch not being selected
    assert.equal(themeLabel.textContent, "Switch to Dark Theme");
    assert.equal(themeSwitch.checked, false);
  });

  it("Check 'dark theme' state", function() {
    // extract theme switch and switch it
    const themeLabel = this.appHeader.shadowRoot.querySelector("#themeLabel");
    const themeSwitch = this.appHeader.shadowRoot.querySelector("#themeSwitch");

    // click label to switch theme
    themeSwitch.click();

    assert.equal(themeLabel.textContent, "Switch to Light Theme");
    assert.equal(themeSwitch.checked, true);
  });

});
