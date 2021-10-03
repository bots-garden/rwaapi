#!/bin/bash
function_name=$1
function_version=$2

cp ./${function_name}/pkg/${function_name}_bg.wasm ../functions/${function_name}_v_${function_version}.wasm

