#!/bin/bash

mkdir wabt
curl -L https://github.com/WebAssembly/wabt/releases/download/1.0.15/wabt-1.0.15-linux.tar.gz | tar -xz -C ./wabt

export PATH=$(echo $PWD/wabt/wabt-*)/:$PATH

npm run build:website
