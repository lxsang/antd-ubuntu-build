#! /bin/bash

# exit on error
set -e

if [ -z "$1" ]
then
    echo "Please specify the version of the server"
    exit 1
else
    mkdir -p /tmp/antd
    echo "Downloading antd version $1"
    cd /tmp/antd
    wget --no-check-certificate "https://github.com/lxsang/ant-http/raw/master/dist/antd-$1.tar.gz"
    [[ -f "antd-$1.tar.gz" ]] || { echo "Fail to download the source tarball"; exit 1; }
    echo "extracting source..."
    tar xzf "antd-$1.tar.gz"
    [[ -d "antd-$1" ]] || { echo "Cannot extract the tarball"; exit 1; }
    cd "antd-$1"
    ./configure --prefix=/usr --enable-debug=yes
    make
    sudo make install
    echo "Server installed"
fi
