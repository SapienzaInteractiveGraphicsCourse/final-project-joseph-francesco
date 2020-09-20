import {Coin, Egg, Mushroom, Star, Goomba} from '/js/models/characters.js'

export default class Game {

    constructor(scene, camera, renderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.radius = 600
        this.level = document.getElementById('level')
        this.distance = document.getElementById('dist')
        this.energy = document.getElementById('energy')
        this.coins = []
        this.initScene()
    }

    async initScene() {

        fieldDistance = document.getElementById("distValue");
        energyBar = document.getElementById("energyBar");

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
            //this.scene.add(sphere)

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
        
        var rotation_tween = new TWEEN.Tween(sky.rotation).to({z: -360*Math.PI/180}, 50000).repeat(Infinity)
        TWEEN.add(rotation_tween)
    }

    // generate coins etc.
    objectGenerator() {
        
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
        fieldDistance.innerHTML = Math.floor(game.distance);
        var d = 502*(1-(game.distance%game.distanceForLevelUpdate)/game.distanceForLevelUpdate);
        levelCircle.setAttribute("stroke-dashoffset", d);

    }

    updateEnergy(){
        game.energy -= game.speed*deltaTime*game.ratioSpeedEnergy;
        game.energy = Math.max(0, game.energy);

        if (game.energy<30){
            energyBar.style.animationName = "blinking";
        }else{
            energyBar.style.animationName = "none";
        }

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
}

var fieldDistance, energyBar;

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