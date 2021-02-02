use wasm_bindgen::prelude::*;
use mikktspace::{Geometry};

#[cfg(debug_assertions)]
extern crate console_error_panic_hook;

#[cfg(debug_assertions)]
use std::panic;

/******************************************************************************
 * JavaScript interface.
 */

 /// Generates vertex tangents for the given position/normal/texcoord attributes.
#[wasm_bindgen]
#[allow(non_snake_case)]
pub fn computeVertexTangents(position: Vec<f32>, normal: Vec<f32>, texcoord: Vec<f32>) -> Vec<f32> {
    #[cfg(debug_assertions)]
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    let mut mesh = Mesh { position, normal, texcoord, tangent: Vec::new() };
    mikktspace::generate_tangents(&mut mesh);
    return mesh.tangent; // TODO(cleanup): Clearer success/failure signal?
}

/******************************************************************************
 * MikkTSpace library interface.
 */

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
    }
}

/******************************************************************************
 * Debugging.
 */

#[cfg(debug_assertions)]
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[cfg(debug_assertions)]
#[allow(unused_macros)]
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[cfg(debug_assertions)]
#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}