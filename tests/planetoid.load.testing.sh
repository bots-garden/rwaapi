#!/bin/bash

url_api=$(gp url 8080)
data='{"name":"Bob"}'


hey -n 10000 -c 1000 -m POST -T "Content-Type: application/json" -H "rwaapi_token:tada" -H "rwaapi_data:hello world" -d ${data} "${url_api}" 

# This opens 1000 connections, and sends 10000 requests. 

