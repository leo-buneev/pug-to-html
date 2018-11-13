pug-to-html
===========

CLI tool to convert your pug code to html code. Supports Vue Single File Components!

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/pug-to-html.svg)](https://npmjs.org/package/pug-to-html)
[![Downloads/week](https://img.shields.io/npm/dw/pug-to-html.svg)](https://npmjs.org/package/pug-to-html)
[![License](https://img.shields.io/npm/l/pug-to-html.svg)](https://github.com/leo-buneev/pug-to-html/blob/master/package.json)

<!-- toc -->
# Usage
```
yarn global add pug-to-html
pug-to-html [PATH]
```
### Arguments

- PATH  Path to the directory where with vue files. Defaults to current working directory

### Options

- -h, --help     show CLI help
- -v, --version  show CLI version

### Description

This tool will recursively scan provided path, and replace pug code with html code.

- For *.pug files, it will replace entire file contents and rename it to *.html
- For *.vue files, it will find <template lang="pug"> sections and replace their contents with HTML
