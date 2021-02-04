const mikktspace = require('../');
const tape = require('tape');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { unweld } = require('@gltf-transform/lib');

tape('generateTangents', async (t) => {
    const io = new NodeIO();
    const doc = await io.read(path.resolve(__dirname, './cube.glb')).transform(unweld());
    const cube = doc.getRoot().listMeshes()[0].listPrimitives()[0];

    const tangentArray = mikktspace.generateTangents(
        cube.getAttribute('POSITION').getArray(),
        cube.getAttribute('NORMAL').getArray(),
        cube.getAttribute('TEXCOORD_0').getArray(),
    );

    t.ok(tangentArray instanceof Float32Array, 'returns float32array');
    t.equals(tangentArray.length, TANGENTS_EXPECTED.length, 'length matches inputs');

    const invalid = [];
    for (let i = 0; i < tangentArray.length; i++) {
        if (tangentArray[i] !== TANGENTS_EXPECTED[i]) {
            invalid.push({actual: tangentArray[i], expected: TANGENTS_EXPECTED[i], index: i});
        }
    }

    t.deepEquals(invalid, [], 'tangents match expected values');
    t.end();
});

tape('generateTangents | error handling', (t) => {
    const positions = new Float32Array();
    const normals = new Float32Array();
    const uvs = new Float32Array([1, 1]);
    t.throws(() => mikktspace.generateTangents(positions, normals, uvs), /Failed/, 'error handling');
    t.end();
});

const TANGENTS_EXPECTED = new Float32Array([
    0.40824824,0.81649655,0.40824824,1,
    0.40824824,0.81649655,-0.40824824,1,
    0,1,0,1,
    0.40824824,0.81649655,-0.40824824,1,
    -0.40824824,0.81649655,0.40824824,1,
    0,1,0,1,
    -0.40824824,0.81649655,0.40824824,1,
    -0.40824824,0.81649655,-0.40824824,1,
    0,1,0,1,
    -0.40824824,0.81649655,-0.40824824,1,
    0.40824824,0.81649655,0.40824824,1,
    0,1,0,1,
    0.40824824,0.81649655,-0.40824824,-1,
    0.40824824,0.81649655,0.40824824,-1,
    0,1,0,-1,
    0.40824824,0.81649655,0.40824824,-1,
    -0.40824824,0.81649655,-0.40824824,-1,
    0,1,0,-1,
    -0.40824824,0.81649655,-0.40824824,-1,
    -0.40824824,0.81649655,0.40824824,-1,
    0,1,0,-1,
    -0.40824824,0.81649655,0.40824824,-1,
    0.40824824,0.81649655,-0.40824824,-1,
    0,1,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    1,0,0,-1,
    -0.40824824,0.81649655,0.40824824,-1,
    -0.40824824,0.81649655,-0.40824824,-1,
    1,0,0,-1,
    1,0,0,-1,
    0.40824824,0.81649655,-0.40824824,1,
    1,0,0,-1,
    0.40824824,0.81649655,-0.40824824,1,
    0.40824824,0.81649655,0.40824824,1,
    1,0,0,-1,
    0.40824824,0.81649655,0.40824824,1,
    1,0,0,-1,
    1,0,0,-1,
    0.81649655,0.40824824,0.40824824,1,
    0.81649655,-0.40824824,0.40824824,1,
    1,0,0,1,
    0.81649655,-0.40824824,0.40824824,1
    ,0.81649655,0.40824824,-0.40824824,1,
    1,0,0,1,
    0.81649655,0.40824824,-0.40824824,1,
    0.81649655,-0.40824824,-0.40824824,1,
    1,0,0,1,
    0.81649655,-0.40824824,-0.40824824,1,
    0.81649655,0.40824824,0.40824824,1,
    1,0,0,1,
    0.81649655,-0.40824824,0.40824824,-1,
    0.81649655,0.40824824,0.40824824,-1,
    1,0,0,-1,
    0.81649655,0.40824824,0.40824824,-1,
    0.81649655,-0.40824824,-0.40824824,-1,
    1,0,0,-1,
    0.81649655,-0.40824824,-0.40824824,-1,
    0.81649655,0.40824824,-0.40824824,-1,
    1,0,0,-1,
    0.81649655,0.40824824,-0.40824824,-1,
    0.81649655,-0.40824824,0.40824824,-1,
    1,0,0,-1,
]);
