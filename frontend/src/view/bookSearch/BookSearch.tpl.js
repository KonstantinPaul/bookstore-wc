import ImportHelper from "../../utils/ImportHelper.js";

// extract basePath relative to current JS file
const basePath = ImportHelper.getCurrentFolderPath(import.meta.url);

const bookSearchTemplate = document.createElement("template");
bookSearchTemplate.innerHTML = `
<style type="text/css">
  @import "/assets/css/formElements.css";
  @import "${basePath}/bookSearch.css";
</style>

<section class="book-search-container">
  <h1>Search a book</h1>

  <form id="bookSearchForm">
    <label for="searchValue" class="field">
      <span class="label-text">Search value</span>
      <input id="searchValue" class="form-control" type="search" placeholder="Search text suitable for search key" required>
    </label>
    
    <label for="searchKey" class="field">
      <span class="form-text">Search key</span>
      <select id="searchKey" class="form-control" required>
        <option value="title" selected>Title</option>
        <option value="author">Author</option>
        <option value="isbn">ISBN</option>
        <option value="description">Description</option>
      </select>
    </label>

    <input id="searchButton" type="submit" class="btn btn-success form-control" value="Search books">
    <input id="resetButton" type="submit" class="btn btn-danger form-control" value="Clear search & reset fields">
  </form>
</section>`;

export { bookSearchTemplate };
