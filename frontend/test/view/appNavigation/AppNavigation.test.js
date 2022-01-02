const assert = chai.assert; // using chaijs as an "comparison" library
import TestHelpers from "../../TestHelpers.js";
import AppNavigation from "../../../src/view/appNavigation/AppNavigation.js";

describe("<app-navigation> is tested", () => {

  before(async function() {
    this.iframe = await TestHelpers.loadIframe("http://localhost:8888/index.html");
    const appNavigation = this.iframe.contentDocument.querySelector("app-navigation");

    this.location = this.iframe.contentWindow.location;
    this.navigation = appNavigation.shadowRoot.querySelector("#navigation");
  });

  after(function() {
    this.iframe.remove();
  });

  it("Book List should be active by default", function() {
    const expectedHash = "#/book/list";

    // retrieve href from "active" link
    const activeURL = new URL(this.navigation.querySelector(".active").href);

    assert.equal(activeURL.hash, expectedHash);
    assert.equal(this.location.hash, expectedHash);
  });

  it("Click in order: list -> 'Add Book' -> list (back again)", async function() {
    const listLink = this.navigation.querySelector(`.nav-link[href="#/book/list"]`);
    const addBookLink = this.navigation.querySelector(`.nav-link[href="#/book/add"]`);

    listLink.click();
    await TestHelpers.delay(5);
    addBookLink.click();
    await TestHelpers.delay(5);

    // assert that "active" class is moved to "add book"-link
    assert.equal(listLink.classList.contains("active"), false);
    assert.equal(addBookLink.classList.contains("active"), true);

    // go back got list again
    listLink.click();
    await TestHelpers.delay(5);

    // check that "list" is active again
    assert.equal(listLink.classList.contains("active"), true);
    assert.equal(addBookLink.classList.contains("active"), false);
  });

  it("Click in order: list -> detail -> list (back again)", async function() {
    const listLink = this.navigation.querySelector(`.nav-link[href="#/book/list"]`);
    const detailLink = this.navigation.querySelector("#book-details-link");

    listLink.click();
    await TestHelpers.delay(5);

    detailLink.click();
    await TestHelpers.delay(5);

    // check that listLink is still active and detailLink is still inactive
    // AFTER detailLink was clicked() respectively, "tried to click"
    assert.equal(listLink.classList.contains("active"), true, "list link is still active");
    assert.equal(detailLink.classList.contains("active"), false, "detail link is still active");
    assert.equal(detailLink.classList.contains("disabled"), true, "disabled class was not contained");

    // go back to list again
    listLink.click();
    await TestHelpers.delay(5);

    // check that listLink is still active and detailLink is still inactive
    assert.equal(listLink.classList.contains("active"), true, "list link is still active");
    assert.equal(detailLink.classList.contains("active"), false, "detail link is still active");
    assert.equal(detailLink.classList.contains("disabled"), true, "disabled class was not contained");
  });

  it.skip("Navigate to Error Page", async function() {
    //TODO: What should happen with navigation, when 404-page is shown?

  });


  //TODO: Think about good other scenarios to test?

});
