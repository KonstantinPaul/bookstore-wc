const assert = chai.assert; // using chaijs as an "comparison" library
import sinon from "../../node_modules/sinon/pkg/sinon-esm.js";
import TestHelpers from "../TestHelpers.js";

// dependency to instantiate
import BookController from "../../src/controller/BookController.js";
// classes to mock
import BookStore from "../../src/model/BookStore.js"
import BookAdapter from "../../src/controller/BookAdapter.js";
import MessageBox from "../../src/view/messageBox/MessageBox.js";

describe("Test BookController", function() {
  beforeEach(function() {
    // stub BookStore
    sinon.createStubInstance(BookStore);

    // stub MessageBox
    sinon.createStubInstance(MessageBox);
    this.messageBoxSetAttributeStub = sinon.stub(MessageBox.prototype, "setAttribute");

    // stub BookAdapter (static methods)
    sinon.stub(BookAdapter, "transformBookList");
    sinon.stub(BookAdapter, "transformBookDetails");

    const getElementByIdStub = sinon.stub(document, "getElementById");
    getElementByIdStub.withArgs("viewSpace").returns(document.createElement("div"));
    getElementByIdStub.withArgs("messageSpace").returns(document.createElement("div"));

    // reset window.location.hash
    window.location.hash = "";
  });

  afterEach(function() {
    sinon.restore();
  });

  describe("renderListView(searchParams)", function() {
    it("should be called with valid search params", function() {
      const getBooksStub = sinon.stub(BookStore.prototype, "getBooks");

      // try to get books() without params (at first)
      (new BookController()).renderListView();

      // assert BookStore.getBooks()
      const emptySearch = {
        "searchKey": undefined,
        "searchValue": ""
      };
      assert.deepEqual(getBooksStub.firstCall.args[0], emptySearch, "Expect to forward empty search into BookStore.getBooks()");

      // assert that BookAdapter.transformBookList was called
      assert.isTrue(BookAdapter.transformBookList.calledOnce, "expect that BookAdapter.transformBookList() was called");
    });

    it("should be called with invalid search params (not found key on Book model)", function() {
      const preparedError = new Error("search was invalid");
      const getBooksStub = sinon.stub(BookStore.prototype, "getBooks").throws(() => preparedError);

      // try to get books() without params (at first)
      const urlSearchParams = new URLSearchParams({"notFoundMethod": "some value"});
      (new BookController()).renderListView(urlSearchParams);

      // assert BookStore.getBooks() was called with invalidSearch
      const invalidSearch = {
        "searchKey": "notFoundMethod",
        "searchValue": "some value"
      };
      assert.deepEqual(getBooksStub.firstCall.args[0], invalidSearch, "Expect to forward empty search into BookStore.getBooks()");
      assert.isFalse(BookAdapter.transformBookList.called, "expect that BookAdapter.transformBookList() was not called");

      // assert that type and message of message box where set correctly
      assert.isTrue(this.messageBoxSetAttributeStub.calledTwice);
      assert.deepEqual(this.messageBoxSetAttributeStub.firstCall.args, ["type", "error"]);
      assert.deepEqual(this.messageBoxSetAttributeStub.secondCall.args, ["message", preparedError.message]);
    });
  });

  describe("renderDetailsView(params)", function() {
    it("should be called with valid ISBN (in params)", function() {
      const getBookDetailsStub = sinon.stub(BookStore.prototype, "getBookDetails");

      // render details view for valid ISBN
      const isbn = "9872384723";
      (new BookController()).renderDetailsView(new URLSearchParams({"isbn": isbn}));

      // assert BookStore.getBookDetails(isbn) and BookAdapter.transformBookDetails() were called
      assert.equal(getBookDetailsStub.firstCall.args[0], isbn, "Expect to forward empty search into BookStore.getBookDetails()");
      assert.isTrue(BookAdapter.transformBookDetails.called, "expect that BookAdapter.transformBookDetails() was called");
    });

    it("should be called with invalid resp. 'not found' ISBN (params)", function() {
      const preparedError = new Error("ISBN was invalid");
      const getBookDetailsStub = sinon.stub(BookStore.prototype, "getBookDetails").throws(() => preparedError);

      // render details view for valid ISBN
      const isbn = "invalid ISBN"; // ISBN is not used, because Error is provoked by stub
      (new BookController()).renderDetailsView(new URLSearchParams({"isbn": isbn}));

      // assert BookStore.getBookDetails(isbn) and BookAdapter.transformBookDetails() were called
      assert.equal(getBookDetailsStub.firstCall.args[0], isbn, "Expect to forward empty search into BookStore.getBookDetails()");
      assert.isFalse(BookAdapter.transformBookDetails.called, "expect that BookAdapter.transformBookDetails() not to call");

      // assert that type and message of message box where set correctly
      assert.isTrue(this.messageBoxSetAttributeStub.calledTwice);
      assert.deepEqual(this.messageBoxSetAttributeStub.firstCall.args, ["type", "error"]);
      assert.deepEqual(this.messageBoxSetAttributeStub.secondCall.args, ["message", preparedError.message]);
    });
  });

  describe("renderAddView()", function() {
    it("should render <book-adder> correctly", function() {
      const createElement = sinon.spy(document, "createElement");
      
      // render add view
      (new BookController()).renderAddView();

      // assert that <book-adder> was created via document.createElement() function
      assert.isTrue(createElement.calledOnce);
      assert.equal(createElement.firstCall.args[0], "book-adder");
    });
  });

  describe("addBook()", function() {
    beforeEach(function() {
      // pretend to be and "Add Book view"
      window.location.hash = "#/book/add";
    });

    after(function() {
      window.location.hash = "";
    });

    it("should add a valid book", function() {
      const fakeBook = {
        "title": "Foobar",
        "isbn": 42
      };
      const storeAddBookStub = sinon.stub(BookStore.prototype, "addBook").returns(fakeBook);

      // add fake Book
      (new BookController()).addBook(fakeBook);

      // assert that BookStore.addBook() was called only once
      assert.isTrue(storeAddBookStub.calledOnce, "BookStore.addBook() should be called once");

      // assert that type and message of message box where set correctly
      assert.isTrue(this.messageBoxSetAttributeStub.calledTwice);
      assert.deepEqual(this.messageBoxSetAttributeStub.firstCall.args, ["type", "success"]);
      assert.deepEqual(this.messageBoxSetAttributeStub.secondCall.args, ["message", `Book with ISBN ${fakeBook.isbn} was added successfully`]);

      // assert that window is back to /book/list
      assert.equal(window.location.hash, "#/book/list", "After book was added successfully, go back to book list");
    });

    it("should throw error on invalid book", function() {
      // prepare error to throw
      const preparedError = new Error("faked error");
      const addBookErrStub = sinon.stub(BookStore.prototype, "addBook").throws(() => preparedError);

      // assert that error is thrown back to caller
      assert.throw(function() {
        (new BookController()).addBook()
      }, Error);

      // assert that BookStore.addBook() was called only once
      assert.isTrue(addBookErrStub.calledOnce, "BookStore.addBook() should throw the preparedError");

      // assert that window.location.hash stays on #/book/add route
      assert.notEqual(window.location.hash, "#/book/list", "Stay on #/book/add route");
    });
  });

  describe("searchBook()", function() {
    it("should set route for empty search", () => {
      (new BookController()).searchBook();
      assert.equal(window.location.hash, "#/book/list", "Be on #/book/list without params");
    });

    it("should set route for {'foo': 'bar'} search", () => {
      const search = { "foo": "bar" };
      (new BookController()).searchBook(search);
      assert.equal(window.location.hash, "#/book/list?foo=bar", "Be on #/book/list with valid params");
    });

    it("should set route for 'empty-ish' values", () => {
      const search = {};
      for (const value of [null, undefined, "  "]) {
        search.key = value;
        (new BookController()).searchBook(search);
        assert.equal(window.location.hash, "#/book/list?key=", "Be #/book/list with key but with empty value");
      }
    });
  });

  describe("deleteBook()", function() {
    it("should delete book by ISBN", function() {
      const deleteBookStub = sinon.stub(BookStore.prototype, "deleteBook");
      const isbnToDelete = "9878689095";

      // delete book 
      (new BookController()).deleteBook(isbnToDelete);

      // assert that BookStore.deleteBook() was called properly
      assert.isTrue(deleteBookStub.calledOnce);
      assert.equal(deleteBookStub.firstCall.args[0], isbnToDelete, "ISBN was forwarded to BookStore.deleteBook() method");
    });

    it("should show message on error during book deletion", function() {
      // prepare error on BookStore.deleteBook() 
      const preparedError = new Error("faked error");
      const deleteBookStub = sinon.stub(BookStore.prototype, "deleteBook").throws(() => preparedError);

      // delete book and assert that it doesn't throw an Error
      const isbnToDelete = "9878689095";
      assert.doesNotThrow(function() {
        (new BookController()).deleteBook(isbnToDelete)
      }, Error);

      // assert that BookStore.deleteBook() was called properly
      assert.isTrue(deleteBookStub.calledOnce);
      assert.equal(deleteBookStub.firstCall.args[0], isbnToDelete, "ISBN was forwarded to BookStore.deleteBook() method");

      // assert that a warning message is printed out to user
      assert.isTrue(this.messageBoxSetAttributeStub.calledTwice);
      assert.deepEqual(this.messageBoxSetAttributeStub.firstCall.args, ["type", "warning"]);
      assert.deepEqual(this.messageBoxSetAttributeStub.secondCall.args, ["message", preparedError.message]);
    });
  });

  describe("updateBookRating(isbn, newRating)", function() {
    it("should update book by ISBN and newRating", function() {
      const updateBookRatingStub = sinon.stub(BookStore.prototype, "updateBookRating");

      // update book rating
      const isbn = "9878689095";
      const rating = 4;
      (new BookController()).updateBookRating(isbn, rating);

      // assert that BookStore.deleteBook() was called properly
      assert.isTrue(updateBookRatingStub.calledOnce);
      assert.equal(updateBookRatingStub.firstCall.args[0], isbn, "ISBN was forwarded as first parameter");
      assert.equal(updateBookRatingStub.firstCall.args[1], rating, "rating was forwarded as second parameter");
    });

    it("should show error message for incorrect update", function() {
      const preparedError = new Error("update book rating went wrong");
      const updateBookRatingStub = sinon.stub(BookStore.prototype, "updateBookRating").throws(() => preparedError);

      // BookController.updateBookRating() does not throw an error, it only shows a message.
      // Error handling from caller (<book-list>) is not expected.
      assert.doesNotThrow(function() {
        (new BookController()).updateBookRating()
      }, Error);

      // assert that an error message is printed out to user
      assert.isTrue(this.messageBoxSetAttributeStub.calledTwice);
      assert.deepEqual(this.messageBoxSetAttributeStub.firstCall.args, ["type", "error"]);
      assert.deepEqual(this.messageBoxSetAttributeStub.secondCall.args, ["message", preparedError.message]);
    });
  });

});
