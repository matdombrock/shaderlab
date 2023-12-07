// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

// uniform vec2 iResolution;
// uniform vec2 u_mouse;
// uniform float iTime;  


float normsin(float n){
    return sin(n)+1./2.;
}

vec3 invert(vec3 v){
	return vec3(1,1,1) - v;
}
float invert(float v){
    return 1. - v;
}

void main() {
    vec2 st = gl_FragCoord.xy/iResolution.xy;
    st.x *= iResolution.x/iResolution.y;

    vec3 color1 = vec3(st.x, st.y, 1.);
    vec3 color2 = invert(color1);
    color2.r = invert(color2.r);
    vec3 color = mix(color1, color2, normsin(iTime));

    gl_FragColor = vec4(color,1.0);
}