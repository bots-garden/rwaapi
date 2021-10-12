// 🚧 WIP
const http = require('http')
const port = process.env.PORT || 8080

const pkg = require('./libs/rust.wasm.loader')
const { handle, initializeWasm } = pkg

let functionName = process.argv[2]
let functionVersion = process.argv[3]

let wasmFile = `${functionName}_v_${functionVersion}.wasm`

// Run: node planetoid.js hello 0.0.0 
// Call: http POST $(gp url 8080) name=bob rwaapi_data:"hello world" rwaapi_token:"tada"

const requestHandler = (request, response) => {

  response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})

  let body = ''
  request.on('data', chunk => {
    body += chunk.toString() // convert Buffer to string
  })
  request.on('end', () => {
    if(request.headers["rwaapi_data"] === undefined) { request.headers["rwaapi_data"] = `` }
    if(request.headers["rwaapi_token"] === undefined) { request.headers["rwaapi_token"] = `` }
    if(request.headers["rwaapi_function_name"] === undefined) { request.headers["rwaapi_function_name"] = functionName }
    if(request.headers["rwaapi_function_version"] === undefined) { request.headers["rwaapi_function_version"] = functionVersion }
    
    response.end(handle(body, JSON.stringify(request.headers)))
  })
}

initializeWasm(`../functions/${wasmFile}`).then(() => {
  console.log("🎉", handle)
  const server = http.createServer(requestHandler)

  server.listen(port, (err) => {
    if (err) {
      return console.log('😡 something bad happened', err)
    }
    console.log(`🌍 server is listening on ${port}`)
  })
}).catch(error => {
  console.error("😡", error)
})
