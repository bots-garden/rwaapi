#!/bin/bash

url_api="$(gp url 8080)"
#rwaapi_token="${ADMIN_RWAAPI_TOKEN}"
rwaapi_admin_token="ILOVEPANDA"
function_name="yo"
wasm_file="yo.wasm"
function_version="0.0.0"
curl -F "${function_name}=@${wasm_file}" \
  -H "Content-Type: multipart/form-data" \
  -H "ADMIN_RWAAPI_TOKEN: ${rwaapi_admin_token}" \
  -X POST ${url_api}/functions/publish/${function_version}
