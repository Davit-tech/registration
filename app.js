import http from "http";
import querystring from "query-string";
import eventEmitter from "./utils/events.js";
import * as fs from "fs/promises";
import {getRequestBody, processUrl} from "./utils/utils.js";


const port = 3000;
const hostname = "127.0.0.1";


const server = http.createServer(async (req, res) => {
    try {
        const {pathname, method} = processUrl(req, port);

        if (method === "GET" && ["/", "/login"].includes(pathname)) {
            eventEmitter.emit("login", req, res);
            return;
        }

        if (method === "GET" && pathname === "/register") {
            eventEmitter.emit("register", req, res);
            return;
        }
        if (method === "GET" && pathname.startsWith("/public/")) {
            eventEmitter.emit("ext", req, res);
            return;
        }

        if (method === "POST" && pathname === "/register") {
            const body = await getRequestBody(req);
            const formData = querystring.parse(body);


            const jsonData = {
                userEmail: formData.userEmail,
                username: formData.username,
                password: formData.password,
            };
            if (!formData.userEmail || !formData.username || !formData.password) {
                res.writeHead(400, {"Content-Type": "text/plain"});
                res.end("datark en inputner");
                return;
            }


            let users = [];
            try {
                const fileData = await fs.readFile("./userinfo.json", "utf-8");
                users = JSON.parse(fileData);
            } catch (err) {
                console.log("creating new file");
            }
            const userHave = users.find((user) => {
                return user.userEmail === jsonData.userEmail;
            });
            if (userHave) {

                res.writeHead(400, {"Content-Type": "text/plain"});
                res.end("Arden ka user");
                return;
            }
            users.push(jsonData);

            await fs.writeFile("./userinfo.json", JSON.stringify(users, null, 2));

            eventEmitter.emit("registerpage", req, res);

            return;
        }

        if (method === "POST" && pathname === "/login") {
            const body = await getRequestBody(req);
            const {userEmail, password} = querystring.parse(body);

            let users;
            try {
                const fileData = await fs.readFile("./userinfo.json", "utf-8");
                users = JSON.parse(fileData);
            } catch (err) {
                console.error(err)
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.end(`Error reading users file `);
                return []
            }

            const user = users.find(
                (user) => user.userEmail === userEmail && user.password === password
            );

            if (user) {
                eventEmitter.emit("userpage", req, res);
            } else {
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.end("Invalid username or password");
            }
            return;
        }

        eventEmitter.emit("not-found", req, res);
    } catch (err) {
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.end("Error receiving data");
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at https://${hostname}:${port}/`);
});
console.log("hi")
