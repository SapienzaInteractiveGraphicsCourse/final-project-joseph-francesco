import {Coin, Egg, Mushroom, Star, Goomba, Cloud, Colors} from '/js/models/objects.js'

class GameSettings {

    settings = {
        speed:1,
        initSpeed:1,
        targetSpeed:.00001,
        incrementSpeedByDistance:.00001,
        incrementSpeedByLevel:.0005,
        distanceForSpeedUpdate:100,
        speedLastUpdate:0,
        maxSpeed:30,
        
        rotationSpeed:1,
        ratioRotationSpeed:.00000001,
        yoshiSpeed:1,
        ratioYoshiSpeed:.00000001,
        
        distance:0,
        ratioSpeedDistance:.25,
        energy:100,
        ratioSpeedEnergy:.01,

        level:1,
        levelLastUpdate:0,
        distanceForLevelUpdate:1000,

        fieldRadius:600, 
        fieldLength:800,
        xPosition:-100,
        yPosition:-607,

        coinDistanceTolerance:15,
        coinValue:3,
        coinLastSpawn:0,
        distanceForEnergySpawn:100,

        enemyDistanceTolerance:10,
        enemyValue:10,
        enemyLastSpawn:0,
        distanceForEnnemiesSpawn:50,

        nClouds:20,
        nCoins:30,
        nGoombas:30,
        nEggs:5,

        coinsArray:[],
        goombasArray:[],
        eggsArray:[],

        title: 'Yoshi',
        subtitle: 'corre forever',

        status:'init'
    }
}

export default class Game {

    game = new GameSettings().settings
    
    title = document.getElementById("title")
    subtitle = document.getElementById('subtitle')
    level = document.getElementById('level')
    distance = document.getElementById('dist')
    energy = document.getElementById('energy')
    fieldDistance = document.getElementById("distValue")
    fieldLevel = document.getElementById("levelValue")
    fieldEnergy = document.getElementById("energyValue")
    instruction = document.getElementById('instructions')
    globalMesh = new THREE.Object3D()
    globalRotationTween = new TWEEN.Tween(this.globalMesh.rotation).to({z: -360*Math.PI/180}, 50000).repeat(Infinity)

    constructor(scene, camera, renderer, yoshi) {
    
        this.scene = scene
        this.camera = camera
        this.renderer = renderer    
        this.yoshi = yoshi
        
        this.coinAudio = new Audio('/models/coin/sounds/catch.mp3')
        this.goombaAudio = new Audio('/models/goomba/sounds/ouch.mp3')
        this.eggAudio = new Audio('/models/egg/sounds/eat.mp3')
        this.coinAudio.volume = 0.05
        this.eggAudio.volume = 0.05
        this.goombaAudio.volume = 0.05

        Coin.load().then((mesh) => {this.coinMesh = mesh})
        Goomba.load().then((mesh) => {this.goombaMesh = mesh})
        Egg.load().then((mesh) => {this.eggMesh = mesh})
        new THREE.TextureLoader().load('assets/grass.jpeg', (texture) => {
            this.worldTexture = texture
            this.init()
        })

        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case 'Enter':
                    this.play()
                    break
                case 'p':
                    console.log(this.game)
                    console.log(this.yoshi)
                    console.log(this.globalMesh)
                default:
                    break
            }
        }, false)
    }

    init() {
        // field
        var geometry = new THREE.CylinderGeometry(this.game.fieldRadius, this.game.fieldRadius, this.game.fieldLength, 64)
        var material = new THREE.MeshBasicMaterial({map: this.worldTexture})
        var cylinder = new THREE.Mesh(geometry, material)
        cylinder.rotation.x = 90*Math.PI/180
        cylinder.name = 'Field'
        this.globalMesh.add(cylinder)

        // sky
        var sky = new THREE.Object3D()
        sky.name = 'Sky'
        var stepAngle = Math.PI*2 / this.game.nClouds
        
        for (var i = 0; i < this.game.nClouds; i++) {
            var c = new Cloud()
            var a = stepAngle*i
            var h = this.game.fieldRadius + 200
            c.mesh.position.y = Math.sin(a)*h
            c.mesh.position.x = Math.cos(a)*h
            c.mesh.position.z = 200-Math.random()*500
            c.mesh.rotation.z = a + Math.PI/2
            var s = 1 + Math.random()*2
            c.mesh.scale.set(s, s, s)
            sky.add(c.mesh)
        } 
        this.globalMesh.add(sky)
        this.globalMesh.position.x = this.game.xPosition
        this.globalMesh.position.y = this.game.yPosition
    }

    play() {
        if (this.game.status == 'playing') return
        
        else if (this.game.status == 'init') {
            this.scene.background = null
            this.instruction.style.display = 'none'
            this.level.style.visibility = 'visible'
            this.distance.style.visibility = 'visible'
            this.energy.style.visibility = 'visible'
            this.renderer.setClearColor(Colors.blue, 1);
            this.scene.add(this.globalMesh)
            this.initCamera()
        }
        
        else if (this.game.status == 'waiting') this.reset()
        
        this.yoshi.play()

        this.spawnCoins()
        this.spawnGoombas()
    }

    reset() {
        this.game = new GameSettings().settings
        this.fieldEnergy.innerHTML = this.game.energy
        this.fieldLevel.innerHTML = this.game.level
        this.fieldDistance.innerHTML = this.game.distance
        this.title.innerHTML = this.game.title
        this.subtitle.innerHTML = this.game.subtitle
        this.globalRotationTween.delay(2000).start().onStart(() => {
            this.game.status = 'playing'
        })
    }

    initCamera() {
        var camera_tween1 = new TWEEN.Tween(this.camera.position).to({x: 100}, 2000)
        var camera_tween2 = new TWEEN.Tween(this.camera.position).to({y: 30}, 2000)
        var camera_tween3 = new TWEEN.Tween(this.camera.position).to({z: this.camera.position.z+50}, 2000)
            .onComplete(() => {
                this.globalRotationTween.start()
                this.game.status = 'playing'
            })
        camera_tween1.start()
        camera_tween2.start()
        camera_tween3.start()
    }
    
    spawnCoins() {    
        for (var i = 0; i < this.game.nCoins; i++) {
            this.game.coinsArray.push(new Coin(this.coinMesh.clone()))
        } this.randomGenerator(this.game.coinsArray, this.game.nCoins, 'Coins')
    }

    spawnGoombas() {
        for (var i = 0; i < this.game.nGoombas; i++) {
            this.game.goombasArray.push(new Goomba(this.goombaMesh.clone()))
        } this.randomGenerator(this.game.goombasArray, this.game.nGoombas, 'Goombas')
    } 

    spawnEggs() {
        for (var i = 0; i < this.game.nEggs; i++) {
            this.game.eggsArray.push(new Egg(this.eggMesh.clone()))
        } this.randomGenerator(this.game.eggsArray, this.game.nEggs, 'Eggs')
    }

    randomGenerator(arr, n, name) {
        var object = new THREE.Object3D()
        object.name = name
        var a = Math.PI*2/n
        var h = this.game.fieldRadius
        for (var i = 0; i < n; i++) {
            var o = arr[i]
            o.mesh.position.x = Math.cos(a*i)*h + Math.random()*10
            o.mesh.position.y = Math.sin(a*i)*h + 8
            o.mesh.position.z = 60-Math.random()*120
            //o.mesh.rotation.z = a*i + Math.PI/2
            //o.mesh.rotation.y = a*i
            o.move()
            object.add(o.mesh)
        }
        this.globalMesh.add(object)
    }

    addEnergy() {
        this.game.energy += this.game.coinValue;
        this.game.energy = Math.min(this.game.energy, 100);
    }

    removeEnergy() {
        this.game.energy -= this.game.enemyValue;
        this.game.energy = Math.max(0, this.game.energy);
    }

    updateEnergy() {
        this.game.energy -= this.game.speed*this.game.ratioSpeedEnergy;
        this.game.energy = Math.max(0, this.game.energy);
        this.fieldEnergy.innerHTML = Math.floor(this.game.energy);
        
        if (this.game.energy < 1) {
            this.game.status = 'gameover';
        }
    }

    updateDistance() {
        this.game.distance += this.game.speed*this.game.ratioSpeedDistance;
        this.fieldDistance.innerHTML = Math.floor(this.game.distance);
    }

    updateSpeed() {
        if (this.game.speed < this.game.maxSpeed) {
            this.game.speed += this.game.targetSpeed
            this.game.rotationSpeed += this.game.speed*this.game.ratioRotationSpeed
            this.game.yoshiSpeed += this.game.speed*this.game.ratioYoshiSpeed
            this.globalRotationTween.duration(this.globalRotationTween._duration/this.game.rotationSpeed)
        }
    }

    update() {
        this.yoshi.update(this.game.yoshiSpeed)
        
        if (this.game.status == 'playing') {
            
            // Add energy
            if (Math.floor(this.game.distance)%this.game.distanceForEnergySpawn == 0 && Math.floor(this.game.distance) > this.game.coinLastSpawn) {
                this.game.coinLastSpawn = Math.floor(this.game.distance);
                // spown coins
            }

            // Add enemies
            if (Math.floor(this.game.distance)%this.game.distanceForEnnemiesSpawn == 0 && Math.floor(this.game.distance) > this.game.enemyLastSpawn) {
                this.game.enemyLastSpawn = Math.floor(this.game.distance);
                // spawn enemies
            }

            // distance speed update
            if (Math.floor(this.game.distance)%this.game.distanceForSpeedUpdate == 0 && Math.floor(this.game.distance) > this.game.speedLastUpdate) {
                this.game.speedLastUpdate = Math.floor(this.game.distance);
                this.game.targetSpeed += this.game.incrementSpeedByDistance;
                this.updateSpeed()
            } 

            // level speed update
            if (Math.floor(this.game.distance)%this.game.distanceForLevelUpdate == 0 && Math.floor(this.game.distance) > this.game.levelLastUpdate) {
                this.game.levelLastUpdate = Math.floor(this.game.distance)
                this.game.level++
                this.game.targetSpeed += this.game.incrementSpeedByLevel*this.game.level
                this.fieldLevel.innerHTML = Math.floor(this.game.level)
            }

            this.updateSpeed()
            this.updateDistance()
            this.updateEnergy()

        } else if (this.game.status == 'gameover') {
            
            this.game.status = 'waiting'
            console.log('Game over!')
            this.globalRotationTween.stop()
            this.title.innerHTML = 'GAME OVER'
            this.subtitle.innerHTML = 'Press Start to Play Again'
            this.yoshi.cry()   
        }
    }
}