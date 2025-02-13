import {EventEmitter} from "events";
import * as fs from "fs/promises";
import path from "path";

const eventEmitter = new EventEmitter();

eventEmitter.on("login", async (req, res) => {
    try {
        const html = await fs.readFile(path.resolve("./views/login.html"), "utf8");
        res.statusCode = 200;

        res.setHeader("Content-Type", "text/html");
        res.end(html);

    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.setHeader("Content-type", "text/html");
        res.end("error");

    }

});
eventEmitter.on("register", async (req, res) => {
    try {
        const html = await fs.readFile(path.resolve("./views/register.html"), "utf8");
        res.statusCode = 200;
        res.setHeader("Content-type", "text/html");
        res.end(html);
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.setHeader("Content-type", "text/html");
        res.end("error");
    }

});

eventEmitter.on("ext", async (req, res) => {
    try {
        const fullStaticPath = path.resolve(`.${req.pathname}`);

        const ext = path.extname(fullStaticPath);
        const contentTypes = {
            ".css": "text/css",
            ".js": "application/javascript",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
        };
        const contentType = contentTypes[ext];

        const fileContent = await fs.readFile(fullStaticPath);
        res.statusCode = 200;
        res.setHeader("Content-Type", contentType);
        res.end(fileContent);
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.setHeader("Content-type", "text/plain");
        res.end("error");
    }

});
eventEmitter.on("userpage", async (req, res) => {
    try {
        const html = await fs.readFile(
            path.resolve("./views/loginview.html"),
            "utf8"
        );
        res.statusCode = 200;

        res.setHeader("Content-type", "text/html");
        res.end(html);
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.setHeader("Content-type", "text/plain");
        res.end("error");
    }

});
eventEmitter.on("registerpage", async (req, res) => {
    try {
        const html = await fs.readFile(path.resolve("./views/login.html"), "utf8");

        res.statusCode = 200;
        res.setHeader("Content-type", "text/html");
        res.end(html);
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.setHeader("Content-type", "text/plain");
        res.end("error");
    }

});

eventEmitter.on("not-found", async (req, res) => {
    res.statusCode = 404;
    res.setHeader("Content-type", "text/plain");
    res.end("Page not found");
});
export default eventEmitter;
