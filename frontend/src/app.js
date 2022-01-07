import Router from "./controller/Router.js";
import PageNotFoundView from "./view/PageNotFoundView.js";
import BookController from "./controller/BookController.js";

import AppHeader from "./view/appHeader/AppHeader.js";
import AppNavigation from "./view/appNavigation/AppNavigation.js";

/*** START of setting test data ***/

// Make sure to prepare some test books
import BookStore from "./model/BookStore.js";
import Book from "./model/Book.js";

import { sampleBookPreviewList } from "../test/_resources/bookData.data.js";

// Set test data, only if no books are saved in localStorage
try {
  const bookStore = new BookStore();
  const currBooksElem = bookStore.getBooks().documentElement;
  // add books, if book store is empty
  if (currBooksElem.childNodes.length == 0) {
    // add books in reverse() order, because book store saves books as a stack
    for (const sampleBook of sampleBookPreviewList.reverse()) {
      const newBook = new Book(sampleBook);
      console.debug(newBook.title, newBook.isbn);
      bookStore.addBook(newBook);
    }
  }
} catch (err) {
  // reset localStorage to reset books, which might be saved (integrity maintained)
  localStorage.clear();
  console.error("Save Sample data failed: ", err);
}
/*** END of setting test data ***/


document.addEventListener("DOMContentLoaded", () => {
  const router = new Router(new BookController(), new PageNotFoundView());

  // set default route to list view for books
  window.location.hash = "#/book/list";
  
  // trigger routing: Even when you are on #/book/list already and reload page
  router.route("#/book/list");
});

