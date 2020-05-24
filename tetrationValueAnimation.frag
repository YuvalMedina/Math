#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;  // Canvas size (width,height)
uniform float u_time;       // Time in seconds since load

#define BLACK vec3(32,43,51)/255.
#define WHITE vec3(235,241,245)/255.
#define GREEN vec3(32, 241, 100)/255.
#define BLUE vec3(43, 61, 245)/255.
#define RED vec3(243, 21, 43)/255.

#define PI2 6.2831852
#define PI 3.1415926
#define PI_2 1.5707963
#define PI_4 0.78539815
#define PHI 0.61803398875

#define e1OvE 1.44466                // e^(1/e) is the upper bound for real-number tetration.
#define eNegE 0.06598803585          // e^(-e), the lower bound for real-number tetration.

// complex multiplication:
vec2 cmul(in vec2 a, in vec2 b) {
    return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);
}

// complex exponent e^a
vec2 cexp(in vec2 a) {
    float ea = exp(a.x);
    float vl = a.y;
    return ea * vec2( cos(vl), sin(vl) );
}

// complex natural logarithm ln(a)
vec2 cln(in vec2 a) {
    float ql = length(a);
    return vec2( log(ql), atan(a.y, a.x));
}

// complex power function a^b
vec2 cpow(in vec2 a, in vec2 b) {
    return cexp(cmul(cln(a), b));   
}

// complex value tetration, a^^b [b is a real integer]
vec2 tetration(in vec2 a, in int b){
    if(b<0) return vec2(0.,0.);
    if(b==0) return vec2(1.,0.);
    vec2 t = vec2(1,0);
    for(int i = 0; i < 100; i++){
        if(i >= b) break;
        t = cpow(a,t);
    }
    return t;
}

// complex value tetration, interpolated to b as any real number
vec2 tetrationReal(in vec2 a, in float b){
    if(b<0.) return vec2(0.,0.);
    if(b==0.) return vec2(1.,0.);
    vec2 y0 = tetration(a, int(b));
    vec2 y1 = tetration(a, int(b)+1);
    return y0 + (b-floor(b))*(y1-y0);
}

void main(){
    vec2 complex = gl_FragCoord.xy / u_resolution;

    float width = u_resolution.x;
    float height = u_resolution.y;

    // Scaling : change scalar to dilate/shrink grid
    // displacement is ratio of negative side to positive side.
    float scalar = 6.;
    float displacement = scalar/2.; // negative and positive sides are symmetric

    // scaling work: don't change..~~~~
    float realscale = scalar;
    float imagscale = height/width * scalar;
    vec2 scale = vec2(realscale, imagscale);
    vec2 c_scaled = complex * scale - displacement;

    float maxReal = realscale - displacement;
    float maxImag = imagscale - displacement;
    vec2 maxDim = vec2(maxReal, maxImag);
    // ^ scaling, do not change..~~~~

    vec2 val = tetration(c_scaled,100);
    float r = length(val); //magnitude

    // log scale
    r = log(r);

    gl_FragColor = vec4(r,r,r,1.);
}