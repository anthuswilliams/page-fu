# page-fu

Your source of bananas for all-things routing with
[page.js](https://visionmedia.github.io/page.js/).

                                             ______
                                          .-"""".._'.       _,##
                                   _..__ |.-"""-.|  |   _,##'`-._
                                  (_____)||_____||  |_,##'`-._,##'`
                                  _|   |.;-""-.  |  |#'`-._,##'`
                               _.;_ `--' `\    \ |.'`\._,##'`
                              /.-.\ `\     |.-";.`_, |##'`
                              |\__/   | _..;__  |'-' /
                              '.____.'_.-`)\--' /'-'`
                               //||\\(_.-'_,'-'`
                             (`-...-')_,##'`
                      jgs _,##`-..,-;##`
                       _,##'`-._,##'`
                    _,##'`-._,##'`
                      `-._,##'`

The [[package | page-fu]] exposes a [[construct | Route]], a few [[helpers |
Router]], and a bunch of decorators to provide some structure around routing
with page.js.

While page.js is elegant and powerful, building an application around it will
usually lead to the creation of some constructs and abstractions. page-fu is a
collection of such abstractions that will support your routing logic.

## Installation

Install the package from NPM:

    npm install --save page-fu

Please note that the sources are distributed in ES6 format and require a module
loader like [webpack](https://webpack.js.org/) or
[browserify](http://browserify.org/) to work. I am not interested in
distributing compiled versions.

## What's inside

The main value of this package is the [[route handling construct | Route]] that
aids in managing routing logic. It decorates your existing route handlers (what
you pass to [`page(String,
Function|Object)`](https://visionmedia.github.io/page.js/#pagepath-callback-
callback-)) with extra functionality in a way that is not obtrusive.

Moreover, the package focuses on the testability of route handlers so you will
find that everything it provides is (somewhat) easily testable. Minimal voodoo
involved - promise!

Get started by looking into the [[Route]] construct. You can also refer to the
the [[package | page-fu]] reference to see what symbols are exported for your
use and how to use them if you're unfamiliar with ES6 packages.

## Testing

Refer to the [[testing guide | ./doc/testing.md]] to learn how to test every
inch of your route handlers.