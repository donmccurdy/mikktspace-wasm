# mikktspace-js

[![Latest NPM release](https://img.shields.io/npm/v/mikktspace.svg)](https://www.npmjs.com/package/mikktspace)
[![Minzipped size](https://badgen.net/bundlephobia/minzip/mikktspace)](https://bundlephobia.com/result?p=mikktspace)
[![Build Status](https://github.com/donmccurdy/mikktspace-js/workflows/build/badge.svg?branch=main&event=push)](https://github.com/donmccurdy/mikktspace-js/actions?query=workflow%3Abuild)

[MikkTSpace](http://www.mikktspace.com/) vertex tangent calculation, in Web Assembly.

> **Work in progress.** This code is functional, but not yet thoroughly tested.

## Quickstart

Installation:

```
npm install --save mikktspace
```

The `mikktspace` package includes two entrypoints. For modern projects, the default entrypoint uses
[ES Modules](https://eloquentjavascript.net/10_modules.html#h_hF2FmOVxw7):

```js
import { generateTangents } from 'mikktspace';

const tangents = generateTangents(positions, normals, uvs); // → Float32Array
```

Node.js does not yet support ES Modules with WebAssembly particularly well, so the `mikktspace`
package also provides a CommonJS entrypoint. The CommonJS entrypoint works only in Node.js.

```js
const { generateTangents } = require('mikktspace');

const tangents = generateTangents(positions, normals, uvs); // → Float32Array
```

## API

### generateTangents

Generates vertex tangents for the given position/normal/texcoord attributes. Triangles of the
input geometry must be unindexed/unwelded.

**Parameters**

-   `positions`: [`Float32Array`][1]
-   `normals`: [`Float32Array`][1]
-   `uvs`: [`Float32Array`][1]

**Returns**

[`Float32Array`][1]

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array

## Credits

This WebAssembly library is made possible by the [gltf-rs/mikktspace](https://github.com/gltf-rs/mikktspace)
project, and by the [MikkTSpace standard](http://www.mikktspace.com/) created by Morten S. Mikkelsen.
