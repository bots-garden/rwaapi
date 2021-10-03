#!/bin/bash
function_name=$1
cargo new --lib ${function_name}

echo 'serde = { version = "1.0", features = ["derive"] }' >> ./${function_name}/Cargo.toml
echo 'serde_json = "1.0"' >> ./${function_name}/Cargo.toml
echo 'wasm-bindgen = "=0.2.61"' >> ./${function_name}/Cargo.toml

echo '' >> ./${function_name}/Cargo.toml

echo '[lib]' >> ./${function_name}/Cargo.toml
echo "name = \"${function_name}\"" >> ./${function_name}/Cargo.toml
echo 'path = "src/lib.rs"' >> ./${function_name}/Cargo.toml
echo 'crate-type =["cdylib"]' >> ./${function_name}/Cargo.toml

cp function.template.rs ./${function_name}/src/lib.rs
