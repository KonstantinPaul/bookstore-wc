const assert = chai.assert; // using chaijs as an "comparison" library
import BookStore from "../../src/model/BookStore.js";
import Book from "../../src/model/Book.js";
import {
  sampleBookPreviewList
} from "../_resources/bookData.data.js";
import {
  invalidRatingUseCases,
  validISBN
} from "./updateBookRating.cases.js";


describe("BookStore update book calls", () => {
  before(function() {
    this.bookStore = new BookStore();

    // Add books to localStorage via BookStore, 
    // to make sure books are in the right data format (XML)
    for (const book of sampleBookPreviewList) {
      const newBook = new Book(book);
      this.bookStore.addBook(newBook);
    }
  });

  after(() => {
    // clear localStorage to reset everything to beginning
    localStorage.clear();
  });

  describe("updateBookRating(isbn, rating)", function() {
    // valid test case
    it("Update book with valid params", function() {
      assert.doesNotThrow(() => {
        this.bookStore.updateBookRating(validISBN, 2);
      });
    });

    // generate invalid test cases
    for (const invalidCase of invalidRatingUseCases) {
      it(`Invalid Case: ${invalidCase.description}. 
          Expect ${invalidCase.expectedError.error.name}`,
        function() {
          const { isbn, rating } = invalidCase.data;
          const { error, expectedMessage } = invalidCase.expectedError;
          assert.throws(
            () => this.bookStore.updateBookRating(isbn, rating), 
            error, 
            expectedMessage
          );

          assert.fail("updateBookRating() does not throw error as expected");
        }
      );
    }
  });

});
