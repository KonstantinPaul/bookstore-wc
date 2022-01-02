const assert = chai.assert; // using chaijs as an "comparison" library
import BookStore from "../../src/model/BookStore.js";
import Book from "../../src/model/Book.js";


describe("BookStore addBook()", () => {
    const bookStore = new BookStore();

    // clear localStorage to reset everything to beginning
    afterEach(() => {
        localStorage.clear();
    });

    it("Add undefined book", () => {
        try {
          bookStore.addBook(undefined);

          assert.fail("Expect TypeError to be thrown, because book was undefined"); 
        } catch (error) {
          assert.instanceOf(error, TypeError, "A TypeError is thrown by adding undefined book");
        }
    });

    it("Add book without ISBN", () => {
        try {
            const emptyBook = new Book();
            bookStore.addBook(emptyBook);
        } catch (error) {
            assert.instanceOf(error, TypeError, "A TypeError is thrown by adding an empty book");
            assert.include(error.message, "ISBN was undefined");
            return ;
        }
      
        assert.fail("No TypeError was thrown, although book has no ISBN set");
    });

    it("Add book with invalid ISBN", () => {
        try {
            const invalidBook = new Book();
            invalidBook.isbn = "abcde12345";
            bookStore.addBook(invalidBook);

            assert.fail("Expect Error to be thrown, because isbn is invalid"); 
        } catch (error) {
            assert.instanceOf(error, Error, "An Error is thrown by adding a book with invald isbn");
            assert.include(error.message, "ISBN was invalid");
        }
    });

    it("Add book with duplicated ISBN", () => {
        const harryPotter = new Book();
        harryPotter.isbn = "3551551677";
        harryPotter.title = "Harry Potter und der Stein der Weisen";

        try {
            // try to add Harry Potter book twice
            bookStore.addBook(harryPotter).addBook(harryPotter);

            assert.fail("Expect Error for duplicated ISBN to be thrown"); 
        } catch (duplicateError) {
            // expect to throw a duplicated ISBN Error
            assert.instanceOf(duplicateError, Error);
            assert.include(duplicateError.message, `Duplicated ISBN: ${harryPotter.isbn}`);
        }
    });

    it("Add first book to empty storage", () => {
        const harryPotter = new Book({
            "isbn": "3551551677",
            "title": "Harry Potter und der Stein der Weisen",
            "author": "J. K. Rowling"
        });

        bookStore.addBook(harryPotter);
    });

    it("Add 5 sample books in reverse order", () => {
        const harryPotterBooks = [
            new Book({
                "isbn": "9780747591054"
            }),
            new Book({
                "isbn": "9780747591078"
            }),
            new Book({
                "isbn": "9780747591085"
            }),
            new Book({
                "isbn": "9780747591099"
            }),
            new Book({
                "isbn": "9780747591061"
            })
        ];

        // add harryPotterBooks (ISBN only) before every test case is evaluated
        for (let i = 0; i < harryPotterBooks.length; i++) {
            bookStore.addBook(harryPotterBooks[i]);
        }

        // check if they were added in reverse order
        const storedBooks = bookStore.getBooks().querySelectorAll("book");
      
        // d is counting "down" and u is counting "up" 
        for (let d = harryPotterBooks.length - 1, u = 0; d >= 0; d--, u++) {
            let harryPotterBookISBN = harryPotterBooks[d].isbn;
            let storedBookISBN = storedBooks.item(u).getAttribute("isbn");
            assert.equal(harryPotterBookISBN, storedBookISBN, "both ISBN have to be equal but the storage is made in reverse order");
        }
    });
});
