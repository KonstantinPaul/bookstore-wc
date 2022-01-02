import ImportHelper from "../../utils/ImportHelper.js";

// extract basePath relative to current JS file
const basePath = ImportHelper.getCurrentFolderPath(import.meta.url);

// setup app-navigation template
const messageBoxTemplate = document.createElement("template");
messageBoxTemplate.innerHTML = `
<style type="text/css">
  @import "${basePath}/messageBox.css";
  @import "/assets/css/formElements.css";
</style>

<article id="messageBox" class="message-box">
  <h1 class="title">
    <!-- Unicode for "speech balloon" U+1F4AC -->
    <span class="title-logo">&#x1F4AC;</span>
    <span id="titleText" class="title-text">Message</span>
  </h1>
  <p id="messageText" class="message-text"></p>
  <button id="closeButton" class="btn btn-delete btn-message-close">X</button>
</article>
`;

export { messageBoxTemplate };
