import BookStore from "../model/BookStore.js";
import BookAdapter from "./BookAdapter.js";
import Book from "../model/Book.js";

// Views re-implemented as WebComponents
import BookAdder from "../view/bookAdder/BookAdder.js";
import BookDetail from "../view/bookDetail/BookDetail.js";
import BookList from "../view/bookList/BookList.js";
import BookSearch from "../view/bookSearch/BookSearch.js";

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
   *
   * @params(@URLSearchParams): These are search params to filter books
   */
  renderListView(params) {
    try {
      // extract searchKey and searchParam from params
      let searchKey, searchValue = "";
      if (!!params) {
        for (const pair of params.entries()) {
          searchKey = pair[0];
          searchValue = pair[1];
          // expect first key-value-pair to be the search
          break;
        }
      }

      // search books
      const books = this.#bookModel.getBooks({
        "searchKey": searchKey,
        "searchValue": searchValue
      });
      
      // evaluate if <book-list> is already there, if not then create new element
      let bookListElement = this.#viewSpace.querySelector("book-list");
      if (!bookListElement) {
        // create new <book-list> element
        bookListElement = document.createElement("book-list");
        bookListElement.controller = this;
      }

      // transform books XML and set them to <book-list> element
      bookListElement = BookAdapter.transformBookList(bookListElement, books);

      // add book-search as slotted element to <book-list>
      let bookSearch = bookListElement.querySelector("book-search");
      if (!bookSearch) {
        // init search on first render
        bookSearch = document.createElement("book-search");
        bookSearch.controller = this;
        bookSearch.setAttribute("slot", "book-search");
        bookListElement.appendChild(bookSearch);
      }

      // update search with search params
      bookSearch.setAttribute("search-key", searchKey);
      bookSearch.setAttribute("search-value", searchValue);

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
   * @param URLSearchParams: This is an URL search param
   */
  renderDetailsView(params) {
    try {
      const isbn = params.get("isbn");
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
    this.#bookModel.addBook(newBook);

    // show that book was successfully added
    this.#addMessageBox({
      "type": "success",
      "message": `Book with ISBN ${newBook.isbn} was added successfully`
    });

    // redirect to book list after successful added book
    window.location.hash = "/book/list";
  }

  /**
   * Append search params to #/book/list route
   *
   * @param searchObject: {"<bookProperty>": "<searchValue>"} 
   */
  searchBook(searchObject) {
    let searchRouteHash = `/book/list`;
    if (searchObject) {
      const searchKey = Object.keys(searchObject)[0] || "";
      let searchValue = searchObject[searchKey] || "";
      // remove whitespaces in front and back of strings
      if ((typeof searchValue) === "string") {
        searchValue = searchValue.trim();
      }

      searchRouteHash += `?${searchKey}=${searchValue}`;
    }

    window.location.hash = searchRouteHash;
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
    const {type, message} = params;

    const messageBox = new MessageBox();
    messageBox.setAttribute("type", type);
    messageBox.setAttribute("message", message);

    // append message to messageSpace
    this.#messageSpace.appendChild(messageBox);
  }
}
