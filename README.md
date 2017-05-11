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

## `Route: Function`

The `Route` export of this package allows you to define a route handler.

A route handler is responsible for preparing the data needed to render the UI
and perform any interactions with external services (like the API) on the UI's
behalf.

Route handlers are equipped with a few tools under their belts to make your
life convenient but there's very little magic involved.

### Route activation

A route becomes activated when a transition is dispatched with a path that
exactly matches the path it was registered for. For example, consider the
following route definitions:

```javascript
// screens/A/route.js
export default { path: '/patients/new' };

// screens/B/route.js
export default { path: '/patients/:id' };
```

The route handler for screen A will be considered active IFF the pathname is
`/patients/new` and not `/patients/3`. `pamm-routing` will consider this to be
your intent when it scans your routes and arranges the routes in the correct
order to achieve this behavior.

### Route life-cycle

At the very minimum, a route handler is a function that accepts a context
and a `next` callback:

```javascript
import { redirectTo } from 'pamm-routing';

export default function mySimpleRoute(ctx, next) {
  if (isLoggedIn()) {
    redirectTo('/member');
  }
  else {
    redirectTo('/login')
  }
}
```

### Route state

Each Route handler has a private [[state | PAMMRouting.Route]] that it may
utilize to store things during its lifetime.