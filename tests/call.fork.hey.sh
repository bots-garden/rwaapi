#!/bin/bash

url_api=$(gp url 8080)
function_name="hey"
function_version="0.0.1"
http POST "${url_api}/functions/fork/${function_name}/${function_version}" \
    name=Bob \
    DEMO_TOKEN:"hello world"