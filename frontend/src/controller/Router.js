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
             // params could be transformed to array to process multiple params
             "params": {
                 "<param>": "<value>"
             }
         }
     }
   */
  #extractRoute(hash) {
    const route = {};
    const s = hash.split("/");
    const model = s[1]; // s[1], because first index is unused
    // set <model> for e.g. book
    route[model] = {}; // s[1], because first index is unused

    const viewWithParams = s[s.length - 1].split("?");
    const [methodName, paramsString] = viewWithParams;
    route[model].method = methodName; // set method for e.g. list or add

    // check if parameters are set
    route[model].params = {};
    if (viewWithParams.length === 2) {
      const firstParamString = paramsString.split("&", 1)[0];

      // set params, when string is not empty
      if (firstParamString) {
        const param = firstParamString.split("=")[0];
        const paramValue = firstParamString.split("=")[1];

        // decoded and trimmed paramValue
        route[model].params[param] = decodeURIComponent(paramValue).trim();
      }
    }

    return route;
  }
}
