import ImportHelper from "../../utils/ImportHelper.js";

const bookAdderTemplate = document.createElement("template");

// extract basePath relative to current JS file
const basePath = ImportHelper.getCurrentFolderPath(import.meta.url);

bookAdderTemplate.innerHTML = `
<style type="text/css">
  @import "/assets/css/formElements.css";
  @import "${basePath}/bookAdder.css";
</style>

<section class="book-adder-container">
  <h1>Add a new book</h1>

  <form id="bookAdderForm" action="#" method="POST">
    <label for="author" class="field">
      <span class="label-text">Author</span>
      <input type="text" class="form-control" id="author" required>
    </label>
    
    <label for="title" class="field">
      <span class="form-text">Title</span>
      <input type="text" class="form-control" id="title" required>
    </label>

    <label for="isbn" class="field">
      <span for="isbn" class="label-text">ISBN-10</span>
      <input type="text" class="form-control" id="isbn" pattern="^[0-9]{10}$" required maxlength="10">
    </label>

    <label for="description" class="field">
      <span class="label-text">Description</span>
      <textarea id="description" class="form-control" required></textarea>
    </label>

    <!-- TODO: Implement rating on "book-adder" respective "book-changer" component -->
    <!--
    <fieldset class="field">
      <legend>Rate a book</legend>
      <label for="rating" class="form-label">
        <span class="label-text">Rating from 1 to 5</span>
        <input type="number" class="form-control" id="rating">
      </label>
    </fieldset>
    -->
    
    <input type="submit" class="btn btn-success form-control" value="Add Book">
  </form>

</section>`;

export { bookAdderTemplate };
