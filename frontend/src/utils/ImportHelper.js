export default class ImportHelper {

  /*
   * This methods extract the current base path from an URL
   * An example:  
   * - input: "/some/foo/bar.js" 
   * - output: "/some/foo"
   *
   * @param url in addition you can pass another absolute URL
   */
  static getCurrentFolderPath(url) {
    const currentScriptURL = new URL(url, location);
    const pathNames = currentScriptURL.pathname.split("/");
    const folderPath = pathNames.slice(0, pathNames.length-1).join("/");

    return folderPath;
  }

}
