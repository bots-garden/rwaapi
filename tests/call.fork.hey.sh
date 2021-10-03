#!/bin/bash

url_api=$(gp url 8080)
function_name="hey"
function_version="0.0.0"
http POST "${url_api}/functions/fork/${function_name}/${function_version}" \
    name=Bob \
    DEMO_TOKEN:"hello world"

http POST "${url_api}/functions/fork/${function_name}/${function_version}" \
    name=John \
    DEMO_TOKEN:"hello people"

