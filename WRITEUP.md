# Write-up

> Side note: I was unable to run the project with Node.js 18.17.1 (received an error that I'll attach below). Node.js 16.20.2 runs fine, however.

- No new dependencies added

- All UI components used are from MUI (Snackbar, Table, Alert, etc), as it was already set up, and to keep the bundle size to a minimum.

- All state was managed with `useState` as I believe there was no need for global state for a UI tree this size and with these functionalities (prop drilling was enough).

## Features added

- Added loading/error handling for all "server-side" requests
- Added retry logic for fetching liked submissions and for retrying the "like" action on fail

## Misc info

- Added an errorMap and error message util in [src/utils.js](src/utils.js)

### Error received running with Node.js 18.17.1

``` sh
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:69:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (/Users/amaan/code/delivra/toast-exercise-main/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/Users/amaan/code/delivra/toast-exercise-main/node_modules/webpack/lib/NormalModule.js:417:16)
    at /Users/amaan/code/delivra/toast-exercise-main/node_modules/webpack/lib/NormalModule.js:452:10
    at /Users/amaan/code/delivra/toast-exercise-main/node_modules/webpack/lib/NormalModule.js:323:13
    at /Users/amaan/code/delivra/toast-exercise-main/node_modules/loader-runner/lib/LoaderRunner.js:367:11
    at /Users/amaan/code/delivra/toast-exercise-main/node_modules/loader-runner/lib/LoaderRunner.js:233:18
    at context.callback (/Users/amaan/code/delivra/toast-exercise-main/node_modules/loader-runner/lib/LoaderRunner.js:111:13)
    at /Users/amaan/code/delivra/toast-exercise-main/node_modules/babel-loader/lib/index.js:59:103 {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}
```
