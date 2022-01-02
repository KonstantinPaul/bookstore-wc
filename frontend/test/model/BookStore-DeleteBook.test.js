const assert = chai.assert; // using chaijs as an "comparison" library
import BookStore from "../../src/model/BookStore.js";
import Book from "../../src/model/Book.js";


describe("BookStore deleteBook()", () => {
    const bookStore = new BookStore();
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

    before(() => {
        harryPotterBooks.forEach((hpBook) => {
            bookStore.addBook(hpBook);
        });
    });

    it("Delete book with undefined ISBN as paramter", () => {
        try {
            bookStore.deleteBook(undefined);

            assert.fail("Expects TypeError to be thrown for undefined 'isbn' parameter");
        } catch (err) {
            assert.instanceOf(err, TypeError, "A TypeError is thrown, because of undefined 'isbn' parameter");
        }
    });

    it("Delete book with not existing ISBN", () => {
        try {
            bookStore.deleteBook("123456789");

            assert.fail("Expects TypeError to be thrown, because book was not found to delete");
        } catch (err) {
            assert.instanceOf(err, Error, "A TypeError is thrown, because book was not found to delete");
            assert.include(err.message, "was not found");
        }
    });

    it("Delete same book twice with existing ISBN", () => {
        try {
            bookStore.deleteBook("9780747591085").deleteBook("9780747591085");

            assert.fail("Expects Error to be thrown, because book with ISBN: 9780747591085 was already deleted");
        } catch (err) {
            assert.instanceOf(err, Error, "Error is thrown, because book with ISBN: 9780747591085 was already deleted");
            assert.include(err.message, "was not found");
        }
    });

    it("Delete existing book from book store", () => {
        bookStore.deleteBook("9780747591061");
        assert.isOk("No error was thrown during deletion of book with ISBN: 9780747591061");
    });

    it("Delete book from empty book store", () => {
        try {
            localStorage.clear();
            bookStore.deleteBook("123456789");

            assert.fail("Expects Error to be thrown, because book was not found on empty book store");
        } catch (err) {
            assert.instanceOf(err, Error, "An Error is thrown, because book was not found on empty book store");
            assert.include(err.message, "was not found");
        }
    });

    after(() => {
        localStorage.clear();
    });
});
