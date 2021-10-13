// 🚧
const fs = require('fs')

function streamToFile({isString, stream}) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err) => reject(err))
    if(isString) {
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    } else {
      stream.on('end', () => resolve(Buffer.concat(chunks)))
    }
  })
}

/*
```bash
url_api="http://localhost:8080"
rwaapi_token="${ADMIN_RWAAPI_TOKEN}"
function_name="yo"
wasm_file="yo.wasm"
function_version="0.0.0"
curl -F "${function_name}=@${wasm_file}" \
  -H "Content-Type: multipart/form-data" \
  -H "ADMIN_RWAAPI_TOKEN: ${rwaapi_token}" \
  -X POST ${url_api}/functions/publish/${function_version}


url_api="$(gp url 8080)"
rwaapi_token="${ADMIN_RWAAPI_TOKEN}"
function_name="yo"
wasm_file="yo.wasm"
function_version="0.0.0"
curl -F "${function_name}=@${wasm_file}" \
  -H "Content-Type: multipart/form-data" \
  -H "ADMIN_RWAAPI_TOKEN: ${rwaapi_token}" \
  -X POST ${url_api}/functions/publish/${function_version}
```

*/

async function deployWasmFunction (fastify, options) {

  // 🔐 Route protection
  fastify.addHook('onRequest', async (request, reply) => {
    let token = request.headers["admin_rwaapi_token"]
    if (options.adminRwaapiToken==="" || options.adminRwaapiToken===token) {
      // all good
    } else {
      reply.code(401).send({
        failure: "😡 Unauthorized",
        success: null
      })
    }
  })

  let wasmFunctionsFolder = options.wasmFunctionsFolder

  fastify.post(`/functions/publish/:version`, async (request, reply) => {
    let version = request.params.version
    const data = await request.file()

    /* properties of data
      data.file // stream
      data.fields // other parsed parts
      data.fieldname
      data.filename
      data.encoding
      data.mimetype
    */
    
    // check the name
    let wasmFileName = `${data.fieldname}_v_${version}.wasm`
    
    try {
      // Get the file from the stream
      const wasmFile = await streamToFile({isString:false, stream:data.file})
      // Write the file on disk
      // ${wasmFunctionsFolder}
      fs.writeFileSync(`./functions/${data.fieldname}_v_${version}.wasm`, wasmFile)

      reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({result: `${wasmFileName} deployed`})

    } catch(error) {
      console.log("😡", error)
      reply.send({
        failure: "error when loading wasm file",
        success: null
      })
    }
  
  })

}

module.exports = deployWasmFunction
