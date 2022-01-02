import ImportHelper from "../../utils/ImportHelper.js";

// extract basePath relative to current JS file
const basePath = ImportHelper.getCurrentFolderPath(import.meta.url);

// setup app-navigation template
const appHeaderTemplate = document.createElement("template");
appHeaderTemplate.innerHTML = `
<style type="text/css">
  @import "/assets/css/formElements.css";
  @import "${basePath}/appHeader.css";
</style>

<header id="header">
  <section class="header-info">
    <!-- Unicode U+1F4DC -->
    <h1 class="title">
      <span class="header-logo">&#x1F4DC;</span>
      <span id="titleText">The Bookstore</span>
    </h1>
    <p id="leadText" class="lead">
      Und die letzte, unglaublich wichtige achte Regel: Lies Bücher.
      Das sind diese Dinger, bei denen Vorspulen 'Blättern' heißt.
    </p>
  </section>
  <section class="theme-section">
    <input id="themeSwitch" type="checkbox">
    <label id="themeLabel" for="themeSwitch">
    Dark Theme
    </label>
  </section>
</header>
`;

export { appHeaderTemplate };
