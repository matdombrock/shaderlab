uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#ifdef GL_ES
precision mediump float;
#endif

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    float a = abs(u_mouse.x - st.x) / u_resolution.x;
    float b = abs(u_mouse.y - st.y) / u_resolution.y;
    vec2 ct = abs(u_mouse.xy - st.xy) / u_resolution.xy;
    float c = (ct.x + ct.y) / 2.0;
    vec3 color = vec3(a,b,c);
    gl_FragColor = vec4(color,1.0);
}
