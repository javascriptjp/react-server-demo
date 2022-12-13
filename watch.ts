import fs from "fs"
import path from "path"
let fsTimeout
const readSubDirSync = (f) => {
    const result = []
    const r=(m=>{for(const p of fs.readdirSync(m).map((i)=>path.join(m,i)))
    if(fs.statSync(p).isDirectory())r(p);else result.push(p.replace(/\\/g,"/"))});r(f)
    return result
}
const watch = (tgt: string, callback: Function, ms: number) => {
    let lock = false
    fs.watch(tgt, {}, async () => {
        if (!fsTimeout) {
            if (lock) return
            lock = true
            try {await callback()} finally {lock = false}
            fsTimeout = setTimeout(()=>{ fsTimeout=null }, ms)
        }
    })
}

export default watch