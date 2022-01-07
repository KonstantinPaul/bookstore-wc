import LocalBookStorage from "./LocalBookStorage.js";

/*
 * This Book model is ONLY for the BookAdder view to create a <book> element, 
 * which is later passed to the BookController,
 * which saves it via the BookStore.addBook(book) method.
*/
export default class Book {

    constructor(bookObject) {
        // init bookElement
        const bookXMLDoc = (new LocalBookStorage()).books;
        this.bookElement = bookXMLDoc.createElement("book");

        // call setter (if there) for all given properties
        for (const key in bookObject) {
            this[key] = bookObject[key];
        }
    }

    set isbn(newISBN) {
        this.bookElement.setAttribute("id", newISBN);
        this.bookElement.setAttribute("isbn", newISBN);
        return this;
    }

    get isbn() {
        return this.bookElement.getAttribute("isbn") || "";
    }

    set title(newTitle) {
        this.bookElement.setAttribute("title", newTitle);
        return this;
    }

    get title() {
        return this.bookElement.getAttribute("title") || "";
    }

    set author(newAuthor) {
        this.bookElement.setAttribute("author", newAuthor);
        return this;
    }

    get author() {
        return this.bookElement.getAttribute("author") || "";
    }

    set description(newDescription) {
        this.bookElement.setAttribute("description", newDescription);
        return this;
    }

    get description() {
        return this.bookElement.getAttribute("description") || "";
    }
}
