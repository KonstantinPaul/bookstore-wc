/** Some helper functions for loading iframes or preparing data **/
export default class TestHelpers {

  static async loadIframe(url = "http://localhost:8888/index.html") { 
    const iframe = document.createElement("iframe");
    iframe.src = url;
    // hide iframe through opacity, not "display: none", because animations might not trigger
    iframe.style.opacity = 0;
    
    // append iframe to body
    document.body.appendChild(iframe);

    // return iframe, when it contents was loaded completly
    return await new Promise(
      (resolve, reject) => {
        iframe.addEventListener("load", (loadEvent) => {
          resolve(iframe);
        });
    })
  }

  // delay function calls to give page time to react
  // @param ms: time in milliseconds to wait (default: 5)
  static async delay(ms = 5) {
    await new Promise(res => setTimeout(res, ms));
  }

  /*+
   * This method sets input values
   * @param object: An JS object containing key and value.
   *                Where the key symbolizes the "id" to search the form through
   *                and set the value
   *
   * @param formular: <form> element where the inputs are to set
   */ 
  static setInputValues(object, formular) {
    for (const id in object) {
      const inputElement = formular.querySelector(`#${id}`);
      inputElement.value = object[id];
    }
  }
}

