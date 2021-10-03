# Create a new function

```bash
cargo new --lib hello
```

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

Change `./src/libs.rs`

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
      text: String::from("👋 Hello ") + &String::from(human.name) + " | token: " + &String::from(request_headers.demo_token)
  };

  return serde_json::to_string(&message).unwrap();
  
}
```

```bash
cd hello; wasm-pack build
```