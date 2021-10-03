const pkg = require('../libs/rust.wasm.loader')
const { handle, initializeWasm } = pkg

const spawn = require('child_process').spawn

function execute(wasmFile, jsonParameters, headers, request, reply, options, fastify) {

  initializeWasm(`../functions/${wasmFile}`).then(() => {

    let result = handle(
      JSON.stringify(jsonParameters),
      JSON.stringify(headers)
    )
    fastify.log.info(`🤖 ${result}`)
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({success: JSON.parse(result)})
  }).catch(error => {
    fastify.log.error(`😡 ${error}`)
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .code(500)
      .send({failure: error})
  })

}

async function wasmFunctions (fastify, options) {
/*
```bash
url_api=$(gp url 8080)
function_name="hey"
function_version="0.0.0"
data='{"name":"Bob Morane"}'
curl -d "${data}" \
      -H "Content-Type: application/json" \
      -H "DEMO_TOKEN: 'hello world'" \
      -X POST "${url_api}/functions/${function_name}/${function_version}"

url_api=$(gp url 8080)
function_name="hey"
function_version="0.0.0"
http POST "${url_api}/functions/${function_name}/${function_version}" \
     name=Bob \
     DEMO_TOKEN:"hello world"

url_api=$(gp url 8080)
function_name="hello"
function_version="0.0.0"
http POST "${url_api}/functions/${function_name}/${function_version}" \
     name="Jane Doe" \
     DEMO_TOKEN:hello
``` 
*/
  fastify.post(`/functions/:function_name/:function_version`, async (request, reply) => {
    let jsonParameters = request.body
    let headers = request.headers
    let functionName = request.params.function_name
    let functionVersion = request.params.function_version
    
    let wasmFile = `${functionName}_v_${functionVersion}.wasm`

    execute(wasmFile, jsonParameters, headers, request, reply, options, fastify)
    
    await reply
  })

}

module.exports = wasmFunctions
