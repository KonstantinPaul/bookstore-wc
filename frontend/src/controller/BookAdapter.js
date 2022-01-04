/***
 * BookAdapter is an apdater, which gets our BookList (XMLDocument)
 * and converts it into multiple views
 * - BookListView (as table)
 * - BookDetailView (a detail view of one book)
 */
export default class BookAdapter {

  static transformBookList(
    bookListComponent = document.createElement("book-list"), 
    booksXMLDocument
  ) {
    const bookElementList = booksXMLDocument.querySelectorAll("book");

    // run through bookElements and extract title, isbn and author for <book-list>
    const bookPreviewArray = [];
    for (const bookNode of bookElementList) {
      const newBook = {};
      newBook.title = bookNode.getAttribute("title");
      newBook.isbn = bookNode.getAttribute("isbn");
      newBook.author = bookNode.getAttribute("author");

      bookPreviewArray.push(newBook);
    }

    // add extracted book (preview version) to component (as table rows)
    bookListComponent.books = bookPreviewArray;

    return bookListComponent;
  }

  static transformBookDetails(bookXML) {
    const bookDetailComponent = document.createElement("book-detail");

    // run through all attributes of <book> XML and set them to <book-detail> (web component)
    for (const attribute of bookXML.attributes) {
      bookDetailComponent.setAttribute(attribute.name, attribute.value);
    }

    return bookDetailComponent;
  }
}
