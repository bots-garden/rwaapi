# RWaAPI
Rust WebAssembly Application Programming Interface

> 🚧 this is a work in progress (and a poc)

[![Open in GitPod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/bots-garden/rwaapi)

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
  rwaapi_data: String,
  rwaapi_token: String,
  rwaapi_function_name: String,
  rwaapi_function_version: String
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
    text: format!("👋 Hello 🤖 {}  | header[rwaapi_data]: {}", human.name, request_headers.rwaapi_data)
  };
  
  return serde_json::to_string(&message).unwrap();
  
}
```

🖐️ the name of the main function is **always** `handle` 🖐️

> **Remark**: the header fields have default values:
> ```
> rwaapi_data = ``
> rwaapi_token = ``
> rwaapi_function_name = <function_name>
> rwaapi_function_name = <function_version>
> ```
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
      -H "rwaapi_data: 'hello world'" \
      -H "rwaapi_token: 'tada'" \
      -X POST "${url_api}/functions/${function_name}/${function_version}"
```

### With Httpie

```bash
url_api=http://0.0.0.0:8080
function_name="hello"
function_version="0.0.0"
http POST "${url_api}/functions/${function_name}/${function_version}" \
     name=Bob \
     rwaapi_data:"hello world" \
     rwaapi_token:"tada"
```

## Send "some load" to the RWaAPI web application

Use https://github.com/rakyll/hey

```bash
url_api=http://0.0.0.0:8080
function_name="hello"
function_version="0.0.0"
data='{"name":"Bob"}'

hey -n 10000 -c 1000 -m POST -T "Content-Type: application/json" -H "DEMO_TOKEN:hello" -d ${data} "${url_api}/functions/${function_name}/${function_version}" 
```

> Result sample:
```text
Summary:
  Total:        4.0310 secs
  Slowest:      1.7627 secs
  Fastest:      0.0306 secs
  Average:      0.3824 secs
  Requests/sec: 2480.7763
  
  Total data:   660000 bytes
  Size/request: 66 bytes

Response time histogram:
  0.031 [1]     |
  0.204 [1145]  |■■■■■■■■
  0.377 [5941]  |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.550 [1893]  |■■■■■■■■■■■■■
  0.723 [0]     |
  0.897 [190]   |■
  1.070 [20]    |
  1.243 [84]    |■
  1.416 [491]   |■■■
  1.590 [0]     |
  1.763 [235]   |■■


Latency distribution:
  10% in 0.1980 secs
  25% in 0.2410 secs
  50% in 0.2643 secs
  75% in 0.3910 secs
  90% in 0.7934 secs
  95% in 1.2554 secs
  99% in 1.7211 secs

Details (average, fastest, slowest):
  DNS+dialup:   0.0521 secs, 0.0306 secs, 1.7627 secs
  DNS-lookup:   0.0312 secs, 0.0000 secs, 0.3706 secs
  req write:    0.0001 secs, 0.0000 secs, 0.0429 secs
  resp wait:    0.3256 secs, 0.0306 secs, 1.3574 secs
  resp read:    0.0002 secs, 0.0000 secs, 0.0146 secs

Status code distribution:
  [200] 10000 responses
```
