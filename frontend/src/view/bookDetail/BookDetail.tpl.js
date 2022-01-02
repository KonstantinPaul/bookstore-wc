import ImportHelper from "../../utils/ImportHelper.js";

const basePath = ImportHelper.getCurrentFolderPath(import.meta.url);

const bookDetailTemplate = document.createElement("template");
bookDetailTemplate.innerHTML = `
<style type="text/css">
  @import "${basePath}/bookDetail.css";
</style>

<article id="bookDetail" class="book-detail">
  <header class="book-detail-header">
    <!-- see unicode table: https://www.unicode.org/emoji/charts/full-emoji-list.html#1f4d6 -->
    <span class="book-detail-symbol" aria-hidden="true">&#x1F4D6;</span>
    <dl class="book-detail-meta-data">
      <dt>Author</dt>
      <dd id="author">No author provided</dd>

      <dt>Title</dt>
      <dd id="title">No title provided</dd>

      <dt>ISBN</dt>
      <dd id="isbn">No ISBN provided</dd>
    </dl>
  </header>

  <!-- TODO: What todo if book description has multiple paragraphs? -->
  <p id="description" class="book-detail-description">No description provided</p>
</article>
`;

export { bookDetailTemplate };
