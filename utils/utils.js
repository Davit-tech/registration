import querystring from "query-string";

const getRequestBody = async (req) => {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            resolve(body);
        });
        req.on("error", (err) => {
            reject(err);
        });
    });
};

function processUrl(req, port) {
    const {url} = req;
    const {pathname, search} = new URL(`http://localhost:${port}${url}`);
    req.pathname = pathname;
    req.query = querystring.parse(search);
    return req;
}


export {getRequestBody, processUrl};