const fastify = require('fastify')({ logger: true })
const path = require('path')

// Serve the static assets
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/'
})

fastify.register(require('fastify-formbody'))
fastify.register(require('fastify-multipart'))

// Environment variables
const adminRwaapiToken = process.env.ADMIN_RWAAPI_TOKEN || ""

const wasmProcesses = {}

// 👋 execute the function
fastify.register(require('./routes/functions.js'), {
  wasmProcesses: wasmProcesses,
  wasmFunctionsFolder: "functions"
})

// 👋 remotely deploy a function
fastify.register(require('./routes/deploy.js'), {
  wasmProcesses: wasmProcesses,
  adminRwaapiToken: adminRwaapiToken,
  wasmFunctionsFolder: "functions"
})

// 🖐️ this route allows to compare load testing results
fastify.register(require('./routes/fake.functions.js'), {
  wasmProcesses: wasmProcesses
})

const start = async () => {
  try {
    await fastify.listen(8080, "0.0.0.0")
    fastify.log.info(`server listening on ${fastify.server.address().port}`)

  } catch (error) {
    fastify.log.error(error)
  }
}
start()
