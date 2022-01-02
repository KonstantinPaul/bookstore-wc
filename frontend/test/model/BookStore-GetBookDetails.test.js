const assert = chai.assert; // using chaijs as an "comparison" library
import BookStore from "../../src/model/BookStore.js";
import Book from "../../src/model/Book.js";


describe("BookStore getBookDetails()", () => {

    const bookStore = new BookStore();

    const herrDerRinge = new Book();
    herrDerRinge.title = "Der Herr der Ringe. Bd. 1 - Die Gefährten";
    herrDerRinge.author = "J. R. R. Tolkien";
    herrDerRinge.isbn = "978-3-60893-981-1";
    herrDerRinge.description = "Der Schauplatz des Herrn der Ringe ist Mittelerde, eine alternative Welt, und erzählt wird von der gefahrvollen Quest einiger Gefährten, die in einem dramatischen Kampf gegen das Böse endet. Durch einen merkwürdigen Zufall fällt dem Hobbit Bilbo Beutlin ein Zauberring zu, dessen Kraft, käme er in die falschen Hände, zu einer absoluten Herrschaft des Bösen führen würde. Bilbo übergibt den Ring an seinen Neffen Frodo, der den Ring in der Schicksalskluft zerstören soll. Hobbits sind kleine, gemütliche Leute, dabei aber erstaunlich zäh. Sie leben in einem ländlichen Idyll, dem Auenland.";

    before(() => {
        // add (at least one) book with all details
        bookStore.addBook(herrDerRinge);
    });

    it("Get book details for undefined ISBN", () => {
        try {
            bookStore.getBookDetails(undefined);

            assert.fail("Expects TypeError to be thrown for undefined ISBN");
        } catch (undefinedISBNError) {
            assert.instanceOf(undefinedISBNError, TypeError, "A TypeError is thrown, because ISBN was undefined");
        }
    });

    it("Get book details for valid, but not found ISBN", () => {
        try {
            bookStore.getBookDetails("123456789");

            assert.fail("Expects Error to be thrown, because book wasn't found");
        } catch (err) {
            assert.instanceOf(err, Error, "An Error is thrown, because book wasn't found");
            assert.include(err.message, "was not found");
        }
    });

    it("Get book details for valid ISBN", () => {
        const dieGefaehrten = bookStore.getBookDetails(herrDerRinge.isbn);
        // check if stored "dieGefaehrten" and herrDerRinge (book object) have the same attributes/properties
        assert.equal(herrDerRinge.isbn, dieGefaehrten.getAttribute("id"));
        assert.equal(herrDerRinge.isbn, dieGefaehrten.getAttribute("isbn"));
        assert.equal(herrDerRinge.title, dieGefaehrten.getAttribute("title"));
        assert.equal(herrDerRinge.author, dieGefaehrten.getAttribute("author"));
        assert.equal(herrDerRinge.description, dieGefaehrten.getAttribute("description"));
    });

    after(() => {
        localStorage.clear();
    });
});
