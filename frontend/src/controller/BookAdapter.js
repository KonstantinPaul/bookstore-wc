/***
 * BookAdapter is an apdater, which gets our BookList (XMLDocument)
 * and converts it into multiple views
 * - BookListView (as table)
 * - BookDetailView (a detail view of one book)
 */
export default class BookAdapter {

  static transformBookList(booksXMLDocument) {
    const bookElementList = booksXMLDocument.querySelectorAll("book");
    const bookListComponent = document.createElement("book-list");

    // run through bookElements and extract title, isbn and author for <book-list>
    const bookPreviewArray = [];
    for (let i = 0; i < bookElementList.length; i++) {
      const newBook = {};
      newBook.title = bookElementList.item(i).getAttribute("title");
      newBook.isbn = bookElementList.item(i).getAttribute("isbn");
      newBook.author = bookElementList.item(i).getAttribute("author");

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
