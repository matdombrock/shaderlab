// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


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
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color1 = vec3(st.x, st.y, 1.);
    vec3 color2 = invert(color1);
    color2.r = invert(color2.r);
    vec3 color = mix(color1, color2, normsin(u_time));

    gl_FragColor = vec4(color,1.0);
}