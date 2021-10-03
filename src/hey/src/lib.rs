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

  let headers_option = Some(headers);
  let parameters_option = Some(parameters);

  let request_headers: Headers = match headers_option {
    None => {
      Headers {
        demo_token: "".to_string()
      }
    }
    Some(headers) => {
      let request_headers: Headers = serde_json::from_str(&headers).unwrap();
      request_headers
    }
  };

  let human: Human = match parameters_option {
    None => {
      Human {
        name: "John Doe".to_string()
      }
    }
    Some(parameters) => {
      let human: Human = serde_json::from_str(&parameters).unwrap();
      human
    }
  };

  let text_content = format!("👋 Hey 😃 {}  | token: {}", human.name, request_headers.demo_token);

  let message = Message {
    text: text_content
  };

  return serde_json::to_string(&message).unwrap();
}
