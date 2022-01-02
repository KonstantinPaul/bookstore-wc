import nodeStatic from "node-static";
import http from "http";
import path from "path";

try {
    const __dirname = path.resolve("frontend");
    const file = new(nodeStatic.Server)(__dirname);
    const port = 8888;
    http.createServer(function(req, res) {
        file.serve(req, res);
    }).listen(port);

    console.info(`Server servers files under port: ${port}`);
    console.info(`If you want to see test results go to: http://localhost:${port}/test/index.html`);
    console.info(`Otherwise feel free to look around in our awesome book store app.`);
} catch (err) {
    console.error(err);
}
