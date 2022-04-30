const assert = chai.assert; // using chaijs as an "comparison" library
import TestHelpers from "../../TestHelpers.js";

// load dependencies to instantiate or mock
import BookAdder from "../../../src/view/bookAdder/BookAdder.js";
import BookController from "../../../src/controller/BookController.js";
import Book from "../../../src/model/Book.js";

describe("<book-adder> is tested", () => {

  before(async function() {
    // stub BookController.addBook() Method
    sinon.createStubInstance(BookController);
    this.addBookMethodStub = sinon.stub(BookController.prototype, "addBook");

    // load iframe to place <book-adder>
    this.iframe = await TestHelpers.loadIframe("http://localhost:8888/test/blank.html");

    // prepare an empty <book-adder> and append it to iframe
    this.bookAdder = new BookAdder();
    this.bookAdder.controller = new BookController();
    this.iframe.contentDocument.body.appendChild(this.bookAdder);
  });

  afterEach(function () {
    // reset call history of stubs
    sinon.resetHistory();
  });

  after(function() {
    this.iframe.remove();
    sinon.restore();
  });

  it("Submit without any values. Expect not to submit form", function() {
    const form = this.bookAdder.shadowRoot.querySelector("#bookAdderForm");
    const submitButton = form.querySelector("input[type='submit']");

    // submit form without data
    submitButton.click();

    assert.isNotOk(form.checkValidity(), "Form validity should be false");
    assert.equal(submitButton.disabled, false, "Button was not disabled, such there was no processing of data");
    assert.isFalse(this.addBookMethodStub.called, "addBook() should not have been called");
  });

  it("Submit valid data set (title, isbn, author and description)", async function() {
    const form = this.bookAdder.shadowRoot.querySelector("#bookAdderForm");

    // set input fields
    const validData = {
      "isbn": "9875641359",
      "title": "This is a cool title",
      "author": "Test Author",
      "description": "Hello book"
    };
    TestHelpers.setInputValues(validData, form);

    // execute form submit
    const submitButton = form.querySelector("input[type='submit']");
    submitButton.click();

    // assert that addBook() was called with "Book" model as parameter
    assert.isTrue(this.addBookMethodStub.calledOnce, "Expect addBook() to have been called once");
    const expectedBook = new Book(validData);
    assert.equal(
      JSON.stringify(this.addBookMethodStub.getCall(0).args[0].bookElement),
      JSON.stringify(expectedBook.bookElement),
      "Expect addBook() to have been called with valid Book() object");
  });

  it("Submit ISBN13, which is not supported by formular", function() {
    const form = this.bookAdder.shadowRoot.querySelector("#bookAdderForm");

    // set input fields
    const validData = {
      "isbn": "978-3-7375-0553-6",
      "title": "This is a cool title",
      "author": "Test Author",
      "description": "Hello book"
    };
    TestHelpers.setInputValues(validData, form);

    // execute form submit
    const submitButton = form.querySelector("input[type='submit']");
    submitButton.click();

    // assert that form is "invalid" and addBook() was not called
    assert.isFalse(form.checkValidity(), "Form should be invalid, after passing ISBN to long");
    assert.isFalse(this.addBookMethodStub.called, "addBook() should not have been called");
  });

  it("Test bookAdder.#controller being read-only property", function() {
    const bookAdder = new BookAdder();
    bookAdder.controller = new BookController();
    assert.throws(() => bookAdder.controller, Error, /read-only property/);
  });

  it("Setting bookAdder.controller twice => TypeError should be thrown", function() {
    const bookAdder = new BookAdder();
    bookAdder.controller = new BookController();
    assert.throws(() => bookAdder.controller = new BookController(), TypeError, /Controller was already set/);
  });

});
