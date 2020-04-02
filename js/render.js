

//----------------------------------------------------------//
//Esto supone que todos los nombres son shader1.frag , shader2.frag y asi sucesivamente.
//Aca todas las variables humanamente tocables : 

var indexShader = 1; //POR CUAL SHADER ARRANCA
var duration = 40.; //LO QUE TARDA EN PASAR DE SHADERS
var gallerymode = true; // ESTO ES PARA QUE SE  LEVANTE COMO GALERIA DIGAMO.
var cantidadShaders = 7; //CUANTOS FRAGMENT SHADER HAY.
//---------------------------------------------------------/

var activeShader = "shaders/shader"+indexShader+".frag" ; // CUAL ES EL QUE CARGA AHORA.
//TODOS LOS OBJETOS QUE USO.
var scene;
var camera;
var renderer;
var bufferScene;
var textureA;
var textureB;
var bufferMaterial;
var plane;
var bufferObject;
var finalMaterial;
var quad;

//MANEJO DE TIEMPO:
var clock;
var lasttime = 0;


//var video;
//var videoTexture;

//Variables pa uniforms:
var mouse;
var touchesPos = [];
var touchesCount;
var isMobile = 0;




//EVENTOS:
document.addEventListener("mousemove", onDocumentMouseMove, false);
document.addEventListener("touchstart",onDocumentTouchStart, false);
document.addEventListener("touchmove", onDocumentTouchMove, false);
document.addEventListener("touchend",  onDocumentTouchEnd, false);
document.addEventListener("keypress",  documentOnKeyPressed, false);


function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
  var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
  vertex_loader.setResponseType('text');
  vertex_loader.load(vertex_url, function (vertex_text) {
    var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    fragment_loader.setResponseType('text');
    fragment_loader.load(fragment_url, function (fragment_text) {
      onLoad(vertex_text, fragment_text);
    });
  }, onProgress, onError);
}

shaderReady = false;
function documentOnKeyPressed(event){
	var keyCode = event.keyCode;
	
	let chrCode = keyCode - 48 * Math.floor(keyCode / 48);
	let chr = String.fromCharCode(keyCode);
	
	console.log("BUTTON PRESSED"+chr);
	if(chr == 'r'){
		console.log("BUTTON PRESSED R");
		
		indexShader++;
		if(indexShader > cantidadShaders){
			indexShader = 1;
		}
		activeShader = "shaders/shader"+indexShader+".frag" ;
		loadMaterial(activeShader,false);
	}
	
	//activeFragShader ="shader/fragment2.frag";
	//loadMaterial(activeFragShader,false);
}

function loadMaterial(fragment,init){
	//shaderReady = false;
	ShaderLoader("shaders/shader1.vert", fragment,
	  function (vertex, fragment) {
		  //Create 2 buffer textures
			textureA = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
			textureB = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
			//Pass textureA to shader
			bufferMaterial = new THREE.ShaderMaterial({
				uniforms: {
					feedback: { type: "t", value: textureA.texture },
					resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
					mouse: { type: 'v2', value: new THREE.Vector2(0, 0) },
					//videoTexture: { type: "t", value: videoTexture },
					time: { type: "f", value: Math.random() * Math.PI * 2 + Math.PI },
					touchesPos: {type :"v2v", value : touchesPos},
					touchesCount: {type :"i", value : touchesCount},
				},vertexShader: vertex,
				fragmentShader: fragment
			});
			var finalMaterial = new THREE.MeshBasicMaterial({ map: textureB });
		 if(init){
			//Draw textureB to screen 
			plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
			bufferObject = new THREE.Mesh(plane, bufferMaterial);
			bufferScene.add(bufferObject);
			quad = new THREE.Mesh(plane, finalMaterial);
			scene.add(quad);
		 }else{
			bufferObject.material = bufferMaterial;
			quad.material = bufferMaterial;
		 }
		 shaderReady = true;
	  }
	)
}
function onDocumentTouchStart(event) {
	console.log("TOUCH START");
	event.preventDefault();
	//var x = event.touches[0].clientX ;
    //var y = event.touches[0].clientY ;
	
	for (var i = 0; i < event.touches.length; i++) {
		var x = event.touches[i].clientX ;
		var y = event.touches[i].clientY ;
		touchesPos[i].x  = event.touches[i].clientX / window.innerWidth   ;
		touchesPos[i].y  = event.touches[i].clientY / window.innerHeight ;
		console.log(i+"--x :" + touchesPos[i].x + " y: " + touchesPos[i].y);
	}
	touchesCount = event.touches.length;
	//console.log("TOUCHES SIZE :" + event.touches.length);
    //console.log("x: " + x + " y: " + y);
	//event.touches.forEach(element => console.log(element.x));
	isMobile = 0;
}
function onDocumentTouchMove(event){
	//console.log("TOUCH MOVE");
	event.preventDefault();
	for (var i = 0; i < event.touches.length; i++) {
		var x = event.touches[i].clientX ;
		var y = event.touches[i].clientY ;
		touchesPos[i].x  = event.touches[i].clientX / window.innerWidth   ;
		touchesPos[i].y  = event.touches[i].clientY / window.innerHeight ;
		console.log(i+"--x :" + touchesPos[i].x + " y: " + touchesPos[i].y);
	}
	touchesCount = event.touches.length;
	event.preventDefault();
    //console.log("x: " + x + " y: " + y);	
}
function onDocumentTouchEnd(event) {
	console.log("TOUCH END");
	event.preventDefault();
	/*var x = event.touches[0].clientX ;
    var y = event.touches[0].clientY ;
    console.log("x: " + x + " y: " + y);*/
}
function onDocumentMouseMove(event) {
	event.preventDefault();
	//mouse.x = event.clientX;
	
	mouse.x = (event.clientX / window.innerWidth)  ;
	mouse.y = 1.-(event.clientY / window.innerHeight) ;
	isMobile = 1;
	//console.log("MOUSEX"+mouse.x);
	//console.log("MOUSEY"+mouse.y);
	
}
function setup(){
	
	//INICIALIZO VARIABLES QUE VAN PAL UNIFORM PARA BARDEARLA:
	mouse = new THREE.Vector2();
	clock = new THREE.Clock()
	clock.start();
	var cnt = 5; //SUPONIENDO QUE LLEGUE A ESE NUMERO EL ARRAY DE TOUCHES!?
	for(var i=0; i<cnt; i++){
		touchesPos.push(new THREE.Vector2());
	}
	touchesCount =0;
	sceneSetup();
//	bufferTextureSetup();
	loadMaterial(activeShader,true);
	
}
function sceneSetup() {
	scene = new THREE.Scene();
	bufferScene = new THREE.Scene();
	
	var width = window.innerWidth;
	var height = window.innerHeight;
	camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
	camera.position.z = 2;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	container = document.getElementById( 'container' );
	container.appendChild(renderer.domElement);
}
function render() {

	requestAnimationFrame(render);

	//Draw to textureB
	renderer.render(bufferScene, camera, textureB, true);
	//console.log("TIEMPO:"+clock.getElapsedTime());
	if(clock.getElapsedTime() - lasttime > duration){
		lasttime = clock.getElapsedTime();
		console.log("TICK TACK:"+clock.getElapsedTime());
		indexShader++;
		if(indexShader > cantidadShaders){
			indexShader = 1;
		}
		activeShader = "shaders/shader"+indexShader+".frag" ;
		loadMaterial(activeShader,false);
	}
	if(shaderReady){
		//Swap textureA and B
		var t = textureA;
		textureA = textureB;
		textureB = t;
		quad.material.map = textureB.texture;
		
		bufferObject.material.uniforms.feedback.value = textureA.texture;
		bufferObject.material.uniforms.mouse.value = new THREE.Vector2( mouse.x, mouse.y );
		bufferObject.material.uniforms.touchesCount.value = touchesCount;
		bufferObject.material.uniforms.touchesPos.value = touchesPos;
		bufferObject.material.uniforms.isMobile = isMobile;
		//Update time
		bufferObject.material.uniforms.time.value += 0.01;
	}
	//Finally, draw to the screen
	renderer.render(scene, camera);
}
setup();
render();



/******************************************************************/
//LAS QUE NO SE USAN : 
function videoTextureSetup() {
	video = document.getElementById('container');
	videoTexture = new THREE.VideoTexture(video);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	videoTexture.format = THREE.RGBFormat;
}