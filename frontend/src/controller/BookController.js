import BookStore from "../model/BookStore.js";
import BookAdapter from "./BookAdapter.js";
import Book from "../model/Book.js";

// Views re-implemented as WebComponents
import BookAdder from "../view/bookAdder/BookAdder.js";
import BookDetail from "../view/bookDetail/BookDetail.js";
import BookList from "../view/bookList/BookList.js";

// MessageBox to create and show messages <message-box> elements
import MessageBox from "../view/messageBox/MessageBox.js";

/**
 * Standardcontroller for handling the program flow around books
 */
export default class BookController {

  #viewSpace; // spaces where views like <book-detail>, <book-list>, etc. go
  #messageSpace; // space where multiple messages are pushed to
  #bookModel;

  constructor() {
    this.#bookModel = new BookStore();
    this.#viewSpace = document.getElementById("viewSpace");
    this.#messageSpace = document.getElementById("messageSpace");
  }

  /**
   * Displays Book List
   * Route: #/book/list
   */
  renderListView(params) {
    const books = this.#bookModel.getBooks();

    try {
      // transform books XML to <book-list> element
      const bookListElement = BookAdapter.transformBookList(books);
      bookListElement.controller = this; // set controller for removing books
      this.#renderView(bookListElement);
    } catch (err) {
      this.#addMessageBox({
        "type": "error",
        "message": err.message
      });
    }
  }

  /**
   * Diplays the book adding view
   * Route: #/book/add
   */
  renderAddView() {
    const addBookView = document.createElement("book-adder");
    addBookView.controller = this; // set controller for adding books

    this.#renderView(addBookView);
  }

  /**
   * Show Details of a book
   * Route: #/book/details
   * Params: isbn=12309124
   * Example Route: #/book/details?isbn=1234567899
   *
   * @param {isbn: "<isbn value>"}
   */
  renderDetailsView(params) {
    try {
      const { isbn } = params;
      const book = this.#bookModel.getBookDetails(isbn);

      const bookDetailElement = BookAdapter.transformBookDetails(book);
      this.#renderView(bookDetailElement);
    } catch (err) {
      // show message that book was not found for ISBN
      this.#addMessageBox({
        "type": "error",
        "message": err.message
      });

      // redirect back to #/book/list route because ISBN was not found
      window.location.hash = "/book/list";
    }
  }

  /**
   * Adding a book to the list mostly done by "AddView"
   * @params: (type: Book) newBook: A new Book object instance of model class
   */
  addBook(newBook) {
    try {
      this.#bookModel.addBook(newBook);

      // show that book was successfully added
      this.#addMessageBox({
        "type": "success",
        "message": `Book with ISBN ${newBook.isbn} was added successfully`
      });

      // redirect to book list after successful added book
      window.location.hash = "/book/list";
    } catch (err) {
      this.#addMessageBox({
        "type": "error",
        "message": err.message
      });

      // throw error back to caller for further UI handling
      throw err;
    }
  }

  /**
   * Deleting a Book from the List
   *
   * @param {String} isbn 
   */
  deleteBook(isbn) {
    try {
      this.#bookModel.deleteBook(isbn);
    } catch (err) {
      this.#addMessageBox({
        "type": "warning",
        "message": err.message
      });
    }
  }

  /** PRIVATE METHODS **/

  #renderView(viewToPlace) {
    if (!this.#viewSpace.firstElementChild) {
      this.#viewSpace.appendChild(viewToPlace);
    } else {
      this.#viewSpace.firstElementChild.replaceWith(viewToPlace);
    }
  }

  #addMessageBox(params = {
    "type": "info",
    "message": ""
  }) {
    const { type, message } = params;

    const messageBox = new MessageBox();
    messageBox.setAttribute("type", type);
    messageBox.setAttribute("message", message);

    // append message to messageSpace
    this.#messageSpace.appendChild(messageBox);
  }
}
