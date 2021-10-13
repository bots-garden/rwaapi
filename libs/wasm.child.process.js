const pkg = require('../libs/rust.wasm.loader')
const { handle, initializeWasm } = pkg

global.wasmFunction = null
global.wasmFile = null

function execFunction(message, process) {
  /* --- message structure ---
    {
      cmd: "load",
      wasmFile: wasmFile,
      jsonParameters: jsonParameters,
      headers: headers
    }
  */
  try {
    //console.log("🚀", `executing handle function of ${global.wasmFile}`)
    let result = handle(
      JSON.stringify(message.jsonParameters),
      JSON.stringify(message.headers)
    )
    process.send({success: result})
  } catch(error) {
    //console.error("😡", error)
    process.send({failure: error})
    throw error // 🤔
  }
}

function loadWasmFile(message, process) {
  /* --- message structure ---
    {
      cmd: "load",
      wasmFile: wasmFile,
      wasmFunctionsFolder:"../functions",
      jsonParameters: jsonParameters,
      headers: headers
    }
  */

  initializeWasm(`../${message.wasmFunctionsFolder}/${message.wasmFile}`).then(() => {

    global.wasmFunction = handle
    global.wasmFile = message.wasmFile

    console.log(`🎉 ${message.wasmFile} loaded`)

    execFunction(message, process)
    
  }).catch(error => {
    //console.error(`😡 ${error}`)
    process.send({failure: error})
    throw error // 🤔
  })
}

process.on("message", async (message) => {
  /* --- message structure ---
    {
      cmd: "load",
      wasmFile: wasmFile,
      jsonParameters: jsonParameters,
      headers: headers
    }
  */

  //console.log(`🤖> message received from parent process:`, message)

  switch (message.cmd) {
    case "load":
      loadWasmFile(message, process)
      break;
    
    case "exec": // it comes from a POST request
      execFunction(message, process)
      break;
      
    default:
      break;
  }

})

process.on("exit", (code) => {
  console.log(`🤖> exit code:`, code)
})
