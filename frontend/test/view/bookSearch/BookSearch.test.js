const assert = chai.assert; // using chaijs as an "comparison" library
import TestHelpers from "../../TestHelpers.js";

// load dependencies to instantiate or mock
import BookSearch from "../../../src/view/bookSearch/BookSearch.js";
import BookController from "../../../src/controller/BookController.js";

describe("<book-search> is tested", () => {

  before(async function() {
    // stub BookController.searchBook(searchObject) method
    sinon.createStubInstance(BookController);
    this.searchBookStub = sinon.stub(BookController.prototype, "searchBook");

    // load iframe to place <book-adder>
    this.iframe = await TestHelpers.loadIframe("http://localhost:8888/test/blank.html");

    // prepare an empty <book-adder> and append it to iframe
    this.bookSearch = new BookSearch();
    this.bookSearch.controller = new BookController();
    this.iframe.contentDocument.body.appendChild(this.bookSearch);
  });

  afterEach(function() {
    // reset call history of stubs
    sinon.resetHistory();
    // reset book search form to default values
    this.bookSearch.shadowRoot.querySelector("#bookSearchForm").reset();
  });

  after(function() {
    this.iframe.remove();
    sinon.restore();
  });

  it("Check default values for search form", function() {
    const form = this.bookSearch.shadowRoot.querySelector("#bookSearchForm");
    const searchValueInput = form.querySelector("#searchValue");
    const currentSelectedOption = form.querySelector("#searchKey option[selected]");

    // assert default values
    assert.equal(searchValueInput.value, "", "Search value is empty per default");
    assert.equal(currentSelectedOption.value, "title", "Search key is per default title");
    assert.isFalse(form.checkValidity(), "Form validity should be false, because no search value was given per default");
  });

  it("Submit search with default values. Expect not to submit form, because search value is not valid", function() {
    const form = this.bookSearch.shadowRoot.querySelector("#bookSearchForm");
    const searchButton = form.querySelector("#searchButton");

    // submit form without data
    searchButton.click();

    assert.isFalse(form.checkValidity(), "Form validity should be false, because no search value was given");
    assert.isFalse(searchButton.disabled, "Search button was not disabled, such there was no processing of data");
    assert.isFalse(this.searchBookStub.called, "searchBook() should not have been called");
  });

  it("Submit valid search key = 'author' with search value = 'Hello World'", async function() {
    const form = this.bookSearch.shadowRoot.querySelector("#bookSearchForm");
    const searchButton = form.querySelector("#searchButton");

    // set search value to "Hello World"
    const searchValueInput = form.querySelector("#searchValue");
    searchValueInput.value = "Hello World";

    // set search key to "author"
    const searchKeySelect = form.querySelector("#searchKey");
    searchKeySelect.value = "author";

    // execute search
    searchButton.click();

    // assert that searchBook() was called with correct object
    assert.isTrue(this.searchBookStub.calledOnce, "Expect addBook() to have been called once");
    assert.deepEqual(
      this.searchBookStub.getCall(0).args[0], {"author": "Hello World"},
      "Expect searchBook() call with right search object"
    );
  });

  it("Reset search form", function() {
    const form = this.bookSearch.shadowRoot.querySelector("#bookSearchForm");
    const resetButton = form.querySelector("#resetButton");

    // reset form back to default state
    resetButton.click();

    // assert that controller.searchBook() was executed with empty/undefined search
    assert.isTrue(this.searchBookStub.calledOnce, "Expect addBook() to have been called once");
    assert.deepEqual(
      this.searchBookStub.getCall(0).args[0],
      undefined,
      "Expect searchBook() call with undefined or empty search object"
    );

    // assert that form was reset to default values
    const searchValue = form.querySelector("#searchValue").value;
    const searchKey = form.querySelector("#searchKey").value;
    assert.equal(searchValue, "", "Search value is empty per default");
    assert.equal(searchKey, "title", "Search key is per default title");
  });

  it("Set search key and value over <book-search> attributes", async function() {
    const form = this.bookSearch.shadowRoot.querySelector("#bookSearchForm");

    // assert that search value is was set
    const validSearchValue = "An arbitrary search value";
    this.bookSearch.setAttribute("search-value", validSearchValue);

    const searchField = form.querySelector("#searchValue");
    assert.equal(searchField.value, validSearchValue, "Search value was set via attribute changed callback");

    const keyTests = ["author", "title", "isbn", "description", "notFound"];
    for (const searchKey of keyTests) {
      this.bookSearch.setAttribute("search-key", searchKey);
      if (searchKey === "notFound") {
        // In this case the second to last value from keyTests should be still selected,
        // because "notFound" is not a valid key
        assert.equal(form.querySelector("#searchKey").value, "title", "Search key updates to 'title' (default), when invalid");
      } else {
        // normal searches 
        assert.equal(form.querySelector("#searchKey").value, searchKey, "Search key should be selected");
      }
    }
  });

  it("Test bookSearch.controller being read-only property", function() {
    const bookSearch = new BookSearch();
    bookSearch.controller = new BookController();
    assert.throws(() => bookSearch.controller, Error, /read-only property/);
  });

  it("Setting bookSearch.controller twice => TypeError should be thrown", function() {
    const bookSearch = new BookSearch();
    bookSearch.controller = new BookController();
    // try to set controller again. Expect to throw TypeError
    assert.throws(() => bookSearch.controller = new BookController(), TypeError, /Controller was already set/);
  });
});
