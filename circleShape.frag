#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define BLACK_COL vec3(32,43,51)/255.
#define WHITE_COL vec3(235,241,245)/255.

#define PI2 6.2831852
#define PI 3.1415926
#define PI_2 1.5707963
#define PI_4 0.78539815
#define PHI 0.61803398875

float circleShape(vec2 position, float r){
	return step(r, length(position));
}

vec2 rotate(vec2 position, float theta, vec2 center){
	mat2 rotmat = mat2(
		cos(theta), sin(theta),
		-sin(theta), cos(theta)
	);
	return (position - center) * rotmat + center;
}

void drawCircleFlower(vec2 center){
	float circs;

	vec2 offset = vec2(0,0.022);
	float radius = 0.017;
	float angle = 0.0;
	for(int i=0; i<40; i++){
		if(angle > PI2){
			angle -= PI2;
			offset += vec2(0,0.22);
		}
		vec2 circCent = rotate(center+offset,angle,center);
		circs += circleShape(circCent, radius);
		angle += PHI;
	}

	vec3 color = vec3(circs);

	gl_FragColor = vec4(color, 1.0);
}

void main(){
	vec2 position = gl_FragCoord.xy / u_resolution;
	vec2 center = position-vec2(0.5);
	
	vec3 color = vec3(0.0);
	
	//float circle = circleShape(center, 0.018);
	//color = vec3(circle);

	drawCircleFlower(center);
}