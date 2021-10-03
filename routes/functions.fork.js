// 🚧 wip

/*
- check if the function is already loaded
- if not, load the function in memory and call it
- if yes, call it

*/

async function wasmForkFunctions (fastify, options) {
  fastify.post(`/functions/fork/:function_name/:function_version`, async (request, reply) => {
    let jsonParameters = request.body
    let headers = request.headers
    let functionName = request.params.function_name
    let functionVersion = request.params.function_version
    
    let wasmFile = `${functionName}_v_${functionVersion}.wasm`

    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({message: "🚧 this is a work in progress"})
  })
}

module.exports = wasmForkFunctions