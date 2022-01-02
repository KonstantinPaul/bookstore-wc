const assert = chai.assert; // using chaijs as an "comparison" library
import BookStore from "../../src/model/BookStore.js";
import Book from "../../src/model/Book.js";


describe("BookStore getBooks()", () => {
    const bookStore = new BookStore();

    // runs before each test in this block
    before(() => {
        localStorage.clear();
    });

    it("Get empty book list from empty localStorage", () => {
        const books = bookStore.getBooks();
        const firstChildName = books.documentElement.localName;
        assert.equal(firstChildName, "books");
    });

    // runs once after the last test in this block
    after(() => {
        localStorage.clear();
    });
});
