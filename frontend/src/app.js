import Router from "./controller/Router.js";
import PageNotFoundView from "./view/PageNotFoundView.js";
import BookController from "./controller/BookController.js";

import AppHeader from "./view/appHeader/AppHeader.js";
import AppNavigation from "./view/appNavigation/AppNavigation.js";


document.addEventListener("DOMContentLoaded", () => {
  const router = new Router(
    new BookController(), 
    new PageNotFoundView()
  );

  // init routing and render default view: "#/book/list"
  router.route(); 
});

