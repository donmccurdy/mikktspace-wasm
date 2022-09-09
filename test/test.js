const mikktspace = require('../');
const tape = require('tape');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { unweld } = require('@gltf-transform/functions');

tape('generateTangents', async (t) => {
    const io = new NodeIO();
    const document = await io.read(path.resolve(__dirname, './cube.glb'));
    await document.transform(unweld());
    const cube = document.getRoot().listMeshes()[0].listPrimitives()[0];

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

tape('generateTangents | memory', async (t) => {
    const io = new NodeIO();
    const document = await io.read(path.resolve(__dirname, './cube.glb'));
    await document.transform(unweld());
    const cube = document.getRoot().listMeshes()[0].listPrimitives()[0];

    let initialMemory = -1;

    for (let i = 0; i < 1000; i++) {
        const tangentArray = mikktspace.generateTangents(
            cube.getAttribute('POSITION').getArray(),
            cube.getAttribute('NORMAL').getArray(),
            cube.getAttribute('TEXCOORD_0').getArray(),
        );

        const currentMemory = mikktspace.__wasm.memory.buffer.byteLength / 1024 / 1024;
        if (i === 0) {
            initialMemory = currentMemory;
        } else if ((i % 100) === 0) {
            t.equals(currentMemory, initialMemory, `memory = ${initialMemory} MB @ ${i}/1000`);
        }
    }
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
