import Router from "./controller/Router.js";
import PageNotFoundView from "./view/PageNotFoundView.js";
import BookController from "./controller/BookController.js";

import AppHeader from "./view/appHeader/AppHeader.js";
import AppNavigation from "./view/appNavigation/AppNavigation.js";


document.addEventListener("DOMContentLoaded", () => {
  const router = new Router(new BookController(), new PageNotFoundView());

  // set default route to list view for books
  window.location.hash = "#/book/list";
  
  // trigger routing: Even when you are on #/book/list already and reload page
  router.route("#/book/list");
});

