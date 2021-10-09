const fastify = require('fastify')({ logger: true })
const path = require('path')

// 🧰 Initialize sttings
httpPort = process.env.HTTPS_PORT || 8080
maxListeners = process.env.MAX_LISTENERS || 1000

// Avoid: `MaxListenersExceededWarning: Possible EventEmitter memory leak detected`
require('events').setMaxListeners(maxListeners)

// Serve the static assets
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/'
})

const wasmProcesses = {}

fastify.register(require('./routes/functions.js'), {
  wasmProcesses: wasmProcesses
})

// this route allows to compare load testing results
fastify.register(require('./routes/fake.functions.js'), {
  wasmProcesses: wasmProcesses
})

const start = async () => {
  try {
    await fastify.listen(httpPort, "0.0.0.0")
    fastify.log.info(`server listening on ${fastify.server.address().port}`)

  } catch (error) {
    fastify.log.error(error)
  }
}
start()
