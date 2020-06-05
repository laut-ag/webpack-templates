# LAUT AG Webpack template repo

## Purpose

Provide a centralized repository for example webpack templates that we can use and extend for our projects.

## Installation

- Dependencies:
  - `curl 'https://raw.githubusercontent.com/laut-ag/webpack-configs/<Version>/<Environment>/install-deps.sh' | sh`
- Template: `curl 'https://raw.githubusercontent.com/laut-ag/webpack-configs/<Version>/<Environment>/install.sh' | sh`
  - This option _offers_ to automatically install the dependencies for you
    - you need to have `wget` or `curl` installed for this to work, the script will automatically detect which to use

ex.
```sh
curl 'https://raw.githubusercontent.com/laut-ag/webpack-configs/V4/Browser/install-deps.sh | sh'
```

## Usage

Use these as jumping off points for configuring webpack in a project. It is unlikely that the config will work out of the box as each project is different. Many options can be configrued in the functions and variables located near the top of the main function in the file. These should help you from having to hunt around in the config to make sure that you have all of your public paths set correctly, which can be quite frustrating when you are dealing with one path for development and another for release.

I have tried to comment the configurations to help in configuration and options which may not seem obvious without reading the docs.

In each folder you can find a README.md with a listing of dependencies and links to the documentation to those dependencies. Hopefully they are up to date, if not, please submit a pull request.

## Directory Structure

Directories are by version and environment/use

    ```
    |- .
      |- V4
        |- Browser
          |- README.md
          |- webpack.config.js
          |- install.sh
          |- install-deps.sh
        |- Node
      | V5
        |- Browser
        |- Node
    ```

