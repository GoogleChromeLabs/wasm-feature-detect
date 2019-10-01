#!/bin/bash

curl -L https://github.com/WebAssembly/wabt/releases/download/1.0.12/wabt-1.0.12-linux.tar.gz | tar -xz -C /opt -f -

export PATH=$(echo /opt/wabt-*)/:$PATH

cd /usr/src
npm i
npm run build:website