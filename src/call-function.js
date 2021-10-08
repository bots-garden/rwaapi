const pkg = require('../libs/rust.wasm.loader')
const { handle, initializeWasm } = pkg

let functionName = process.argv[2]

initializeWasm(`../src/${functionName}/pkg/${functionName}_bg.wasm`).then(() => {
  console.log(handle(
    JSON.stringify({
      name:"Jane Doe"
    }),
    JSON.stringify({
      rwaapi_data: "default data",
      rwaapi_token: "token",
      rwaapi_function_name: functionName,
      rwaapi_function_version: "???"
    })
  )) 

}).catch(error => {
  console.error("😡", error)
})

initializeWasm(`../src/${functionName}/pkg/${functionName}_bg.wasm`).then(() => {
  console.log(handle(
    JSON.stringify({
      name:"John Doe"
    }),
    JSON.stringify({
      rwaapi_data: "default data",
      rwaapi_token: "token",
      rwaapi_function_name: functionName,
      rwaapi_function_version: "???"
    })
  )) 

}).catch(error => {
  console.error("😡", error)
})