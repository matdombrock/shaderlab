uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform int u_frame;

#ifdef GL_ES
precision mediump float;
#endif

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    color = vec3(sin(float(u_frame)/32.0), sin(float(u_frame)/16.0), abs(sin(u_time)));
    gl_FragColor = vec4(color,1.0);
}
