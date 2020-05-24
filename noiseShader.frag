#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 22./7.


float angryTransition(float time){
    time = mod(time/2., 1.);
    if(time < 0.5){
        return pow(time*2.,2.);
    }
    return cos((time-0.5)*3.14);
}

float waiiitWhatOhhh(float time){
    time = mod(time/2., 1.);
    if(time < 0.25){
        return (1.-cos(time*PI*2.))/2.;
    }
    if(time < 0.5){
        return pow(4.,(time-.25)*2.)/2.;
    }
    return log((-.4*time+0.5)*2.)+1.5;
}