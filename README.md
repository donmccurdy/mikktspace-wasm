# mikktspace-wasm

[![Latest NPM release](https://img.shields.io/npm/v/mikktspace.svg)](https://www.npmjs.com/package/mikktspace)
[![Build Status](https://github.com/donmccurdy/mikktspace-wasm/workflows/build/badge.svg?branch=main&event=push)](https://github.com/donmccurdy/mikktspace-wasm/actions?query=workflow%3Abuild)

[MikkTSpace](http://www.mikktspace.com/) vertex tangent calculation, in Web Assembly.

> A common misunderstanding about tangent space normal maps is that this representation is somehow asset independent. However, normals sampled/captured from a high resolution surface and then transformed into tangent space is more like an encoding. Thus to reverse the original captured field of normals the transformation used to decode would have to be the exact inverse of that which was used to encode.
>
> — Morten S. Mikkelsen

When normal maps render incorrectly, with distortion or unexpectedly inverted insets and extrusions, this misconception may be the cause. Most normal map bakers use the MikkTSpace standard to generate vertex tangents while creating a normal map, and the technique is recommended by the glTF 2.0 specification. Engines reconstructing the tangent space at runtime often use other methods — e.g. derivatives in the pixel shader — for efficiency, when original tangents are not provided. This works well for _most_ assets, but may not work as well for others.

If you have an...

- **Asset** that needs to render predictably in many engines
- **Asset Pipeline** that needs to produce assets with predictable normal map behavior
- **Engine** that needs to support arbitrary assets perfectly (and can afford the per-vertex pre-processing)

...then MikkTSpace vertex tangents may resolve or prevent rendering issues with normal maps.

| correct | incorrect |
|---------|-----------|
| ![correct rendering](./assets/correct.png) | ![incorrect rendering](./assets/incorrect.png) |

> **Figure:** *[Flight Helmet](https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/FlightHelmet) glTF 2.0 sample, shown with correct (left) and incorrect (right) vertex tangents.*

## Other considerations

The MikkTSpace algorithm requires unindexed (unwelded) triangles as input. It is safe to create an index (welding vertices whose tangents and other attributes are identical) after generating tangents, but you _cannot_ reuse prior indices after generating tangents. This additional cost is, perhaps, why some realtime engines choose to generate tangents with cheaper alternative algorithms, when pre-computed tangents are not provided with the asset.

When generating vertex tangents for [glTF 2.0](https://github.com/KhronosGroup/glTF) assets, you will want to flip the sign of the tangents (`tangent.w *= -1`) before storing them in the glTF file. While MikkTSpace does not document a particular UV convention that I could find, this [appears to be a necessary conversion](https://github.com/KhronosGroup/glTF-Sample-Models/issues/174) to the [texture coordinate convention used in glTF](https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#images).

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

Node.js does not yet support ES Modules with WebAssembly particularly well (as of Node.js v14), so the `mikktspace`
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
