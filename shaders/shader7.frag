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
			vec2 uv = gl_FragCoord.xy / resolution.xy;
			vec2 puv = uv;
			
			vec4 offsetp  = texture2D(feedback,puv);
			float offsetm = (offsetp.r+offsetp.g+offsetp.b)/3.;
			//uv = vUv;
				 float fix = resolution.x/resolution.y;
				 uv.x*=fix;
			
			
			vec2 mm = vec2(mouse.x*fix,mouse.y);
			float e = 0.;
			
			float size = 0.1;
			float dif = 0.01;
			float r;
			//PARA QUE DETECTE SI ES DE ANDROID O NO. ESTO PODRÏA MEJORAR PERO BUE
			if(touchesCount == 0){
				vec2 p = mm-uv;
				r = length(p);
				
				e+= 1.-smoothstep(size,size+dif,r);
			}
			
			int cnt = 5;
			for(int i=0; i<maxtouches; i++){
				if(i == touchesCount){
					break;
				}
				vec2 p2 = vec2(touchesPos[i].x*fix,1.-touchesPos[i].y)-uv;
				r = length(p2);
				
				e+= 1.-smoothstep(size*.5,(size+dif)*.5,r);
				
			}

			
			float def = sin(r*100.+time*10.0);
				
				vec2 pos = vec2(0.5);
				//pos.x+=sin(time*1.0+sin(offsetm*500.0+time*3.0)+sin(offsetm*100.0+time*1.0)*3.0)*0.03;
				//pos.y+=cos(time*1.0+sin(offsetm*500.0+time*3.0)+sin(offsetm*100.0+time*1.0)*3.0)*0.03;
				puv = fract(vec2(puv.x+time*.000,puv.y+time*.0000));
				puv-=pos;
				puv*=scale(vec2(1.01));
				puv+=pos;
				
				
				puv-=pos;
				puv*=rotate2d(sin(time*0.01)*1.0);
				puv+=pos;
				
				puv = fract(vec2(puv.x+time*.000,puv.y+time*.0000));
				vec4 fb = texture2D(feedback,puv)*1.000;
				vec3 fin = vec3(e) +fb.rgb;
				
				
				
				vec3 limit = vec3(.99,.99,.99);
				vec3 dec = vec3(.92,.77,.67);
				
				fin = lm(fin,limit,dec);
				
				
				//fin = mix(fin,vec3(e),vec3(e)*0.2);
				//fin+=vec3(e)*0.5;
				//fin = clamp(fin,0.0,1.0);
				gl_FragColor = vec4(fin, 1.0 );
		 }