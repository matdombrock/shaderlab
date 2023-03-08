#ifdef GL_ES
precision mediump float;
#endif

void main() {
    vec2 st = gl_FragCoord.xy/iResolution.xy;
    vec2 mr = iMouse.xy/iResolution.xy;

    vec3 color = vec3(0.);
    color = vec3(mr.x/st.x, mr.y/st.y,1.);
    color = abs(sin(color*abs(sin(iTime/32./st.y))*st.x));
    gl_FragColor = vec4(color,1.0);
}
