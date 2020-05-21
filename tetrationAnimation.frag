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

#define e1OvE 1.44466       // e^(1/e) is the upper limit for tetration.
#define eNegE 0.06598803585          // approximately e^(-e), the lower limit for tetration.

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

float getbTox(float b, vec2 xy){
    float y = pow(b, xy.x); // y = b^x
    return plot(xy, y);
}

float getxEqY(vec2 xy){
    return plot(xy, xy.x); // y = x
}

bool inRange(float n, vec2 range){
    return n <= range.y && n >= range.x;
}

float plotXRange(vec2 xy, float c, vec2 range){
    // Plots x=c within the specified range.
    if(inRange(xy.y, range)){
        return max(0.,1.-50.*abs(xy.x-c));
    }
}

float plotYRange(vec2 xy, float c, vec2 range){
    // Plots y=c within the specified range.
    if(inRange(xy.x, range)){
        return max(0.,1.-50.*abs(xy.y-c));
    }
}

float drawCobweb(float b, vec2 xy, vec2 maxDim){
    if(xy.y < xy.x || xy.y > pow(b,xy.x)) return 0.;
    float t = 1.;
    for(int i = 0; i < 10; i++){
        float bt = pow(b,t);
        if(bt > maxDim.y) break;
        float plot = plotXRange(xy, t, vec2(t, bt));
        if(plot != 0.){
            return plot;
        }
        if(bt > maxDim.x) break;
        plot = plotYRange(xy, bt, vec2(t, bt));
        if(plot != 0.){
            return plot;
        }
        t = bt;
    }
    return 0.;
}

void main(){
    float b = sin(u_time/1.2)/2.+1.25;
    
    vec2 xy = gl_FragCoord.xy/u_resolution;

    float width = u_resolution[0];
    float height = u_resolution[1];

    float scalar = 12.;
    float displacement = scalar/2.; // negative and positive sides are symmetric

    float xscale = scalar;
    float yscale = height/width * scalar;
    vec2 scale = vec2(xscale, yscale);
    vec2 xy_scaled = xy * scale - displacement;

    float maxX = xscale - displacement;
    float maxY = yscale - displacement;
    vec2 maxDim = vec2(maxX, maxY);

	float bToX = getbTox(b, xy_scaled);
    float xEqY = getxEqY(xy_scaled);
    float cobweb = drawCobweb(b, xy_scaled, maxDim);

    gl_FragColor = vec4(bToX*GREEN + xEqY*BLUE +
                    cobweb*RED,1.);
}