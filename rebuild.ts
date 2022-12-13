import { execSync } from "child_process"

const build = (option? :string) => {
    if(!option)execSync("tsc -p tsconfig.server.json")
    else execSync("tsc " + option)
    console.log("> build completed!")
}

export default build