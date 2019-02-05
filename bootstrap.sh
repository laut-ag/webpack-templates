#!/bin/bash

WD=$1

if [[ -f "$WD/webpack.config.js" ]]
then
    echo -e "$WD/webpack.config.js already exists. Not copying."
else
    cp ./index.js $WD/webpack.config.js
fi
