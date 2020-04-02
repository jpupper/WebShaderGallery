varying vec2 vUv;
uniform vec2 resolution;//The width and height of our screen
uniform sampler2D feedback;//Our input texture
uniform sampler2D videoTexture;
uniform float time;
uniform vec2 mouse;
uniform int isMobile;
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
	//vec2 p = - 1.0 + 2.0 * vUv;
		vec2 uv = gl_FragCoord.xy / resolution.xy;
		float fix = resolution.x/resolution.y;
		
		vec2 puv = uv;
		
		uv.x*=fix;
		
		
		vec4 offsetp  = texture2D(feedback,gl_FragCoord.xy / resolution.xy);
		float offsetm = (offsetp.r+offsetp.g+offsetp.b)/3.;
		
		vec2 p = vec2(mouse.x*fix,mouse.y) - uv;
		
		float e =0.0;
		float size = 0.1;
		float dif = 0.15;
			
		if(touchesCount == 0){
			float r = length(p);	
			e+= 1.-smoothstep(size,size+dif,r);
		}
		
		
		for(int i=0; i<maxtouches; i++){
			if(i == touchesCount){
				break;
			}
			vec2 p2 = vec2(touchesPos[i].x*fix,1.-touchesPos[i].y)-uv;
			float r = length(p2);
			
			e+= 1.-smoothstep(size,size+dif,r);
			
		}

		
		
		
		vec2 pos = vec2(0.5);
		pos.x+=sin(time*10.0);
		pos.y+=cos(time*10.0);
		
		puv+=sin(pos*400.0+time*3.0)*0.005;
		//puv*=scale(vec2(.99+offsetm*0.025));
		puv-=sin(pos*400.0+time*3.0)*0.005;;
		
		//puv-=pos;
		//puv*=scale(vec2(1.01-offsetm*0.025));
		//puv+=pos;*/
		
		vec4 fb = texture2D(feedback,puv);
		//vec3 fin = vec3(e)*0.009 +fb.rgb;
		vec3 fin = vec3(e)*0.01 +fb.rgb;
		
		puv = fract(puv);
		
		
		
		vec3 limit = vec3(.75,.67,.63);
		vec3 dec = vec3(.94,.97,.91);
		//vec3 limit = vec3(.9);
		//vec3 dec = vec3(.9);
		
		
		fin = lm(fin,limit,dec);
		
		
		//fin = mix(fin,vec3(e),vec3(e)*0.2);
		//fin+=vec3(e)*0.5;
		//fin = clamp(fin,0.0,1.0);
		gl_FragColor = vec4(fin, 1.0 );
 }