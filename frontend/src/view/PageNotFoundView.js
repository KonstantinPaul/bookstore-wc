export default class PageNotFoundView {

  #viewSpace;

  constructor() {
    this.#viewSpace = document.getElementById("viewSpace");
  }

  renderView() {
    const notFoundTemplate = document.createElement("template");
    notFoundTemplate.innerHTML = `
      <div class="d-flex align-items-center position-absolute top-50 start-50 translate-middle">
        <h1>404 |&nbsp;</h1>
        <h2 class="font-weight-normal lead">The page you requested was not found.</h2>
      </div>`;
    const view = notFoundTemplate.content.cloneNode(true);

    // append page not found view to "viewSpace" element in DOM
    if (!this.#viewSpace.firstElementChild) {
      this.#viewSpace.appendChild(view);
    } else {
      this.#viewSpace.firstElementChild.replaceWith(view);
    }
  }
}
