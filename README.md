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

## Send "some load" to the RWaAPI web application

Use https://github.com/rakyll/hey

```bash
url_api=http://0.0.0.0:8080
function_name="hello"
function_version="0.0.0"
data='{"name":"Bob"}'
header="DEMO_TOKEN:'hello world'"

hey -n 10000 -c 1000 -m POST -T "Content-Type: application/json" -H "DEMO_TOKEN:hello" -d ${data} "${url_api}/functions/${function_name}/${function_version}" 
```

> Result sample:
```text

Summary:
  Total:        4.6011 secs
  Slowest:      2.4104 secs
  Fastest:      0.0742 secs
  Average:      0.4116 secs
  Requests/sec: 2173.4023
  
  Total data:   570000 bytes
  Size/request: 57 bytes

Response time histogram:
  0.074 [1]     |
  0.308 [3428]  |■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.541 [5316]  |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.775 [550]   |■■■■
  1.009 [185]   |■
  1.242 [188]   |■
  1.476 [40]    |
  1.710 [48]    |
  1.943 [79]    |■
  2.177 [53]    |
  2.410 [112]   |■


Latency distribution:
  10% in 0.2009 secs
  25% in 0.2743 secs
  50% in 0.3448 secs
  75% in 0.3930 secs
  90% in 0.5877 secs
  95% in 1.1330 secs
  99% in 2.3743 secs

Details (average, fastest, slowest):
  DNS+dialup:   0.0257 secs, 0.0742 secs, 2.4104 secs
  DNS-lookup:   0.0044 secs, 0.0000 secs, 0.0891 secs
  req write:    0.0000 secs, 0.0000 secs, 0.0143 secs
  resp wait:    0.3752 secs, 0.0742 secs, 2.0914 secs
  resp read:    0.0000 secs, 0.0000 secs, 0.0053 secs

Status code distribution:
  [200] 10000 responses
```
