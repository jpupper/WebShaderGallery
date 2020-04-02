varying vec2 vUv;
uniform vec2 resolution;//The width and height of our screen
uniform sampler2D feedback;//Our input texture
uniform sampler2D videoTexture;
uniform float time;
uniform vec2 mouse;

uniform int touchesCount;
//SUPONEMOS QUE ES DE 5?! en el setup del render cambiar también

const int maxtouches = 5;
uniform vec2 touchesPos[5] ; 

vec3 lm(vec3 col, vec3 mx, vec3 dec){
		if(col.r > mx.r){col.r -=dec.r;}
		if(col.g > mx.g){col.g -=dec.g;}
		if(col.b > mx.b){col.b -=dec.b;}
		return col;
}
mat2 scale(vec2 _scale){
	return mat2(_scale.x,0.0,0.0,_scale.y);
}
mat2 rotate2d(float _angle){
	return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}
void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 puv = uv;
	
	vec4 offsetp  = texture2D(feedback,puv);
	float offsetm = (offsetp.r+offsetp.g+offsetp.b)/3.;
	//uv = vUv;
		 float fix = resolution.x/resolution.y;
		 uv.x*=fix;
	
	
	vec2 mm = vec2(mouse.x*fix,mouse.y);
	float e = 0.;
	
	vec2 p = mm-uv;
	float r = length(p);
	float size = 0.07;			
	e+= 1.-smoothstep(size,size+0.01,r);
	int cnt = 5;
	for(int i=0; i<maxtouches; i++){
		if(i == touchesCount){
			break;
		}
		vec2 p2 = vec2(touchesPos[i].x*fix,1.-touchesPos[i].y)-uv;
		float r = length(p2);
				
		e+= 1.-smoothstep(size,size+0.01,r);
		
	}

	
	vec2 pos = vec2(0.5);
	float offsetm_def  = sin(offsetm*20.0+time*0.1+
						 cos(offsetm*50.0+time*5.2));
	
	
	
	pos.x+=sin(time*1.0+offsetm_def*5.0+e)*0.3;
	pos.y+=cos(time*1.0+offsetm_def*5.0+e)*0.3;
	
	puv-=pos;
	puv*=scale(vec2(.989+offsetm*0.025));
	puv+=pos;
	
	puv-=pos;
	puv*=scale(vec2(1.01-offsetm*0.055));
	puv+=pos;
	
	vec4 fb = texture2D(feedback, puv);
	
	vec3 fin = vec3(e)*0.05 +fb.rgb*1.01;
	
	vec3 limit = vec3(.85,.55,.69);
	vec3 dec = vec3(.99,.92,.98);	
	fin = lm(fin,limit,dec);
	fin*=.995;
	//gl_FragColor = vec4(fin,1.0);
	gl_FragColor = vec4(fin,1.0);
 }