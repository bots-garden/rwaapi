# RWaAPI
Rust WebAssembly Application Programming Interface

> 🚧 this is a work in progress (and a poc)

[![Open in GitPod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/k33g/rwaapi)

## Create a Rust function

### Generate the skeleton

```bash
cargo new --lib hello
```

### Update `Cargo.toml`

Add this to `Cargo.toml`:

```toml
[lib]
name = "hello"
path = "src/lib.rs"
crate-type =["cdylib"]

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
wasm-bindgen = "=0.2.61"
```

### Change `./src/libs.rs`


Replace the content of `./src/libs.rs` by the source code below:

```rust
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct Human {
  name: String
}

#[derive(Serialize, Deserialize, Debug)]
struct Headers {
  demo_token: String
}
#[derive(Serialize, Deserialize, Debug)]
struct Message {
  text: String
}

#[wasm_bindgen]
pub fn handle(parameters: String, headers: String) -> String {

  //  let point1: Point = serde_json::from_str(p1).unwrap();
  let human: Human = serde_json::from_str(&parameters).unwrap();
  let request_headers: Headers = serde_json::from_str(&headers).unwrap();

  let message = Message {
    text: format!("👋 Hello 🤖 {}  | token: {}", human.name, request_headers.demo_token)
  };
  
  return serde_json::to_string(&message).unwrap();
  
}
```

🖐️ the name of the main function is **always** `handle` 🖐️

### Build and "deploy"

- Build the wasm file
  ```bash
  cd hello; wasm-pack build
  ```
- Copy the wasm file to `./functions`
  ```bash
  cp ./pkg/hello_bg.wasm ../../functions/hello_v_0.0.0.wasm
  ```
  🖐️ **always** rename the wasm file like this `${function_name}_v_${function_version}.wasm`

## Start RWaAPI

```bash
npm start
```

## Call the function

### With curl

```bash
url_api=http://0.0.0.0:8080
function_name="hello"
function_version="0.0.0"
data='{"name":"Bob Morane"}'
curl -d "${data}" \
      -H "Content-Type: application/json" \
      -H "DEMO_TOKEN: 'hello world'" \
      -X POST "${url_api}/functions/${function_name}/${function_version}"
```

### With Httpie

```bash
url_api=http://0.0.0.0:8080
function_name="hello"
function_version="0.0.0"
http POST "${url_api}/functions/${function_name}/${function_version}" \
     name=Bob \
     DEMO_TOKEN:"hello world"
```

## Use a forked process to call the function

- The first call will load the wasm file in a new nodejs process, and then call the `handle` function
- The `handle` function is attached to the `global` context of the child process
- The second call will directly call the `handle` function from the `global` context of the child process

### With curl

```bash
url_api=http://0.0.0.0:8080
function_name="hello"
function_version="0.0.0"
data='{"name":"Bob Morane"}'
curl -d "${data}" \
      -H "Content-Type: application/json" \
      -H "DEMO_TOKEN: 'hello world'" \
      -X POST "${url_api}/functions/fork/${function_name}/${function_version}"
```

### With Httpie

```bash
url_api=http://0.0.0.0:8080
function_name="hello"
function_version="0.0.0"
http POST "${url_api}/functions/fork/${function_name}/${function_version}" \
     name=Bob \
     DEMO_TOKEN:"hello world"
```

## Send "some load" to the RWaAPI web application

Use https://github.com/rakyll/hey

```bash
url_api=http://0.0.0.0:8080
function_name="hello"
function_version="0.0.0"
data='{"name":"Bob"}'
header="DEMO_TOKEN:'hello world'"

hey -n 300 -c 150 -m POST -T "Content-Type: application/json" -H "${header}" -d ${data} "${url_api}/functions/${function_name}/${function_version}" 
```

> Result sample:
```text
Summary:
  Total:        0.5082 secs
  Slowest:      0.3363 secs
  Fastest:      0.0094 secs
  Average:      0.1614 secs
  Requests/sec: 590.2821
  
  Total data:   18000 bytes
  Size/request: 60 bytes

Response time histogram:
  0.009 [1]     |■
  0.042 [34]    |■■■■■■■■■■■■■■■■■■
  0.075 [34]    |■■■■■■■■■■■■■■■■■■
  0.107 [19]    |■■■■■■■■■■
  0.140 [15]    |■■■■■■■■
  0.173 [39]    |■■■■■■■■■■■■■■■■■■■■■
  0.206 [74]    |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.238 [23]    |■■■■■■■■■■■■
  0.271 [21]    |■■■■■■■■■■■
  0.304 [23]    |■■■■■■■■■■■■
  0.336 [17]    |■■■■■■■■■


Latency distribution:
  10% in 0.0377 secs
  25% in 0.0855 secs
  50% in 0.1762 secs
  75% in 0.2188 secs
  90% in 0.2850 secs
  95% in 0.3070 secs
  99% in 0.3328 secs

Details (average, fastest, slowest):
  DNS+dialup:   0.0021 secs, 0.0094 secs, 0.3363 secs
  DNS-lookup:   0.0000 secs, 0.0000 secs, 0.0000 secs
  req write:    0.0004 secs, 0.0000 secs, 0.0095 secs
  resp wait:    0.1578 secs, 0.0066 secs, 0.3257 secs
  resp read:    0.0001 secs, 0.0000 secs, 0.0026 secs

Status code distribution:
  [200] 300 responses
```
