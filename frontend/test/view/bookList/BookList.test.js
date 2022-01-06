const assert = chai.assert; // using chaijs as an "comparison" library
import sinon from "../../../node_modules/sinon/pkg/sinon-esm.js";
import TestHelpers from "../../TestHelpers.js";

// load dependencies to instantiate or mock
import BookList from "../../../src/view/bookList/BookList.js";
import BookController from "../../../src/controller/BookController.js";
import {
  sampleBookPreviewList
} from "../../_resources/bookData.data.js";

describe("<book-list> is tested", () => {

  before(async function() {
    // load iframe to place <book-adder>
    this.iframe = await TestHelpers.loadIframe("http://localhost:8888/test/blank.html");
  });

  beforeEach(function() {
    // stub deleteBook(isbn) method from BookController
    sinon.createStubInstance(BookController);

    // init new book list and append data to it, because 3 of 4 test cases needs to have book data being set
    const newBookList = new BookList();
    newBookList.controller = new BookController();
    newBookList.books = sampleBookPreviewList;
    
    // append or iframe or replace current one
    if (!this.iframe.contentDocument.querySelector("book-list")) {
      this.iframe.contentDocument.body.appendChild(newBookList);
    } else {
      this.iframe.contentDocument.querySelector("book-list").replaceWith(newBookList);
    }

    this.bookList = newBookList;
  });

  afterEach(function() {
    /* restore() complete stub, 
    *  this is necessary if individual tests want to re-define it another way.
    *  for e.g. throwing Errors instead off doing nothing (default behavior) */
    sinon.restore();
  });

  after(function() {
    this.iframe.remove();
  });

  it("Check default values for empty book list / book table", function() {
    // replace books with test data with empty book list
    const defaultBookList = new BookList();
    this.iframe.contentDocument.querySelector("book-list").replaceWith(defaultBookList);

    // extract counter and 
    const bookCountElem = defaultBookList.shadowRoot.querySelector("#bookCount");
    const bookCountInt = parseInt(bookCountElem.textContent, 10);

    const bookTable = defaultBookList.shadowRoot.querySelector("#bookListTable");
    const thContentList = Array.from(bookTable.querySelectorAll("thead th")).map(item => item.textContent);

    // assert book count = 0 and table headers in row
    assert.equal(bookCountInt, 0, "In an empty list are no books");
    assert.sameOrderedMembers(thContentList, ["Title", "Author", "ISBN", "Detail", "Delete"], "Expect table headers to be in same order");
  });

  it("Should add 11 books in correct order", function() {
    // extract book counter and first book row from table
    const bookCountElem = this.bookList.shadowRoot.querySelector("#bookCount");
    const bookCountInt = parseInt(bookCountElem.textContent, 10);
    const firstBookRow = this.bookList.shadowRoot.querySelector("#bookListTable tbody tr:first-child");
    const firstBookRowCellData = Array.from(firstBookRow.querySelectorAll("td")).map(item => item.textContent);

    // assert that book counter was updated successfully 
    assert.equal(
      bookCountInt,
      sampleBookPreviewList.length,
      `Counter should be updated to ${sampleBookPreviewList.length} books`
    );

    // assert that first row has title, author and isbn set in the correct order
    assert.equal(sampleBookPreviewList[0].title, firstBookRowCellData[0], "Title should come in first cell");
    assert.equal(sampleBookPreviewList[0].author, firstBookRowCellData[1], "Author should be in second cell");
    assert.equal(sampleBookPreviewList[0].isbn, firstBookRowCellData[2], "Author should be in third cell");
    assert.equal(sampleBookPreviewList[0].isbn, firstBookRow.dataset.isbn, "ISBN should be set on row as data attribute for identifying book");
  });

  it("Should remove book from table", async function() {
    const deleteBookStub = sinon.stub(BookController.prototype, "deleteBook");

    // select row to delete and ISBN to verify deletion was complete
    const bookListTable = this.bookList.shadowRoot.querySelector("#bookListTable");
    const bookRowToDelete = bookListTable.querySelector("tbody tr:nth-child(3)");
    const isbnToDelete = bookRowToDelete.dataset.isbn;

    // Invoke deletion by clicking delete button. 
    // Additionally wait for 1s, because animation runs for 900ms (see: /src/view/bookList/bookList.css)
    const deleteButton = bookRowToDelete.querySelector("#deleteButton");
    deleteButton.click();
    await TestHelpers.delay(1000);

    // assert that table row was deleted
    const bookCountInt = parseInt(this.bookList.shadowRoot.querySelector("#bookCount").textContent, 10);
    assert.equal(
      bookCountInt, (sampleBookPreviewList.length - 1),
      "Book Counter should be one lesser, then count of sample data, because only one book row was deleted"
    );

    // assert that deleteBook() was called
    assert.isTrue(deleteBookStub.calledOnce, "Expect deleteBook() on BookController to be called");
    assert.equal(isbnToDelete, deleteBookStub.getCall(0).args[0], "ISBN was a parameter for deleteBook(isbn)");

    // assert that row was deleted
    assert.isNull(bookListTable.querySelector(`tbody tr[data-isbn='${isbnToDelete}']`), "Table row should be deleted from DOM (after animation)");
  });

  it("Should throw error while deleting book", async function() {
    // provoke Error from Controller, when deleting a book
    const deleteBookErrorStub = sinon.stub(BookController.prototype, "deleteBook").callsFake(() => { throw new Error("") });

    // isbn to remove
    const bookListTable = this.bookList.shadowRoot.querySelector("#bookListTable");
    const bookRowToDelete = bookListTable.querySelector("tbody tr:nth-child(3)");
    const isbnToDelete = bookRowToDelete.dataset.isbn;

    // Invoke deletion by clicking delete button. 
    // Additionally wait for 1s, because animation runs for 900ms (see: /src/view/bookList/bookList.css)
    const deleteButton = bookRowToDelete.querySelector("#deleteButton");
    deleteButton.click();
    await TestHelpers.delay(1000);

    // assert that table row was NOT deleted
    const bookCountInt = parseInt(this.bookList.shadowRoot.querySelector("#bookCount").textContent, 10);
    assert.equal(bookCountInt, sampleBookPreviewList.length, "Book Counter should be unchanged, because error was thrown");
    assert.isNotNull(bookListTable.querySelector(`tbody tr[data-isbn='${isbnToDelete}']`), "Table row should be deleted from DOM (after animation)");
    assert.isFalse(deleteButton.disabled, "Button should be enabled again");
    assert.isFalse(bookRowToDelete.classList.contains("in-deletion"), "CSS class 'in-deletion' for indicating an runnig removal should be removed");
  });

});
