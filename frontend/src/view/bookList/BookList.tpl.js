import ImportHelper from "../../utils/ImportHelper.js";

const basePath = ImportHelper.getCurrentFolderPath(import.meta.url);

const tableTemplate = document.createElement("template");
tableTemplate.innerHTML = `
<style type="text/css">
  @import "/assets/css/formElements.css";
  @import "${basePath}/bookList.css";
</style>

<article>
  <h1>
    <span id="bookCount">0</span> books are shown
  </h1>

  <table id="bookListTable">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Author</th>
        <th scope="col">ISBN</th>
        <th scope="col">Detail</th>
        <th scope="col">Delete</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</article>
`;

const tableRowTemplate = document.createElement("template");
tableRowTemplate.innerHTML = `
<tr>
  <td id="title"></td>
  <td id="author"></td>
  <td id="isbn"></td>
  <td><a id="detailLink" class="detail-link" href="#/book/details?isbn=">Show details</a></td>
  <td><button id="deleteButton" class="btn btn-delete" type="button">Delete</button></td>
</tr>
`;

export {
  tableTemplate,
  tableRowTemplate
};
