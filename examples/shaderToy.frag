// Ported from Shadertoy demo
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#ifdef GL_ES
precision mediump float;
#endif

void main() {
     // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(u_time+uv.xyx+vec3(0,2,4));

    // Output to screen
    gl_FragColor = vec4(col,1.0);
}
