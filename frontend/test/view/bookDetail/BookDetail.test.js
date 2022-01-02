const assert = chai.assert; // using chaijs as an "comparison" library
import TestHelpers from "../../TestHelpers.js";

// load dependencies to instantiate or mock
import BookDetail from "../../../src/view/bookDetail/BookDetail.js";

describe("<book-detail> is tested", () => {

  before(async function() {
    // load iframe to place <book-adder>
    this.iframe = await TestHelpers.loadIframe("http://localhost:8888/test/blank.html");
  });

  beforeEach(function() {
    // init new book-detail element and place it in iframe
    const newBookDetail = new BookDetail();

    // append or iframe or replace current one
    if (!this.iframe.contentDocument.querySelector("book-detail")) {
      this.iframe.contentDocument.body.appendChild(newBookDetail);
    } else {
      this.iframe.contentDocument.querySelector("book-detail").replaceWith(newBookDetail);
    }

    this.bookDetail = newBookDetail;
  });

  after(function() {
    this.iframe.remove();
  });

  it("Check default values for empty <book-detail> element", function() {
    // this is an empty field object, used to retrieve elements from <book-detail> shadowRoot
    const defaultBookFields = {
      "title": null,
      "isbn": null,
      "author": null,
      "description": null
    };

    for (const id in defaultBookFields) {
      // set extracted textContent to object
      defaultBookFields[id] = this.bookDetail.shadowRoot.querySelector(`#${id}`).textContent;
    }

    // assert that all default values are correct set
    assert.equal(defaultBookFields.title, "No title provided");
    assert.equal(defaultBookFields.author, "No author provided");
    assert.equal(defaultBookFields.isbn, "No ISBN provided");
    assert.equal(defaultBookFields.description, "No description provided");
  });

  it("Should set all attributes: title, author, isbn, description", function() {
    const bookFields = {
      "title": "Der 13. Paladin Band I: \"Ahren\"",
      "isbn": 1306845681,
      "author": "Torsten Weitze",
      "description": "Von seinem trunksüchtigen Vater verprügelt und von der Dorfjugend schikaniert, kann der heranwachsende Ahren sein Glück kaum fassen, als er bei der alljährlichen Eignungsprüfung von Falk dem Waldläufer als Lehrling auserwählt wird. Bei ihm lernt er das Bogenschießen und den Kampf gegen Dunkelwesen, bis am Tag der Frühlingszeremonie etwas Unerwartetes geschieht: Als Ahren den Götterstein berührt, beginnt dieser zu leuchten. Kurze Zeit später taucht ein mürrischer Magier auf und treibt Falk und Ahren zur Eile an, denn etwas Böses ist dabei, zu erwachen. Gemeinsam mit seinen ungleichen Gefährten begibt sich der junge Waldläufer auf eine gefahrvolle Reise zum Immergrün, dem Reich der Elfen, um deren Hilfe zu erbitten. Doch die Zeit ist knapp, denn ER, DER ZWINGT hat es auf Ahren abgesehen und ER setzt alles daran, ihn zu vernichten."
    };

    for (const id in bookFields) {
      // set book field into <book-detail>
      this.bookDetail.setAttribute(id, bookFields[id]);

      // assert that field was set correctly
      const field = this.bookDetail.shadowRoot.querySelector(`#${id}`);
      assert.equal(bookFields[id], field.textContent, `Field: ${id} should have same value`);
    }
  });
});
