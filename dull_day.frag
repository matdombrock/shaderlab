#ifdef GL_ES
precision mediump float;
#endif

// uniform vec2 iResolution;
// uniform vec2 iMouse;
// uniform float iTime;

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

vec2 pixels(vec2 st, vec2 resolution, float bits){
    float ratio = resolution.x / resolution.y;
    st.x = floor(st.x * (bits*ratio))/(bits*ratio);
    st.y = floor(st.y * bits)/bits;
    return st;
}

void main() {
    vec2 st = gl_FragCoord.xy/iResolution.xy;
    
    //st = pixels(st, iResolution, 6.);
    
    st = sin(st);

    // Use the noise function
    float n = noise(st * (iTime)/8.);
    gl_FragColor = vec4(vec3(n), 1.0);
}
