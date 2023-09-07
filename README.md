![GitHub release (with filter)](https://img.shields.io/github/v/release/jwetzell/sendosc)
![npm](https://img.shields.io/npm/v/sendosc)
# sendosc
Simple NodeJS script for sending OSC via TCP or UDP inspired by this [c++ utility](https://github.com/yoggy/sendosc) of the same name.

## Usage
- using npx `npx sendosc@latest host port address args...`
- install using `npm install -g sendosc@latest` and run `sendosc host port address args...`
- use the precompiled binaries

## Notes
- `args...` is a list of arguments that will be parsed for basic types: 1.1 = float, 1 = integer, true = boolean. If a type can't be determined it will default to string.
- the default protocol is UDP but can be changed to TCP using the -p flag

## Examples
- `sendosc 127.0.0.1 8000 /test 1.0`
- `sendosc 127.0.0.1 8000 /multi/part/address/with/boolean/arg true`
- `sendosc -p tcp 127.0.0.1 8000 /this/is/sent/via/tcp`
- `sendosc 127.0.0.1 8000 /test 1 2.0 three false`
