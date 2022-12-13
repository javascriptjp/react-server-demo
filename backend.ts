import { SetRouter, Router, Get } from "./decorator"

@SetRouter("/backend")
export default class Routes extends Router {
    @Get("/next-auth")
    NextAuth(){}
}