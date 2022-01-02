import ImportHelper from "../../utils/ImportHelper.js";

// extract basePath relative to current JS file
const basePath = ImportHelper.getCurrentFolderPath(import.meta.url);

// setup app-navigation template
const appNavigationTemplate = document.createElement("template");
appNavigationTemplate.innerHTML = `
<style type="text/css">
  @import "${basePath}/appNavigation.css";
</style>
<nav>
  <ul id="navigation" class="nav nav-tabs nav-fill">
    <li class="nav-item">
      <a class="nav-link active" href="#/book/list">Book List</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#/book/add">Add Book</a>
    </li>
    <li class="nav-item isDisabled">
      <a id="book-details-link" class="nav-link disabled" href="#/book/details" disabled="true">
      Book Detail
      </a>
    </li>
  </ul>
</nav>
`;

export { appNavigationTemplate };
