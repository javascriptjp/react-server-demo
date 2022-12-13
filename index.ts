import express, { Request, Response } from "express"
import next from "next"
import backendRouter from "./backend"
import { parse } from "url"
const PORT = 3000
const dev = process.env.NODE_ENV !== "production"
const app = next({dev})
const handle = app.getRequestHandler()
app.prepare().then(async () => {
    const server = express()
    if(dev) {
        server.use(new backendRouter().route)
    } else server.use(new backendRouter().route)
    server.use(async (req, res, next) => {
        try {
            const parsedUrl = parse(req.url, true)
            const { pathname, query } = parsedUrl
            if (pathname === "/a") {
                await app.render(req, res, "/a", query)
            } else if (pathname === "/b") {
                await app.render(req, res, "/b", query)
            } else {
                await handle(req, res, parsedUrl)
            }
        } catch (err) {
            console.error("Error occurred handling", req.url, err)
            res.statusCode = 500
            res.end("internal server error")
        }
    })
    server.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`)
    })
}).catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
})