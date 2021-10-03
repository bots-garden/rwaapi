const pkg = require('../libs/rust.wasm.loader')
const { handle, initializeWasm } = pkg

let functionName = process.argv[2]

initializeWasm(`../src/${functionName}/pkg/${functionName}_bg.wasm`).then(() => {
  console.log(handle(
    JSON.stringify({
      name:"Bob Morane"
    }),
    JSON.stringify({
      demo_token: "this is a token"
    })
  )) 

}).catch(error => {
  console.error("😡", error)
})

initializeWasm(`../src/${functionName}/pkg/${functionName}_bg.wasm`).then(() => {
  console.log(handle(
    JSON.stringify({
      name:"Bob Morane"
    }),
    JSON.stringify({
      demo_token: "this is another token"
    })
  )) 

}).catch(error => {
  console.error("😡", error)
})