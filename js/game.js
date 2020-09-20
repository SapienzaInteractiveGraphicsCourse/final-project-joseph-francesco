import {Coin, Egg, Mushroom, Star, Goomba, Cloud, Colors} from '/js/models/objects.js'

export default class Game {

    deltaTime = 0;
    newTime = new Date().getTime();
    oldTime = new Date().getTime();

    game = {speed:0,
        initSpeed:.00035,
        baseSpeed:.00035,
        targetBaseSpeed:.00035,
        yoshiSpeed: 1,
        incrementYoshiSpeedByTime:.0005,
        incrementSpeedByTime:.0000025,
        incrementSpeedByLevel:.000005,
        distanceForSpeedUpdate:100,
        speedLastUpdate:0,
        
        distance:0,
        ratioSpeedDistance:50,
        energy:100,
        ratioSpeedEnergy:8,

        level:1,
        levelLastUpdate:0,
        distanceForLevelUpdate:1000,

        fieldRadius:600, 
        fieldLength:800, 

        coinDistanceTolerance:15,
        coinValue:3,
        coinLastSpawn:0,
        distanceForCoinsSpawn:100,

        ennemyDistanceTolerance:10,
        ennemyValue:10,
        ennemyLastSpawn:0,
        distanceForEnnemiesSpawn:50,

        nClouds:20,
        nCoins:30,
        nGoombas:30,
        nEggs:5,

        coinsArray: [],
        goombasArray: [],
        eggsArray: [],

        coinAudio: new Audio('/models/coin/sounds/catch.mp3'),
        goombaAudio: new Audio('/models/goomba/sounds/ouch.mp3'),
        eggAudio: new Audio('/models/egg/sounds/eat.mp3'),

        status : 'waiting'
    }

    level = document.getElementById('level')
    distance = document.getElementById('dist')
    energy = document.getElementById('energy')
    fieldDistance = document.getElementById("distValue")
    fieldLevel = document.getElementById("levelValue")
    fieldEnergy = document.getElementById("energyValue")
    instruction = document.getElementById('instructions')

    constructor(scene, camera, renderer, yoshi) {
    
        this.scene = scene
        this.camera = camera
        this.renderer = renderer    
        this.yoshi = yoshi
    
        this.game.coinAudio.volume = 0.05
        this.game.eggAudio.volume = 0.05
        this.game.goombaAudio.volume = 0.05
    }

    play() {
        this.scene.background = null
        this.renderer.setClearColor(Colors.blue, 1);

        this.instruction.style.display = 'none'
        this.level.style.visibility = 'visible'
        this.distance.style.visibility = 'visible'
        this.energy.style.visibility = 'visible'
        this.fieldLevel.innerHTML = Math.floor(this.game.level);

        this.world()
        this.yoshi.play()
        this.initCamera()
    }

    initCamera() {
        var camera_tween1 = new TWEEN.Tween(this.camera.position).to({x: 100}, 2000)
        var camera_tween2 = new TWEEN.Tween(this.camera.position).to({y: 30}, 2000)
        var camera_tween3 = new TWEEN.Tween(this.camera.position).to({z: this.camera.position.z+50}, 2000)
            .onComplete(() => {
                this.game.status = 'playing'
                // TODO yoshi starts moving circularly
                // Camera start moving following Yoshi
            })
        camera_tween1.start()
        camera_tween2.start()
        camera_tween3.start()
    }

    world() {
        // field
        var loader = new THREE.TextureLoader()
        loader.load('assets/grass.png', (texture) => {
            var geometry = new THREE.CylinderGeometry(this.game.fieldRadius, this.game.fieldRadius, this.game.fieldLength, 64)
            var material = new THREE.MeshBasicMaterial({map: texture})
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.y = -607
            sphere.position.x = -100
            sphere.rotation.x = 90*Math.PI/180
            this.scene.add(sphere)

            //var rotation_tween = new TWEEN.Tween(sphere.rotation).to({y: -360*Math.PI/180}, 50000).repeat(Infinity)
            //TWEEN.add(rotation_tween)
        })

        // sky
        var sky = new THREE.Object3D();
        var stepAngle = Math.PI*2 / this.game.nClouds;
        
        for (var i = 0; i < this.game.nClouds; i++) {
            var c = new Cloud();
            var a = stepAngle*i;
            var h = this.game.fieldRadius + 200
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
        
        //var rotation_tween = new TWEEN.Tween(sky.rotation).to({z: -360*Math.PI/180}, 50000).repeat(Infinity)
        //TWEEN.add(rotation_tween)

        this.spawnCoins()
        this.spawnGoombas()
        this.spawnEggs()
    }
    
    spawnCoins() {
        Coin.load().then((mesh) => {
            for (var i = 0; i < this.game.nCoins; i++) {
                this.game.coinsArray.push(new Coin(mesh.clone()))
            } this.randomGenerator(this.game.coinsArray, this.game.nCoins)
        })
    }

    spawnGoombas() {
        Goomba.load().then((mesh) => {
            for (var i = 0; i < this.game.nGoombas; i++) {
                this.game.goombasArray.push(new Goomba(mesh.clone()))
            } this.randomGenerator(this.game.goombasArray, this.game.nGoombas)
        })
    } 

    spawnEggs() {
        Egg.load().then((mesh) => {
            for (var i = 0; i < this.game.nEggs; i++) {
                this.game.eggsArray.push(new Egg(mesh.clone()))
            } this.randomGenerator(this.game.eggsArray, this.game.nEggs)
        })
    }

    randomGenerator(arr, n) {
        var object = new THREE.Object3D()
        var a = Math.PI*2/n
        var h = this.game.fieldRadius
        for (var i = 0; i < n; i++) {
            var o = arr[i]
            o.mesh.position.x = Math.cos(a*i)*h + Math.random()*10
            o.mesh.position.y = Math.sin(a*i)*h + 8
            o.mesh.position.z = 60-Math.random()*120
            o.move()
            object.add(o.mesh)
        }
        object.position.y = -607
        object.position.x = -100
        this.scene.add(object)
    }

    addEnergy() {
        this.game.energy += this.game.coinValue;
        this.game.energy = Math.min(this.game.energy, 100);
    }

    removeEnergy() {
        this.game.energy -= this.game.ennemyValue;
        this.game.energy = Math.max(0, this.game.energy);
    }

    updateEnergy() {
        this.game.energy -= this.game.speed*this.deltaTime*this.game.ratioSpeedEnergy;
        this.game.energy = Math.max(0, this.game.energy);
        this.fieldEnergy.innerHTML = Math.floor(this.game.energy);
        
        if (this.game.energy <1){
            this.game.status = 'gameover';
        }
    }

    updateDistance() {
        this.game.distance += this.game.speed*this.deltaTime*this.game.ratioSpeedDistance;
        this.fieldDistance.innerHTML = Math.floor(this.game.distance);
    }

    update() {

        this.newTime = new Date().getTime();
        this.deltaTime = this.newTime-this.oldTime;
        this.oldTime = this.newTime;
        this.yoshi.update(this.game.yoshiSpeed)

        if (this.game.status == 'playing'){

            // Add energy coins
            if (Math.floor(this.game.distance)%this.game.distanceForCoinsSpawn == 0 && Math.floor(this.game.distance) > this.game.coinLastSpawn){
                this.game.coinLastSpawn = Math.floor(this.game.distance);
                // spown coins
            }

            // Add ennemies
            if (Math.floor(this.game.distance)%this.game.distanceForEnnemiesSpawn == 0 && Math.floor(this.game.distance) > this.game.ennemyLastSpawn){
                this.game.ennemyLastSpawn = Math.floor(this.game.distance);
                // spawn ennemies
            }

            if (Math.floor(this.game.distance)%this.game.distanceForSpeedUpdate == 0 && Math.floor(this.game.distance) > this.game.speedLastUpdate){
                this.game.speedLastUpdate = Math.floor(this.game.distance);
                this.game.targetBaseSpeed += this.game.incrementSpeedByTime;
                this.game.yoshiSpeed += this.game.incrementYoshiSpeedByTime;
            } 

            if (Math.floor(this.game.distance)%this.game.distanceForLevelUpdate == 0 && Math.floor(this.game.distance) > this.game.levelLastUpdate){
                this.game.levelLastUpdate = Math.floor(this.game.distance);
                this.game.level++;
                this.game.targetBaseSpeed = this.game.initSpeed + this.game.incrementSpeedByLevel*this.game.level
                this.fieldLevel.innerHTML = Math.floor(this.game.level);
            }

            this.updateDistance();
            this.updateEnergy();
            this.game.baseSpeed += (this.game.targetBaseSpeed - this.game.baseSpeed) * 0.02;
            this.game.speed = this.game.baseSpeed * this.game.yoshiSpeed;

        } else if (this.game.status == 'gameover') {
            
            this.game.status = 'waiting'
            console.log('Game over!')
            this.game.speed *= 0.0
            this.yoshi.cry()
            
        } else if (this.game.status == 'waiting') {
            
        }
    }
}