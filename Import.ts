const reImport = (path: string) => {
    delete require.cache[require.resolve(path.replace(/.tsx?/, "")+".js")]
    return import(path).then(r=>r)
}

export default reImport