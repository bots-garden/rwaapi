const pkg = require('../libs/rust.wasm.loader')
const { handle, initializeWasm } = pkg

initializeWasm('../src/hello/pkg/hello_bg.wasm').then(() => {
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
