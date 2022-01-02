const assert = chai.assert; // using chaijs as an "comparison" library

import Book from "../../src/model/Book.js";

describe("Book module testing()", () => {

  it("Set id as property together with isbn", () => {
    // set isbn and id in background of book
    const b = new Book();
    const testISBN = "12073259872";
    b.isbn = testISBN;

    // check if ISBN is set as element attributes for "isbn" and "id"
    const bookElement = b.bookElement;
    assert.equal(bookElement.getAttribute("isbn"), testISBN);
    assert.equal(bookElement.getAttribute("id"), testISBN);
    assert.equal(bookElement.id, testISBN);
  });

  it("Test faulty params for Book() constructor", () => {
    const faultyBook = new Book({"foo": "bar", "some": "other garbage", "date": "2021-10-21"});

    // test all properties of book if they are still empty
    assert.isEmpty(faultyBook.isbn);
    assert.isEmpty(faultyBook.title);
    assert.isEmpty(faultyBook.author);
    assert.isEmpty(faultyBook.description);
    assert.isEmpty(faultyBook.bookElement.id);
  });

});
