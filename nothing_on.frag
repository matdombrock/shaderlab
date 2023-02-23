#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

vec2 pixels(vec2 st, vec2 resolution, float bits){
    float ratio = resolution.x / resolution.y;
    st.x = floor(st.x * (bits*ratio))/(bits*ratio);
    st.y = floor(st.y * bits)/bits;
    return st;
}
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float absin(float n){
    return abs(sin(n));
}
float abcos(float n){
    return abs(cos(n));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	st = pixels(st, u_resolution, 512.);
	float time = u_time/32.;
    vec3 color = hsv2rgb(vec3(absin(st.x+time),1.,absin(st.y+time)));
    color.r = sin(color.r*256.);
    color.g = cos(color.g*256.);
    //color.b = sin(tan(color.b));
    color *= random(st * time);
    color *= 0.75;
    gl_FragColor = vec4(color, 1.0);
}
