import {Coin, Egg, Mushroom, Star, Goomba} from '/js/models/characters.js'

export default class Game {

    constructor(scene, camera, renderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.radius = 600
        this.initScene()
    }

    async initScene() {
        this.renderer.setClearColor(Colors.blue, 1);
        this.scene.background = null
        document.getElementById('instructions').style.display = 'none'
        document.getElementById('level').style.visibility = 'visible'
        document.getElementById('dist').style.visibility = 'visible'
        document.getElementById('energy').style.visibility = 'visible'
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
        
        for(var i = 0; i < nClouds; i++){
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