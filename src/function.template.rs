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

  let human: Human = serde_json::from_str(&parameters).unwrap();
  let request_headers: Headers = serde_json::from_str(&headers).unwrap();

  let message = Message {
    text: format!("👋 Hello 🤖 {}  | token: {}", human.name, request_headers.rwaapi_data)
  };

  return serde_json::to_string(&message).unwrap();
}
