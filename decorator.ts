import 'reflect-metadata'
import * as express from 'express'
export abstract class Router {readonly route!: express.Router}
import Import from "./Import"
import watch from "./watch"
import build from "./rebuild"
const dev = process.env.NODE_ENV !== "production"
const ACTION_KEY = Symbol('action')
const imports = {}
interface ActionMetadata {
    path: string;
    method: 'get' | 'post'
    actionName: string
}

function mapFactory(method: ActionMetadata['method']) {
    return (path: string = '/') =>
        (target: any, actionName: string, dsc: PropertyDescriptor) => {
            const meta: ActionMetadata = { path, method, actionName }
            addMetadata(meta, target, ACTION_KEY)
        }
}

function addMetadata<T>(value: T, target: any, key: Symbol, propKey?: string) {
    const list = Reflect.getMetadata(key, target, propKey)
    if (list) {
        list.push(value)
        return
    }
    Reflect.defineMetadata(key, [value], target, propKey);
}

export function SetRouter(path: string) {
    return (rout: new () => Router) => class extends rout {
        constructor () {
            super()
            const route = express.Router()
            const list: ActionMetadata[] = Reflect.getMetadata(ACTION_KEY, rout.prototype)
            if(dev) {
                console.log("> express dev mode is true!")
                watch("./server"+path, ()=>{
                    console.log("> building...");build()
                }, 300)
            }
            for (const meta of list) {
                imports[path+meta.path] = Import("."+path+meta.path).then(r=>r.default)
                if(dev){
                    route[meta.method](meta.path,(req: express.Request, res: express.Response)=>{
                        Import("."+path+meta.path).then(r=>r.default(req,res))
                    })
                } else {
                    route[meta.method](meta.path,(req: express.Request, res: express.Response)=>{
                        imports[path+meta.path].then(r=>r(req,res))
                    })
                }
            }
            (this as any).route = express.Router()
            this.route.use(path, route)
        }
    } as any
}

export const Get = mapFactory('get')
export const Post = mapFactory('post')