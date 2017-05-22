## 1.0.2

- `withProps` is now idempotent to prevent it from throwing errors itself
  if the next `enter` raises an exception
- Fixed a bug where `withState` would trigger `stateDidChange` on exit

## 1.0.1

- Use `HTMLElement#createEvent` to trigger the internal query event for IE11
  compatibility.

## 1.0.0

Initial release!