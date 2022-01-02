import LocalBookStorage from "./LocalBookStorage.js";

/**
 * This BookStore is the model for: 
 * - adding book
 * - deleting books by ISBN
 * - getting bookDetails by ISBN for one book
 * - getting (all) books
 */

export default class BookStore {
  /*
   * @param: storage -- This objects stores the books persitantly for e.g. in localStorage or online via REST calls
   */
  constructor() {
    this.storage = new LocalBookStorage();
  }

  addBook(newBook) {
    const booksXML = this.getBooks();
    // throw error for invalid params
    this.#checkBook(newBook, booksXML);

    // Add one book
    const firstElementChild = booksXML.documentElement.firstElementChild;

    if (!firstElementChild) {
      // appendChild if no book was inserted before
      booksXML.documentElement.appendChild(newBook.bookElement);
    } else {
      // prepend newBook to get a stack (LIFO principle)
      firstElementChild.before(newBook.bookElement);
    }

    this.storage.books = booksXML;

    return this;
  }

  deleteBook(isbn) {
    if (!isbn) {
      throw new TypeError("ISBN was undefined");
    }

    const booksXML = this.getBooks();
    const bookToDelete = booksXML.getElementById(isbn);
    if (!bookToDelete) {
      throw new Error(`ISBN: ${isbn} was not found in book store`);
    }

    bookToDelete.remove();
    this.storage.books = booksXML;

    return this;
  }

  getBookDetails(isbn) {
    if (!isbn) {
      throw new TypeError("ISBN was undefined");
    }

    const booksXML = this.getBooks();
    const book = booksXML.getElementById(isbn);

    if (!book) {
      throw new Error(`Book for ISBN: ${isbn} was not found in book store`);
    }

    return book;
  }

  getBooks() {
    return this.storage.books;
  }

  isValidISBN(isbn) {
    // check if isbn has a length of 10 and consists only of numbers
    const isISBN10 = (isbn.length == 10) && (/^\d{10}$/.test(isbn));

    // check if isbn-13 without hyphen
    const isISBN13 = (isbn.length == 13) && (/^\d{13}$/.test(isbn));

    // check if isbn-13 with hyphen for e.g 978-3-86680-192-9
    const isbn13Regex = /^\d{3}-\d-\d{5}-\d{3}-\d$/;
    const isISBN13WithHyphen = isbn13Regex.test(isbn);

    return (isISBN10 || isISBN13 || isISBN13WithHyphen);
  }

  #checkBook(book, booksXML) {
    if (!book) {
      throw new TypeError("New book is undefined");
    } else if (!book.isbn) {
      throw new TypeError("ISBN was undefined");
    } else if (!this.isValidISBN(book.isbn)) {
      throw new Error("ISBN was invalid, neither ISBN-10 nor ISBN-13 applies");
    } else if (booksXML.getElementById(book.isbn)) { // check if ISBN is duplicated
      throw new Error(`Duplicated ISBN: ${book.isbn} was found in book store`);
    }
  }
}
