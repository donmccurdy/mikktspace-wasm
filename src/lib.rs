mod mikktspace;

use wasm_bindgen::prelude::*;
use nalgebra::{Vector2, Vector3};

// extern crate console_error_panic_hook;
// use std::panic;


/// The interface by which mikktspace interacts with your geometry.
pub trait Geometry {
    /// Returns the number of faces.
    fn num_faces(&self) -> usize;

    /// Returns the number of vertices of a face.
    fn num_vertices_of_face(&self, face: usize) -> usize;

    /// Returns the position of a vertex.
    fn position(&self, face: usize, vert: usize) -> [f32; 3];

    /// Returns the normal of a vertex.
    fn normal(&self, face: usize, vert: usize) -> [f32; 3];

    /// Returns the texture coordinate of a vertex.
    fn tex_coord(&self, face: usize, vert: usize) -> [f32; 2];

    /// Sets the generated tangent for a vertex.
    /// Leave this function unimplemented if you are implementing
    /// `set_tangent_encoded`.
    fn set_tangent(
        &mut self,
        tangent: [f32; 3],
        _bi_tangent: [f32; 3],
        _f_mag_s: f32,
        _f_mag_t: f32,
        bi_tangent_preserves_orientation: bool,
        face: usize,
        vert: usize,
    ) {
        let sign = if bi_tangent_preserves_orientation {
            1.0
        } else {
            -1.0
        };
        self.set_tangent_encoded([tangent[0], tangent[1], tangent[2], sign], face, vert);
    }

    /// Sets the generated tangent for a vertex with its bi-tangent encoded as the 'W' (4th)
    /// component in the tangent. The 'W' component marks if the bi-tangent is flipped. This
    /// is called by the default implementation of `set_tangent`; therefore, this function will
    /// not be called by the crate unless `set_tangent` is unimplemented.
    fn set_tangent_encoded(&mut self, _tangent: [f32; 4], _face: usize, _vert: usize) {}
}

fn get_position<I: Geometry>(geometry: &mut I, index: usize) -> Vector3<f32> {
    let (face, vert) = index_to_face_vert(index);
    geometry.position(face, vert).into()
}

fn get_tex_coord<I: Geometry>(geometry: &mut I, index: usize) -> Vector3<f32> {
    let (face, vert) = index_to_face_vert(index);
    let tex_coord: Vector2<f32> = geometry.tex_coord(face, vert).into();
    tex_coord.insert_row(2, 1.0)
}

fn get_normal<I: Geometry>(geometry: &mut I, index: usize) -> Vector3<f32> {
    let (face, vert) = index_to_face_vert(index);
    geometry.normal(face, vert).into()
}

fn index_to_face_vert(index: usize) -> (usize, usize) {
    (index >> 2, index & 0x3)
}

fn face_vert_to_index(face: usize, vert: usize) -> usize {
    face << 2 | vert & 0x3
}

/************************************************************************/

#[wasm_bindgen]
pub struct Mesh {
    position: Vec<f32>,
    normal: Vec<f32>,
    texcoord: Vec<f32>,
    tangent: Vec<f32>,
}

impl Geometry for Mesh {
    fn num_faces(&self) -> usize {
        self.position.len() / 9
    }

    fn num_vertices_of_face(&self, _face: usize) -> usize {
        3
    }

    fn position(&self, face: usize, vert: usize) -> [f32; 3] {
        [
            self.position[face * 9 + vert * 3 + 0],
            self.position[face * 9 + vert * 3 + 1],
            self.position[face * 9 + vert * 3 + 2],
        ]
    }

    fn normal(&self, face: usize, vert: usize) -> [f32; 3] {
        [
            self.normal[face * 9 + vert * 3 + 0],
            self.normal[face * 9 + vert * 3 + 1],
            self.normal[face * 9 + vert * 3 + 2],
        ]
    }

    fn tex_coord(&self, face: usize, vert: usize) -> [f32; 2] {
        [
            self.texcoord[face * 6 + vert * 2 + 0],
            self.texcoord[face * 6 + vert * 2 + 1],
        ]
    }

    fn set_tangent_encoded(&mut self, tangent: [f32; 4], _face: usize, _vert: usize) {
        self.tangent.push(tangent[0]);
        self.tangent.push(tangent[1]);
        self.tangent.push(tangent[2]);
        self.tangent.push(tangent[3]);
        // console_log!("num_faces() -> {vx}", vx = tangent);
    }
}

/// Generates tangents for the input geometry.
///
/// # Errors
///
/// Returns `false` if the geometry is unsuitable for tangent generation including,
/// but not limited to, lack of vertices.
#[wasm_bindgen]
#[allow(non_snake_case)]
pub fn computeVertexTangents(position: Vec<f32>, normal: Vec<f32>, texcoord: Vec<f32>) -> Vec<f32> {
    // panic::set_hook(Box::new(console_error_panic_hook::hook));
    let mut mesh = Mesh { position, normal, texcoord, tangent: Vec::new() };
    unsafe { mikktspace::genTangSpace(&mut mesh, 180.0) };
    return mesh.tangent; // TODO(cleanup): Clearer success/failure signal?
}

///////////// DEBUG

// fn vertex(mesh: &Mesh, face: usize, vert: usize) -> &Vertex {
//     let vs: &[u32; 3] = &mesh.faces[face];
//     &mesh.vertices[vs[vert] as usize]
// }

// #[wasm_bindgen]
// extern "C" {
//     // Use `js_namespace` here to bind `console.log(..)` instead of just
//     // `log(..)`
//     #[wasm_bindgen(js_namespace = console)]
//     fn log(s: &str);
// }

// macro_rules! console_log {
//     // Note that this is using the `log` function imported above during
//     // `bare_bones`
//     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
// }

// #[wasm_bindgen]
// pub fn init_panic_hook() {
//     console_error_panic_hook::set_once();
// }