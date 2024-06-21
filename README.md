# GLSL SHADER LAB
A tool for rapidly testing and demoing GLSL shaders using WebGL. Creates standalone HTML files that render the shaders.  

## Usage
- Add shader code to `./shaders`
- Run `node build-demos.js`
- HTML files are output to `./webdemo` and can be loaded directly into a browser (no server required).

## Uniforms
```glsl
float u_time
float u_timeDelta
int   u_frame
vec2  u_resolution
vec2  u_mouse
```

## Directories
- `./examples` contains example shader code that can be used as a reference
- `./shaders` contains the "cool" shaders which will actually be built as web demos
- `./src` contains meta code used to build the web demos
  - `./src/glsl.js` contains the logic used to setup the shader env