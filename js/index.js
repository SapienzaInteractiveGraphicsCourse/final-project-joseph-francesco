
import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';
'use strict';
//COLORS
var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	brownDark:0x23190f,
	pink:0xF5986E,
	yellow:0xf4ce93,
		blue: 0x32CD32,
	// blue:0x68c3c0,
};
var deltaTime = 0;
var game;
var initScene,  renderer, scene;
var camera, fieldOfView, aspectRatio, nearPlane, farPlane;
var yoshi;
var ambientLight;
var sea, sky;
var HEIGHT, WIDTH,
	mousePos = { x: 0, y: 0 };
var loader = new GLTFLoader();
HEIGHT = window.innerHeight;
WIDTH = window.innerWidth;

ambientLight = new THREE.AmbientLight(0xdc8874, .5);

function resetGame(){
  game = {speed:0,
		  initSpeed:.00035,
		  baseSpeed:.00035,
		  targetBaseSpeed:.00035,
		  incrementSpeedByTime:.0000025,
		  incrementSpeedByLevel:.000005,
		  distanceForSpeedUpdate:100,
		  speedLastUpdate:0,

		  distance:0,
		  ratioSpeedDistance:50,
		  energy:100,
		  ratioSpeedEnergy:3,

		  level:1,
		  levelLastUpdate:0,
		  distanceForLevelUpdate:1000,

		  yoshiDefaultHeight:100,
		  yoshiAmpHeight:80,
		  yoshiAmpWidth:75,
		  yoshiMoveSensivity:0.005,
		  yoshiRotXSensivity:0.0008,
		  yoshiRotZSensivity:0.0004,
		  yoshiFallSpeed:.001,
		  yoshiMinSpeed:1.2,
		  yoshiMaxSpeed:1.6,
		  yoshiSpeed:0,
		  yoshiCollisionDisplacementX:0,
		  yoshiCollisionSpeedX:0,

		  yoshiCollisionDisplacementY:0,
		  yoshiCollisionSpeedY:0,

		  seaRadius:600,
		  seaLength:800,
		  //seaRotationSpeed:0.006,
		  wavesMinAmp : 5,
		  wavesMaxAmp : 20,
		  wavesMinSpeed : 0.001,
		  wavesMaxSpeed : 0.003,

		  cameraFarPos:500,
		  cameraNearPos:150,
		  cameraSensivity:0.002,

		  coinDistanceTolerance:15,
		  coinValue:3,
		  coinsSpeed:.5,
		  coinLastSpawn:0,
		  distanceForCoinsSpawn:100,

		  ennemyDistanceTolerance:10,
		  ennemyValue:10,
		  ennemiesSpeed:.6,
		  ennemyLastSpawn:0,
		  distanceForEnnemiesSpawn:50,

		  status : "playing",
		 };
}


// MOUSE AND SCREEN EVENTS

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
	var tx = -1 + (event.clientX / WIDTH)*2;
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};
}

function handleTouchMove(event) {
	event.preventDefault();
	var tx = -1 + (event.touches[0].pageX / WIDTH)*2;
	var ty = 1 - (event.touches[0].pageY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};
}

function handleMouseUp(event){
	if (game.status == "waitingReplay"){
		resetGame();
		hideReplay();
	}
}

function handleTouchEnd(event){
	if (game.status == "waitingReplay"){
		resetGame();
		hideReplay();
	}
}


var Sea = function(){
  var geom = new THREE.CylinderGeometry(game.seaRadius,game.seaRadius,game.seaLength,40,10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  geom.mergeVertices();
  var l = geom.vertices.length;

  this.waves = [];

  for (var i=0;i<l;i++){
	var v = geom.vertices[i];
	//v.y = Math.random()*30;
	this.waves.push({y:v.y,
					 x:v.x,
					 z:v.z,
					 ang:Math.random()*Math.PI*2,
					 amp:game.wavesMinAmp + Math.random()*(game.wavesMaxAmp-game.wavesMinAmp),
					 speed:game.wavesMinSpeed + Math.random()*(game.wavesMaxSpeed - game.wavesMinSpeed)
					});
  };
  var mat = new THREE.MeshPhongMaterial({
	color:Colors.blue,
	transparent:true,
	opacity:.8,
	shading:THREE.FlatShading,

  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.name = "waves";
  this.mesh.receiveShadow = true;

}

Sea.prototype.moveWaves = function (){
  var verts = this.mesh.geometry.vertices;
  var l = verts.length;
  for (var i=0; i<l; i++){
	var v = verts[i];
	var vprops = this.waves[i];
	v.x =  vprops.x + Math.cos(vprops.ang)*vprops.amp;
	v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
	vprops.ang += vprops.speed*deltaTime;
	this.mesh.geometry.verticesNeedUpdate=true;
  }
}


var Sky = function(){
	this.mesh = new THREE.Object3D();
	this.nClouds = 20;
	this.clouds = [];
	var stepAngle = Math.PI*2 / this.nClouds;
	for(var i=0; i<this.nClouds; i++){
		var c = new Cloud();
		this.clouds.push(c);
		var a = stepAngle*i;
		var h = game.seaRadius + 150 + Math.random()*200;
		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;
		c.mesh.position.z = -300-Math.random()*500;
		c.mesh.rotation.z = a + Math.PI/2;
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);
		this.mesh.add(c.mesh);
	}
}

Sky.prototype.moveClouds = function(){
	for(var i=0; i<this.nClouds; i++){
		var c = this.clouds[i];
		c.rotate();
	}
	this.mesh.rotation.z += game.speed*deltaTime;

}

var Cloud = function(){
	this.mesh = new THREE.Object3D();
	this.mesh.name = "cloud";
	var geom = new THREE.CubeGeometry(20,20,20);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,

	});

	//*
	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){
		var m = new THREE.Mesh(geom.clone(), mat);
		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);
		this.mesh.add(m);
		m.castShadow = true;
		m.receiveShadow = true;

	}
	//*/
}

Cloud.prototype.rotate = function(){
	var l = this.mesh.children.length;
	for(var i=0; i<l; i++){
		var m = this.mesh.children[i];
		m.rotation.z+= Math.random()*.005*(i+1);
		m.rotation.y+= Math.random()*.002*(i+1);
	}
}

initScene = function() {

	scene = new THREE.Scene();

	loader.load( 'models/yoshi/scene.gltf', function   (object) {
		yoshi = object.scene;
		yoshi.position.y = +12;
		yoshi.position.z = -240;
		yoshi.rotation.y += 20;
		console.log( yoshi );
		scene.add( yoshi );
		playGame();
	}, undefined, function ( error ) {
		console.error( error );
	} );


};


window.onload = initScene();

function createSea(){
  sea = new Sea();
  sea.mesh.position.y = -game.seaRadius;
  scene.add(sea.mesh);
}

function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -game.seaRadius;
	scene.add(sky.mesh);
}

function normalize(v,vmin,vmax,tmin, tmax){
	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

function updateYoshi(){

	game.yoshiSpeed = normalize(mousePos.x,-.5,.5,game.yoshiMinSpeed, game.yoshiMaxSpeed);
	var targetY = normalize(mousePos.y,-.75,.75,game.yoshiDefaultHeight-game.yoshiAmpHeight, game.yoshiDefaultHeight+game.yoshiAmpHeight);
	var targetX = normalize(mousePos.x,-1,1,-game.yoshiAmpWidth*.7, -game.yoshiAmpWidth);

	game.yoshiCollisionDisplacementX += game.yoshiCollisionSpeedX;
	targetX += game.yoshiCollisionDisplacementX;


	game.yoshiCollisionDisplacementY += game.yoshiCollisionSpeedY;
	targetY += game.yoshiCollisionDisplacementY;

	yoshi.position.y += (targetY-yoshi.position.y)*deltaTime*game.yoshiMoveSensivity;
	yoshi.position.x += (targetX-yoshi.position.x)*deltaTime*game.yoshiMoveSensivity;

	yoshi.rotation.z = (targetY-yoshi.position.y)*deltaTime*game.yoshiRotXSensivity;
	yoshi.rotation.x = (yoshi.position.y-targetY)*deltaTime*game.yoshiRotZSensivity;
	var targetCameraZ = normalize(game.yoshiSpeed, game.yoshiMinSpeed, game.yoshiMaxSpeed, game.cameraNearPos, game.cameraFarPos);
	camera.fov = normalize(mousePos.x,-1,1,40, 80);
	camera.updateProjectionMatrix ()
	camera.position.y += (yoshi.position.y - camera.position.y)*deltaTime*game.cameraSensivity;

	game.yoshiCollisionSpeedX += (0-game.yoshiCollisionSpeedX)*deltaTime * 0.03;
	game.yoshiCollisionDisplacementX += (0-game.yoshiCollisionDisplacementX)*deltaTime *0.01;
	game.yoshiCollisionSpeedY += (0-game.yoshiCollisionSpeedY)*deltaTime * 0.03;
	game.yoshiCollisionDisplacementY += (0-game.yoshiCollisionDisplacementY)*deltaTime *0.01;

}

function playGame(){

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x404040, 1 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );

	document.body.appendChild( renderer.domElement );


	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 50;
	nearPlane = .1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);


	var light = new THREE.AmbientLight( 0x2f2f1f , 2 );
	scene.add( light );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set(0,1,0)
	scene.add( directionalLight );

	resetGame();
	createSea();
	createSky();


	// scene.fog = new THREE.Fog(0xf7d9aa, 30,1250);
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = game.yoshiDefaultHeight;
	scene.add( camera );


	document.addEventListener('mousemove', handleMouseMove, false);
	document.addEventListener('touchmove', handleTouchMove, false);
	document.addEventListener('mouseup', handleMouseUp, false);
	document.addEventListener('touchend', handleTouchEnd, false);



	renderer.render(scene, camera);
	requestAnimationFrame(loop);
	// var orbit = new OrbitControls( camera, renderer.domElement );
	// orbit.enableZoom = false;

}

function loop(){


	sea.mesh.rotation.z += game.speed*deltaTime;//*game.seaRotationSpeed;
	if ( sea.mesh.rotation.z > 2*Math.PI)  sea.mesh.rotation.z -= 2*Math.PI;
	ambientLight.intensity += (.5 - ambientLight.intensity)*deltaTime*0.005;


	updateYoshi();
	game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
	game.speed = game.baseSpeed * game.yoshiSpeed;

	sky.moveClouds();
	sea.moveWaves();

	renderer.render(scene, camera);
	requestAnimationFrame(loop);
}
