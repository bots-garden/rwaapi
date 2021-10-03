#!/bin/bash
function_name=$1
cd ${function_name}; wasm-pack build
