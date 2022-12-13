import express from "express"
import { getSession } from "next-auth/react"

export default async function NextAuth(req: express.Request, res: express.Response){
    const session = await getSession({ req })
    if (session) res.status(200).json({ ok: true, session })
    else res.status(401).json({ ok: false, message: "Unauthenticated" })
}