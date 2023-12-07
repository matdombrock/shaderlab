uniform vec3        u_resolution;
uniform float       u_time;
uniform vec4        u_mouse;

#ifdef GL_ES
precision mediump float;
#endif

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 mr = u_mouse.xy/u_resolution.xy;

    vec3 color = vec3(0.);
    color = vec3(mr.x/st.x, mr.y/st.y,1.);
    color = abs(sin(color*abs(sin(u_time/32./st.y))*st.x));
    gl_FragColor = vec4(color,1.0);
}
