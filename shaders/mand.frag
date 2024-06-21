// EVER STRANGER BIRTH

// This code will zoom into the point (-0.745, 0.186) in the Mandelbrot set, which is known to be an interesting area of the fractal. 
// The zoom speed is controlled by the `u_time` uniform, and the zoom level is increased over time. 
// The color of the pixel is determined by the number of iterations it took for the point to escape the Mandelbrot set, with points that took longer to escape being darker.
uniform vec2 u_resolution;
uniform float u_time;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

const float LIMIT = 999.9;
const float SPEED = 1.0;
void main()
{
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec2 c = vec2(-0.745, 0.186);
    vec2 z = uv;

    float xTime = u_time * SPEED;
    float time = sin(xTime / 2.0) * (sin(xTime/LIMIT)*LIMIT);
    float zoom = 1.0 + time * 0.5;
    c += uv / zoom;

    int iter = 0;
    for(int i = 0; i < 100; i++)
    {
        if(dot(z, z) > 4.0) break;
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        iter++;
    }

    float col = 1.0 - float(iter) / 100.0;
    //float colx = abs(sin(col*100.0));
    vec3 colx = hsv2rgb(vec3(col, 1.0, 1.0));
    colx.x = 1.0 - colx.x;
    vec4 f1 = vec4(vec3(col), 1.0);
    vec4 f2 = vec4(colx, 1.0);
    gl_FragColor = mix(f1, f2, 0.75);
}