/**
 * Generates vertex tangents for the given position/normal/texcoord attributes.
 * Triangles of the input geometry must be unindexed/unwelded.
 *
 * @param positions Vertex positions (vec3).
 * @param normals Vertex normals (vec3).
 * @param uvs Texture coordinates / UVs (vec2).
 */
export function generateTangents(
    positions: Float32Array,
    normals: Float32Array,
    uvs: Float32Array,
): Float32Array;
