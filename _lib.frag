/*
    REFERENCE (NON-ORIGINAL)
*/
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

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

/*
    ORIGINAL
*/
// Pixelates a shader
vec2 pixels(vec2 st, vec2 resolution, float bits){
    float ratio = resolution.x / resolution.y;
    st.x = floor(st.x * (bits*ratio))/(bits*ratio);
    st.y = floor(st.y * bits)/bits;
    return st;
}

// Absolute sine
float absin(float n){
    return abs(sin(n));
}

// Absolute cosine
float abcos(float n){
    return abs(cos(n));
}

// Normalized sine
float normsin(float n){
    return sin(n)+1./2.;
}

// Normalized cosine
float normcos(float n){
    return cos(n)+1./2.;
}

// Sine a tangent
float sintan(float n){
    return sin(tan(n));
}

// Cosine a tangent
float costan(float n){
    return cos(tan(n));
}

// Invert a vector or value
vec3 invert(vec3 v){
	return vec3(1,1,1) - v;
}
float invert(float v){
    return 1. - v;
}