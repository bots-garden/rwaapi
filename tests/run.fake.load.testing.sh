#!/bin/bash

url_api=$(gp url 8080)
function_name="hello"
function_version="0.0.0"
data='{"name":"Bob"}'


hey -n 10000 -c 1000 -m POST -T "Content-Type: application/json" -H "rwaapi_token:tada" -d ${data} "${url_api}/fake/functions/${function_name}/${function_version}" 

# This opens 1000 connections, and sends 10000 requests. 

