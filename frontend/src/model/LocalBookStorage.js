/**
 * This LocalBookStorage is the model for parsing books to localStorage and back
 */

export default class LocalBookStorage {
   
    constructor() {
        this.serializer = new XMLSerializer();
        this.domParser = new DOMParser();
    }

    set books(newBooks) {
        const newBooksString = this.serializer.serializeToString(newBooks);
        localStorage.setItem("book-store", newBooksString);
    }

    get books() {
        const bookStoreString = localStorage.getItem("book-store") || "<books />";
        return this.domParser.parseFromString(bookStoreString, "application/xml");
    }
}

