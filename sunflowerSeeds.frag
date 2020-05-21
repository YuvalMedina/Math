#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;  // Canvas size (width,height)
uniform float u_time;       // Time in seconds since load

#define BLACK_COL vec3(32,43,51)/255.
#define WHITE_COL vec3(235,241,245)/255.

#define PI2 6.2831852
#define PI 3.1415926
#define PI_2 1.5707963
#define PI_4 0.78539815
#define PHI 0.61803398875

bool isSeed(vec2 position, vec2 seedCenter, float r){
	return length(position - seedCenter) <= r;
}

vec2 polarToCoord(float magnitude, vec2 origin, float angle){
	return magnitude * vec2(cos(angle), sin(angle)) +
		origin;
}

void drawCircleFlower(vec2 flowerCenter){
	vec2 position = gl_FragCoord.xy/u_resolution;

	float magFromFlower = 0.09; //how far away should seed center be from flower center
	float radius = 0.017; // seed radius
	float angle = 0.0; // angle from from first seed planted.
	float angle_delta = PI*(sin(u_time)+1.);
	bool draw = false; // should we draw here? aka are we inside a seed?

	for(int i=0; i<70; i++){
		if(angle >= PI2){
			angle = mod(angle,PI2);
			magFromFlower += .04;
		}

		vec2 seedCenter = polarToCoord(magFromFlower, flowerCenter, angle);

		if(isSeed(position, seedCenter, radius)){
			draw = true;
			break;
		}

		angle += angle_delta;
	}

	vec3 color = WHITE_COL;
	if(draw){
		color = BLACK_COL;
	}

	gl_FragColor = vec4(color, 1.0);
}

void main(){

	//float circle = circleShape(center, 0.018);
	//color = vec3(circle);

	vec2 flowerCenter = vec2(.5);

	drawCircleFlower(flowerCenter);
}