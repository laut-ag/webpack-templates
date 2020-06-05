#! /bin/env sh
{

set -eu

DEPS="\
acorn \
babel-loader \
clean-webpack-plugin \
copy-webpack-plugin \
css-loader \
cssnano \
file-loader \
html-webpack-plugin \
less-loader \
mini-css-extract-plugin \
postcss-loader \
postcss-preset-env \
resolve-url-loader \
sass-loader \
style-loader \
svg-inline-loader \
terser-webpack-plugin \
underscore-template-loader \
url-loader \
vue-loader \
webpack \
webpack-bundle-analyzer \
webpack-cli \
worker-loader \
@sentry/webpack-plugin \
"

npm i -D "${DEPS}"
}
