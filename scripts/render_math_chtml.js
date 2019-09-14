#! /usr/bin/env -S node -r esm

/*************************************************************************
 *
 *  direct/tex2chtml-page
 *
 *  Uses MathJax v3 to convert all TeX in an HTML document.
 *
 * ----------------------------------------------------------------------
 *
 *  Copyright (c) 2018 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

//
//  Load the packages needed for MathJax
//
const mathjax = require('mathjax-full/js/mathjax.js').mathjax;
const TeX = require('mathjax-full/js/input/tex.js').TeX;
const CHTML = require('mathjax-full/js/output/chtml.js').CHTML;
const liteAdaptor = require('mathjax-full/js/adaptors/liteAdaptor.js').liteAdaptor;
const RegisterHTMLHandler = require('mathjax-full/js/handlers/html.js').RegisterHTMLHandler;

const AllPackages = require('mathjax-full/js/input/tex/AllPackages.js').AllPackages;

//
//  Get the command-line arguments
//
var argv = require('yargs')
    .demand(1).strict()
    .usage('$0 [options] file.html > converted.html')
    .options({
        em: {
            default: 16,
            describe: 'em-size in pixels'
        },
        ex: {
            default: 8,
            describe: 'ex-size in pixels'
        },
        packages: {
            default: AllPackages.sort().join(', '),
            describe: 'the packages to use, e.g. "base, ams"'
        },
        fontURL: {
            default: 'https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/output/chtml/fonts/woff-v2',
            describe: 'the URL to use for web fonts'
        }
    })
    .argv;

//
//  Read the HTML file
//
const htmlfile = require('fs').readFileSync(argv._[0], 'utf8');

//
//  Create DOM adaptor and register it for HTML documents
//
const adaptor = liteAdaptor({fontSize: argv.em});
RegisterHTMLHandler(adaptor);

//
//  Create input and output jax and a document using them on the content from the HTML file
//
const tex = new TeX({packages: argv.packages.split(/\s*,\s*/), inlineMath: [['$', '$'], ['\\(', '\\)']] });
const chtml = new CHTML({fontURL: argv.fontURL, exFactor: argv.ex / argv.em});
const html = mathjax.document(htmlfile, {InputJax: tex, OutputJax: chtml});

//
//  Typeset the document
//
html.render();

//
//  Output the resulting HTML
//
console.log(adaptor.outerHTML(adaptor.root(html.document)));