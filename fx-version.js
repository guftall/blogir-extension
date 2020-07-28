/*!
 * blogir-extension
 * Copyright(c) 2020 Omid Dehghani
 * MIT Licensed
 */

const manifestPath = './firefox/manifest.json'

let manifest = require(manifestPath)

console.log('previous version: ', manifest.version)

let tagArg = process.argv[2]
const tag = tagArg + '.selfdist'
console.log(`versioning Add-on to: ${tag}`)

manifest.version = tag

require('fs').writeFileSync(manifestPath, JSON.stringify(manifest))
