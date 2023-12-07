uniform vec2 u_resolution;

#ifdef GL_ES
precision mediump float;
#endif

const float size = 0.1;
const float thickness = 0.005;

// Checks if this coord is part of the grid
float check(vec2 st) {
    vec2 m;
    m.x = mod(st.x, size);
    m.y = mod(st.y, size);
    if (m.x < thickness) return 1.0;
    if (m.y < thickness) return 1.0;
    return 0.0;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    float c = check(st);
    vec3 color = vec3(0.0,c,0.0);
    gl_FragColor = vec4(color,1.0);
}
