import {Coin, Egg, Mushroom, Star, Goomba, Cloud, Colors} from '/js/models/objects.js'

export default class Game {
    
    radius = 600
    nClouds = 20
    nCoins = 30
    nGoombas = 30
    nEggs = 5
    nStars = 1
    nMushrooms = 1

    coinAudio = new Audio('/models/coin/sounds/catch.mp3')

    constructor(scene, camera, renderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        
        this.level = document.getElementById('level')
        this.distance = document.getElementById('dist')
        this.energy = document.getElementById('energy')

        this.coinAudio.volume = 0.05

        this.coinsArray = []
        Coin.load().then((mesh) => {
            for (var i = 0; i < this.nCoins; i++) {
                this.coinsArray.push(new Coin(mesh.clone()))
            } this.randomGenerator(this.coinsArray, this.nCoins)
        })

        this.goombasArray = []
        Goomba.load().then((mesh) => {
            for (var i = 0; i < this.nCoins; i++) {
                this.goombasArray.push(new Goomba(mesh.clone()))
            } this.randomGenerator(this.goombasArray, this.nGoombas)
        })
        this.eggsArray = []
        Egg.load().then((mesh) => {
            for (var i = 0; i < this.nCoins; i++) {
                this.eggsArray.push(new Egg(mesh.clone()))
            } this.randomGenerator(this.eggsArray, this.nEggs)
        })

        this.initScene()
    }

    async initScene() {
        this.renderer.setClearColor(Colors.blue, 1);
        this.scene.background = null
        
        document.getElementById('instructions').style.display = 'none'
        this.level.style.visibility = 'visible'
        this.distance.style.visibility = 'visible'
        this.energy.style.visibility = 'visible'
        
        this.world()
        this.initCamera()
    }

    initCamera() {
        var camera_tween1 = new TWEEN.Tween(this.camera.position).to({x: 100}, 2000)
        var camera_tween2 = new TWEEN.Tween(this.camera.position).to({y: 30}, 2000)
        var camera_tween3 = new TWEEN.Tween(this.camera.position).to({z: this.camera.position.z+50}, 2000)
            .onComplete(() => {
                //this.start()
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
            var cylinder = new THREE.Mesh(geometry, material)
            cylinder.position.y = -607
            cylinder.position.x = -100
            cylinder.rotation.x = 90*Math.PI/180
            this.scene.add(cylinder)

            //var rotation_tween = new TWEEN.Tween(cylinder.rotation).to({y: -360*Math.PI/180}, 50000).repeat(Infinity)
            //TWEEN.add(rotation_tween)
        })

        // sky
        var sky = new THREE.Object3D()
        var h = this.radius + 200
        for (var i = 0; i < this.nClouds; i++) {
            var c = new Cloud()
            var a = Math.PI*2/this.nClouds*i
            c.mesh.position.x = Math.cos(a)*h
            c.mesh.position.y = Math.sin(a)*h
            c.mesh.position.z = 200-Math.random()*500
            c.mesh.rotation.z = a + Math.PI/2
            var s = 1 + Math.random()*2
            c.mesh.scale.set(s, s, s)
            sky.add(c.mesh)
        }
        sky.position.y = -607
        sky.position.x = -100
        this.scene.add(sky)
        
        //var rotation_tween = new TWEEN.Tween(sky.rotation).to({z: -360*Math.PI/180}, 50000).repeat(Infinity)
        //TWEEN.add(rotation_tween)
    }

    randomGenerator(arr, n) {
        var object = new THREE.Object3D()
        var a = Math.PI*2/n
        var h = this.radius
        for (var i = 0; i < n; i++) {
            var o = arr[i]
            o.mesh.position.x = Math.cos(a*i)*h + Math.random()*20
            o.mesh.position.y = Math.sin(a*i)*h + 8
            o.mesh.position.z = 60-Math.random()*120
            o.move()
            object.add(o.mesh)
        }
        object.position.y = -607
        object.position.x = -100
        this.scene.add(object)
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