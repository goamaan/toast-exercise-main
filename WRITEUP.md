# Write-up

- No new dependencies added

- All UI components used are from MUI (Snackbar, Table, Alert, etc), as it was already set up, and to keep the bundle size to a minimum.

- All state was managed with `useState` as I believe there was no need for global state for a UI tree this size and with these functionalities (prop drilling was enough).

## Features added

- Added loading/error handling for all "server-side" requests
- Added retry logic for fetching liked submissions and for retrying the "like" action on fail

## Misc info

- Added an errorMap and error message util in [src/utils.js](src/utils.js)
