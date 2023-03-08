// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

// uniform vec2 iResolution;
// uniform vec2 iMouse;
// uniform float iTime;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/iResolution.xy;
    vec3 color = vec3(random(st + iTime));
    gl_FragColor = vec4(color,1.0);
}
