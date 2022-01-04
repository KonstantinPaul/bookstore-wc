export default class Router {
  #controller;

  #notFoundView;

  //TODO: Add configuration per default for different and more controllers
  constructor(controller, notFoundView) {
    this.#controller = controller;
    this.#notFoundView = notFoundView;

    // route resp. change views hash changes
    window.addEventListener("hashchange", this.route.bind(this));
  }

  route() {
    // set default value to book list, per default)
    const hash = window.location.hash || "/book/list";

    // trigger hash reload, when hash was not undefined before
    window.location.hash = hash;

    const route = this.#extractRoute(hash);

    try {
      // evaluate method and models
      for (const model in route) {
        // Other models then book are ignored
        if (model === "book") {
          const {
            method,
            params
          } = route[model];

          // evaluate method (default: listView)
          switch (method) {
            case "list":
              this.#controller.renderListView(params);
              break;
            case "add":
              this.#controller.renderAddView();
              break;
            case "details":
              this.#controller.renderDetailsView(params);
              break;
            default:
              throw new Error(`${model}/${method} was not found`);
          }
        } else {
          throw new Error("model was not found");
        }
      }
    } catch (err) {
      // render 404-Error page, when route couldn't be resolved
      this.#notFoundView.renderView();
    }
  }

  /** This methods evaluates the window.location.hash to find model, method and parameters.
     * Assuming following hash-schema: #/<model>/<method>?<param>=<value>
     *
     * @param hash window.location.hash value
     * @return object like: {
         "<model>": {
             "method": "<method>",
             "params": searchParams (type @URLSearchParams)
         }
   */
  #extractRoute(hash) {
    // transform hash to URL to easier extract pathname an search params from it
    const url = new URL(window.location.hash.split("#")[1], location);
    const searchParams = new URLSearchParams(url.search);

    // first is mentioned the model an then methods
    // for e.g. model = "book" will have different methods like "list", "add" or "detail"
    const model = url.pathname.split("/")[1];
    const method = url.pathname.split("/")[2];

    const route = {};
    route[model] = {};
    route[model].method = method;
    route[model].params = searchParams;

    return route;
  }
}
