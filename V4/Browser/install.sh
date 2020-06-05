#! /bin/env sh

{

set -eu

REMOTE="https://raw.githubusercontent.com/laut-ag/webpack-configs/V4/Browser/webpack.config.js"
DEPS_REMOTE="https://raw.githubusercontent.com/laut-ag/webpack-configs/V4/Browser/install-deps.sh"
LOCAL="./webpack.config.js"
HAS_CURL=$(command -v curl)
HAS_WGET=$(command -v wget)
GET_DEPS=false

check_for_curl_wget() {
    if [ ! "$HAS_CURL" ] && [ ! "$HAS_WGET" ]; then
        echo "You need curl or wget"
        exit 127
    fi
}

ask_for_deps() {
    printf '%s' "Install dependencies?[y/N]: "
    read -r answer

    if [ "$answer" = "Y" ] || [ "$answer" = "y" ]; then
        check_for_curl_wget
        GET_DEPS=true
    fi
}

check_for_file() {
    if [ -e "$LOCAL" ]; then
        echo "File already exists."
        echo "Move it or back it up and rerun the command"
        exit 127
    fi
}

download_file() {
    if [ "$HAS_WGET" ]; then
        wget -qO- "$LOCAL" "$REMOTE"
    else
        curl -# -o- "$LOCAL" "$REMOTE"
    fi
}

download_deps() {
    if [ $GET_DEPS = false ]; then
        return 0
    fi
    if [ "$HAS_WGET" ]; then
        wget "$DEPS_REMOTE" | sh
    else
        curl -# "$DEPS_REMOTE" | sh
    fi
}

main() {
    check_for_file
    ask_for_deps
    download_file
    download_deps
    exit 0
}

main

}
