const assert = chai.assert; // using chaijs as an "comparison" library
import BookStore from "../../src/model/BookStore.js";
import Book from "../../src/model/Book.js";
import BookAdapter from "../../src/controller/BookAdapter.js";

/* This is a test if the BookAdapter transform the "correct" way */
/* It saves 5 "Harry Potter" books before via the "BookStore" object.
 * After that the Adapter is tested to do the right tranformation
 *
 * IMPORTANT: The tranformation the Views do internally are not tested! 
 *            They are mocked instead, to return what they were passed.
 */

describe("BookAdapter", () => {
  const bookStore = new BookStore();
  const harryPotterBooks = [
    new Book({
      "isbn": "3866310071",
      "title": "Harry Potter und der Stein der Weisen",
      "author": "J. K. Rowling",
      "description": "Some dummy sample description, which will never be read anyway."
    }),
    new Book({
      "isbn": "3866310072",
      "title": "Harry Potter und die Kammer des Schreckens",
      "author": "J. K. Rowling",
      "description": "Some dummy sample description, which will never be read anyway."
    }),
    new Book({
      "isbn": "3866310073",
      "title": "Harry Potter und der Gefangene von Askaban",
      "author": "J. K. Rowling",
      "description": "Some dummy sample description, which will never be read anyway."
    }),
    new Book({
      "isbn": "3866310074",
      "title": "Harry Potter und der Feuerkelch",
      "author": "J. K. Rowling",
      "description": "Some dummy sample description, which will never be read anyway."
    }),
    new Book({
      "isbn": "3866310075",
      "title": "Harry Potter und der Orden des Phönix",
      "author": "J. K. Rowling",
      "description": "Some dummy sample description, which will never be read anyway."
    })
  ];

  // add harryPotterBooks to fill up BookStore
  before(() => {
    for (let i = 0; i < harryPotterBooks.length; i++) {
      bookStore.addBook(harryPotterBooks[i]);
    }
    // reverse array after saving, for better comparison, because storage is a stack (LIFO principle)
    harryPotterBooks.reverse();
  });

  // clear localStorage after tests have passed
  after(() => {
    localStorage.clear();
  });

  it("Transform <books> into bookListView", () => {
    // transform <books> into Array of book (json) objects
    const storedBooks = bookStore.getBooks();
    const bookObjects = BookAdapter.transformBookList(storedBooks);

    // expect title, isbn and author to have been set
    const previewHarryPotterArr = harryPotterBooks.map(book => {
      return {
        "title": book.title,
        "isbn": book.isbn,
        "author": book.author
      }
    });

    assert.sameDeepMembers(bookObjects.books, previewHarryPotterArr, "Transformed books where set to <book-list> array as expected");
  });

  it("Transform <book> into bookDetailView", () => {
    const expectedBook = bookStore.getBookDetails("3866310073");

    // transform <books> into <book-detail>, which is a WebComponent but has the same attributes
    const bookObject = BookAdapter.transformBookDetails(expectedBook);

    // expect title, isbn, author and description to have been set as attribute
    assert.equal(bookObject.getAttribute("isbn"), expectedBook.getAttribute("isbn"));
    assert.equal(bookObject.getAttribute("title"), expectedBook.getAttribute("title"));
    assert.equal(bookObject.getAttribute("author"), expectedBook.getAttribute("author"));
    assert.equal(bookObject.getAttribute("description"), expectedBook.getAttribute("description"));
  });

});
