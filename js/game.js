import {Coin, Egg, Mushroom, Star, Goomba} from '/js/models/characters.js'

var game;
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var fieldLevel;
var rotation_tween;
var coinsHolder;

export class Game {

    constructor(scene, camera, renderer) {

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

            planeDefaultHeight:100,
            planeAmpHeight:80,
            planeAmpWidth:75,
            planeMoveSensivity:0.005,
            planeRotXSensivity:0.0008,
            planeRotZSensivity:0.0004,
            planeFallSpeed:.001,
            planeMinSpeed:1.2,
            planeMaxSpeed:1.6,
            planeSpeed:0,
            planeCollisionDisplacementX:0,
            planeCollisionSpeedX:0,

            planeCollisionDisplacementY:0,
            planeCollisionSpeedY:0,

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
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.radius = 600
        this.level = document.getElementById('level')
        this.distance = document.getElementById('dist')
        this.energy = document.getElementById('energy')
        this.fieldDistance = document.getElementById("distValue");
        fieldLevel = document.getElementById("levelValue");
        this.energyBar = document.getElementById("energyValue");
        this.coins = []
        this.initScene()
        fieldLevel.innerHTML = Math.floor(game.level);
    }

    async initScene() {
        this.renderer.setClearColor(Colors.blue, 1);
        this.scene.background = null
        document.getElementById('instructions').style.display = 'none'
        this.level.style.visibility = 'visible'
        this.distance.style.visibility = 'visible'
        this.energy.style.visibility = 'visible'
        this.initCamera()
        this.world()
        this.objectGenerator()

    }


    initCamera() {
        var camera_tween1 = new TWEEN.Tween(this.camera.position).to({x: 100}, 2000)
        var camera_tween2 = new TWEEN.Tween(this.camera.position).to({y: 30}, 2000)
        var camera_tween3 = new TWEEN.Tween(this.camera.position).to({z: this.camera.position.z+50}, 2000)
            .onComplete(() => {
                this.start()
            })
        camera_tween1.start()
        camera_tween2.start()
        camera_tween3.start()
    }

    world() {
        // field
        var loader = new THREE.TextureLoader()
        loader.load('assets/grass.png', (texture) => {
            var geometry = new THREE.CylinderGeometry(this.radius, this.radius, 800, 64)
            var material = new THREE.MeshBasicMaterial({map: texture})
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.y = -607
            sphere.position.x = -100
            sphere.rotation.x = 90*Math.PI/180
            this.scene.add(sphere)

            var rotation_tween = new TWEEN.Tween(sphere.rotation).to({y: -360*Math.PI/180}, 50000).repeat(Infinity)
            TWEEN.add(rotation_tween)
        })

        // sky
        var sky = new THREE.Object3D();
        var nClouds = 20;
        var stepAngle = Math.PI*2 / nClouds;
        
        for (var i = 0; i < nClouds; i++) {
            var c = new Cloud();
            var a = stepAngle*i;
            var h = this.radius + 200
            c.mesh.position.y = Math.sin(a)*h;
            c.mesh.position.x = Math.cos(a)*h;
            c.mesh.position.z = 200-Math.random()*500;
            c.mesh.rotation.z = a + Math.PI/2;
            var s = 1 + Math.random()*2;
            c.mesh.scale.set(s, s, s);
            sky.add(c.mesh);
        }
        sky.position.y = -610
        sky.position.x = -100
        this.scene.add(sky);
        
        rotation_tween = new TWEEN.Tween(sky.rotation).to({z: -360*Math.PI/180}, 50000).repeat(Infinity)
        TWEEN.add(rotation_tween)
    }

    // generate coins etc.
    objectGenerator() {
        // var coin = new Coin(this.scene)
        // coin.load().then((mesh) => {
        //     the_scene.add(coin)
        // })
        this.createCoins();
    }

    start() {
        TWEEN.getAll().forEach(element => {
            element.start()
        })
    }

    stop() {
        TWEEN.removeAll()
    }

    updateDistance(){
        game.distance += game.speed*deltaTime*game.ratioSpeedDistance;
        this.fieldDistance.innerHTML = Math.floor(game.distance);
    }

    updateYoshi() {
        game.planeSpeed = 1.8;
        // game.planeSpeed = this.normalize(mousePos.x, -.5, .5, game.planeMinSpeed, game.planeMaxSpeed);
    }

    updateEnergy(){
        game.energy -= game.speed*deltaTime*game.ratioSpeedEnergy;
        //console.log('energy ',game.energy);
        game.energy = Math.max(0, game.energy);
        this.energyBar.innerHTML = Math.floor(game.energy);

        if (game.energy <1){
            game.status = "gameover";
        }
    }

    addEnergy(){
        game.energy += game.coinValue;
        game.energy = Math.min(game.energy, 100);
    }

    removeEnergy(){
        game.energy -= game.ennemyValue;
        game.energy = Math.max(0, game.energy);
    }

    normalize(v,vmin,vmax,tmin, tmax){
        var nv = Math.max(Math.min(v,vmax), vmin);
        var dv = vmax-vmin;
        var pc = (nv-vmin)/dv;
        var dt = tmax-tmin;
        var tv = tmin + (pc*dt);
        return tv;
    }


    createCoins(){

        coinsHolder = new CoinsHolder(20);
        the_scene.add(coinsHolder.mesh)
    }

}

var my_game, the_yoshi, the_orbit, the_scene, the_renderer, the_camera;

export default function InitGame(scene, camera, renderer, orbit, yoshi) {

    the_yoshi = yoshi;
    the_orbit = orbit;
    the_scene = scene;
    the_renderer = renderer;
    the_camera = camera;
    my_game = new Game(scene, camera, renderer);

    console.log('Im here boy ', this.the_orbit);
    loop();
}

function loop() {
    newTime = new Date().getTime();
    deltaTime = newTime-oldTime;
    oldTime = newTime;

    if (game.status=="playing"){

        // Add energy coins every 100m;
        if (Math.floor(game.distance)%game.distanceForCoinsSpawn == 0 && Math.floor(game.distance) > game.coinLastSpawn){
            game.coinLastSpawn = Math.floor(game.distance);
            coinsHolder.spawnCoins();
        }

        if (Math.floor(game.distance)%game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate){
            game.speedLastUpdate = Math.floor(game.distance);
            game.targetBaseSpeed += game.incrementSpeedByTime*deltaTime;
        }


        if (Math.floor(game.distance)%game.distanceForEnnemiesSpawn == 0 && Math.floor(game.distance) > game.ennemyLastSpawn){
            game.ennemyLastSpawn = Math.floor(game.distance);
            // ennemiesHolder.spawnEnnemies();
        }

        if (Math.floor(game.distance)%game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate){
            game.levelLastUpdate = Math.floor(game.distance);
            game.level++;
            fieldLevel.innerHTML = Math.floor(game.level);

            game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel*game.level
        }

        my_game.updateYoshi();
        my_game.updateDistance();
        my_game.updateEnergy();
        game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
        game.speed = game.baseSpeed * game.planeSpeed;

    }else if(game.status=="gameover"){
        console.log('Game over! ');
        game.speed *= 0.0;
        // airplane.mesh.rotation.z += (-Math.PI/2 - airplane.mesh.rotation.z)*.0002*deltaTime;
        // airplane.mesh.rotation.x += 0.0003*deltaTime;
        game.planeFallSpeed *= 1.05;
        the_yoshi.cry();

        TWEEN.remove(rotation_tween)
        // airplane.mesh.position.y -= game.planeFallSpeed*deltaTime;

        // if (airplane.mesh.position.y <-200){
        //     showReplay();
        //     game.status = "waitingReplay";
        //
        // }
    }else if (game.status=="waitingReplay"){

    }


    animate();
}


var CoinNew = function(){
    var geom = new THREE.TetrahedronGeometry(5,0);
    var mat = new THREE.MeshPhongMaterial({
        color:0x009999,
        shininess:0,
        specular:0xffffff,

        shading:THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom,mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
}

var CoinsHolder = function (nCoins){
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
    this.coinsPool = [];
    for (var i=0; i<nCoins; i++){
        console.log('coin created')
        var coin_val = new CoinNew();
        this.coinsPool.push(coin_val);
    }
}

CoinsHolder.prototype.spawnCoins = function(){

    var nCoins = 1 + Math.floor(Math.random()*10);
    var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight-20);
    var amplitude = 10 + Math.round(Math.random()*10);
    for (var i=0; i<nCoins; i++){
        var coin_act;
        if (this.coinsPool.length) {
            coin_act = this.coinsPool.pop();
        }else{
            coin_act = new CoinNew();
        }
        this.mesh.add(coin_act.mesh);
        this.coinsInUse.push(coin_act);
        coin_act.angle = - (i*0.02);
        coin_act.distance = d + Math.cos(i*.5)*amplitude;
        coin_act.mesh.position.y = -game.seaRadius + Math.sin(coin_act.angle)*coin_act.distance;
        coin_act.mesh.position.x = Math.cos(coin_act.angle)*coin_act.distance;
    }
}

CoinsHolder.prototype.rotateCoins = function(){
    for (var i=0; i<this.coinsInUse.length; i++){
        var coin = this.coinsInUse[i];
        if (coin.exploding) continue;
        coin.angle += game.speed*deltaTime*game.coinsSpeed;
        if (coin.angle>Math.PI*2) coin.angle -= Math.PI*2;
        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.distance;
        coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
        coin.mesh.rotation.z += Math.random()*.1;
        coin.mesh.rotation.y += Math.random()*.1;

        //var globalCoinPosition =  coin.mesh.localToWorld(new THREE.Vector3());
        var diffPos = airplane.mesh.position.clone().sub(coin.mesh.position.clone());
        var d = diffPos.length();
        if (d<game.coinDistanceTolerance){
            this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
            this.mesh.remove(coin.mesh);
            particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0x009999, .8);
            addEnergy();
            i--;
        }else if (coin.angle > Math.PI){
            this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
            this.mesh.remove(coin.mesh);
            i--;
        }
    }
}




function animate() {
    requestAnimationFrame(loop);
    the_orbit.update();
    the_yoshi.update();
    the_renderer.render(the_scene, the_camera);
    TWEEN.update();
}
var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	brownDark:0x23190f,
	pink:0xF5986E,
	yellow:0xf4ce93,
	blue: 0x99CCff,
};

class Cloud {
    
    constructor() {
        this.mesh = new THREE.Object3D()
        this.mesh.name = "cloud"
        var geom = new THREE.CubeGeometry(20, 20, 20)
        var mat = new THREE.MeshPhongMaterial({
            color: Colors.white,
        })

        var nBlocs = 3 + Math.floor(Math.random() * 3)
        for (var i = 0; i < nBlocs; i++) {
            var m = new THREE.Mesh(geom.clone(), mat)
            m.position.x = i * 15
            m.position.y = Math.random() * 10
            m.position.z = Math.random() * 10
            m.rotation.z = Math.random() * Math.PI * 2
            m.rotation.y = Math.random() * Math.PI * 2
            var s = .1 + Math.random() * .9
            m.scale.set(s, s, s)
            this.mesh.add(m)
            m.castShadow = true
            m.receiveShadow = true
        }
    }
}