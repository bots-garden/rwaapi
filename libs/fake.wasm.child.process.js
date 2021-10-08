
global.wasmFunction = null
global.wasmFile = null

function execFunction(message, process) {
  let result = {
    text: `👋 Hello 🤖 Bill Ballantine  | header[rwaapi_data]: ${message.headers["rwaapi_data"]}`
  }
  process.send({success: JSON.stringify(result)})
}

function loadWasmFile(message, process) {

  console.log(`🎉 ${message.wasmFile} loaded`)
  execFunction(message, process)

}

process.on("message", async (message) => {

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
