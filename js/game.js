import {Coin, Egg, Mushroom, Goomba, Block, Cloud, Colors} from './models/objects.js'

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
        
        rotationSpeed:0,
        ratioRotationSpeed:.05,
        maxRotation:false,
        maxRotationSpeed:12,
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
        yPosition:615,

        cameraOffsetX:100.87,

        coinValue:3,
        goombaValue:5,
        eggValue: 10,
        blockValue:10,
        
        coinSpawn:false,
        eggSpawn:false,
        mushroomSpawn:false,
        goombasSpawn:false,
        blockSpawn:false,

        nClouds:20,
        nCoins:30,
        nEggs:10,
        nMushrooms: 2,
        nGoombas:20,
        nBlocks: 11,

        minCoins:15,
        minEggs:5,
        minMushrooms: 1,
        minGommbas:8,
        minBlocks:4,

        coinsArray:[],
        goombasArray:[],
        eggsArray:[],
        mushroomsArray:[],
        blocksArray:[],

        collidableArray:[],

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
    keys = document.getElementById('keys')
    leftKey = document.getElementById('leftKey')
    rightKey = document.getElementById('rightKey')
    spaceKey = document.getElementById('spaceKey')

    constructor(scene, camera, renderer, yoshi) {
    
        this.scene = scene
        this.camera = camera
        this.renderer = renderer    
        this.yoshi = yoshi

        yoshi.yoshi.radius = this.game.yPosition
        
        this.gameAudio = new Audio('/assets/yoshi_circuit.mp3')
        this.coinAudio = new Audio('/models/coin/sounds/catch.mp3')
        this.ouchAudio = new Audio('/models/goomba/sounds/ouch.mp3')
        this.eggAudio = new Audio('/models/egg/sounds/eat.mp3')
        this.destroyBlockAudio = new Audio('/models/block/sounds/destroy.mp3')
        this.smashGoombaAudio = new Audio('/models/goomba/sounds/destroy.mp3')
        
        this.coinAudio.volume = 0.3
        this.ouchAudio.volume = 0.5
        this.eggAudio.volume = 0.5
        this.destroyBlockAudio.volume = 0.4
        this.smashGoombaAudio.volume = 0.1
        this.gameAudio.volume = 0.2

        Coin.load().then((mesh) => {this.coinMesh = mesh})
        Goomba.load().then((mesh) => {this.goombaMesh = mesh})
        Egg.load().then((mesh) => {this.eggMesh = mesh})
        Mushroom.load().then((mesh) => {this.mushroomMesh = mesh})
        Block.load().then((mesh) => {this.blockMesh = mesh})

        this.globalMesh = new THREE.Object3D()
        this.globalMesh.name = 'Global'
        this.enemyMesh = new THREE.Object3D()
        this.enemyMesh.name = 'Enemy'

        new THREE.TextureLoader().load('/assets/grass.jpeg', (texture) => {
            this.worldTexture = texture
            this.init()

            document.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case 'Enter':
                        this.play()
                        break
                    case 'p':
                        console.log(this.scene)    
                        console.log(this.game)
                        console.log(this.yoshi)

                    case 'ArrowRight':
                        this.rightKey.style.transform = "translateY(3px)"
                        break
                    
                    case 'ArrowLeft':
                        this.leftKey.style.transform = "translateY(3px)"
                        break

                    case ' ':
                        this.spaceKey.style.transform = "translateY(3px)"
                        break

                    default:
                        break
                }
            }, false)

            document.addEventListener("keyup", (event) => {
                switch (event.key) {
                    case 'ArrowRight':
                        this.rightKey.style.transform = "translateY(0px)"
                        break
                    
                    case 'ArrowLeft':
                        this.leftKey.style.transform = "translateY(0px)"
                        break

                    case ' ':
                        this.spaceKey.style.transform = "translateY(0px)";
                        break
    
                    default:
                        break
                }
            })
        })
    }

    init() {
        // field
        var geometry = new THREE.CylinderGeometry(this.game.fieldRadius, this.game.fieldRadius, this.game.fieldLength, 64)
        var material = new THREE.MeshBasicMaterial({map: this.worldTexture})
        var world = new THREE.Mesh(geometry, material)
        world.rotation.x = 90*Math.PI/180
        world.name = 'Field'
        this.globalMesh.add(world)

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

        this.globalMesh.add(this.enemyMesh)
    }

    play() {
        if (this.yoshi.yoshi.isJumping) return
        if (this.game.status == 'playing') return
        
        else if (this.game.status == 'init') {
            
            this.scene.background = null
            this.scene.add(this.globalMesh)
            this.instruction.style.display = 'none'
            this.level.style.visibility = 'visible'
            this.distance.style.visibility = 'visible'
            this.energy.style.visibility = 'visible'
            this.keys.style.visibility = 'visible'
            this.renderer.setClearColor(Colors.blue, 1)
        }
        
        else if (this.game.status == 'waiting') this.reset()
        
        this.yoshi.playPose()
        
        this.camera.position.set(100, 600, -600)
        new TWEEN.Tween(this.camera.position).to({x: this.game.cameraOffsetX, y: this.game.fieldRadius + 67.42, z: 0}, 3000)
            .onUpdate(() => {
                this.camera.lookAt(this.yoshi.mesh.position)
            })
            .start()
        this.yoshi.play(() => {
            this.game.status = 'playing'
        }, 2400)
        this.gameAudio.play()
        
        this.spawnEggs()
        this.spawnCoins()
        this.spawnGoombas()
        this.spawnMushrooms()
        this.spawnBlocks()
    }

    reset() {
        this.enemyMesh.children.length = 0
        this.globalMesh.rotation.z = 0
        this.game = new GameSettings().settings
        this.fieldEnergy.innerHTML = this.game.energy
        this.fieldLevel.innerHTML = this.game.level
        this.fieldDistance.innerHTML = this.game.distance
        this.title.innerHTML = this.game.title
        this.subtitle.innerHTML = this.game.subtitle
        this.yoshi.mesh.position.z = 0
    }
    
    spawnCoins() {    
        for (var i = 0; i < this.game.nCoins; i++) {
            this.game.coinsArray.push(new Coin(this.coinMesh.clone()))
        } this.randomGenerator(this.game.coinsArray, this.game.nCoins, 'Coins')
    } 

    spawnEggs() {
        for (var i = 0; i < this.game.nEggs; i++) {
            this.game.eggsArray.push(new Egg(this.eggMesh.clone()))
        } this.randomGenerator(this.game.eggsArray, this.game.nEggs, 'Eggs')
    }

    spawnMushrooms() {
        for (var i = 0; i < this.game.nMushrooms; i++) {
            this.game.mushroomsArray.push(new Mushroom(this.mushroomMesh.clone()))
        } this.randomGenerator(this.game.mushroomsArray, this.game.nMushrooms, 'Mushroom')
    }

    spawnGoombas() {
        for (var i = 0; i < this.game.nGoombas; i++) {
            this.game.goombasArray.push(new Goomba(this.goombaMesh.clone()))
        } this.randomGenerator(this.game.goombasArray, this.game.nGoombas, 'Goombas')
    }

    spawnBlocks() {
        for (var i = 0; i < this.game.nBlocks; i++) {
            this.game.blocksArray.push(new Block(this.blockMesh.clone()))
        } this.randomGenerator(this.game.blocksArray, this.game.nBlocks, 'Blocks')
    }

    randomGenerator(arr, n) {
        var a = Math.PI*2/n
        var h = this.game.fieldRadius + 10
        for (var i = 0; i < n; i++) {
            var o = arr[i]
            o.mesh.position.x = Math.cos(a*i)*h
            o.mesh.position.y = Math.sin(a*i)*h 
            o.mesh.position.z = 100-Math.random()*200
            o.mesh.rotation.z = a*i-Math.PI/2
            o.move()
            this.game.collidableArray.push(o.mesh)
            this.enemyMesh.add(o.mesh)
        }
    }

    addEnergy(value) {
        this.game.energy += value
    }

    removeEnergy(value) {
        this.game.energy -= value
        this.game.energy = Math.max(0, this.game.energy);
    }

    updateEnergy() {
        this.game.energy -= this.game.speed*this.game.ratioSpeedEnergy;
        this.game.energy = Math.max(0, this.game.energy);
        this.fieldEnergy.innerHTML = Math.floor(this.game.energy);
        
        if (this.game.energy < 1) {
            this.game.status = 'gameover';
            this.gameAudio.pause()
            this.gameAudio.currentTime = 0
        }
    }

    updateDistance() {
        this.game.distance += this.game.speed*this.game.ratioSpeedDistance;
        this.fieldDistance.innerHTML = Math.floor(this.game.distance);
    }

    updateSpeed() {
        if (this.game.speed < this.game.maxSpeed) {
            this.game.speed += this.game.targetSpeed
            this.game.yoshiSpeed += this.game.speed*this.game.ratioYoshiSpeed
            
            if (!this.maxRotation && this.game.speed > this.game.maxRotationSpeed) 
                this.maxRotation = true

            if (this.maxRotation) this.game.rotationSpeed -= this.game.maxRotationSpeed*Math.PI/180*this.game.ratioRotationSpeed
            else this.game.rotationSpeed -= this.game.speed*Math.PI/180*this.game.ratioRotationSpeed
        }
    }

    collisionDetection() {
        var originPoint = this.yoshi.mesh.position.clone();
        if (this.yoshi.yoshi.isJumping) return
        for (var i = 0; i < this.yoshi.mesh.geometry.vertices.length; i++) {
            
            var localVertex = this.yoshi.mesh.geometry.vertices[i].clone()
            var globalVertex = localVertex.applyMatrix4(this.yoshi.mesh.matrix)
            var directionVector = globalVertex.sub(this.yoshi.mesh.position)

            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize())
            var collisionResults = ray.intersectObjects(this.game.collidableArray)
            
            if (collisionResults.length > 0)  {
                
                var collidedMesh = collisionResults[0].object
                
                for (var i = 0; i < this.game.collidableArray.length; i++) {
                    if (this.game.collidableArray[i].id == collidedMesh.id) {
                        this.game.collidableArray.splice(i, 1);
                    }
                }
                
                var catchMesh = (arr) => {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].id == collidedMesh.children[0].id) {
                            arr[i].catch(() => {
                                this.enemyMesh.remove(collidedMesh)
                            })
                            arr.splice(i, 1)
                            break
                        }
                    }
                }
                
                switch (collidedMesh.children[0].name) {
                    case 'Goomba':
                        catchMesh(this.game.goombasArray)
                        if (this.yoshi.yoshi.isBig){
                            this.smashGoombaAudio.play() 
                            this.addEnergy(this.game.goombaValue)
                        } else {
                            this.removeEnergy(this.game.goombaValue)
                            this.ouchAudio.play()
                        }
                        break

                    case 'Coin':
                        catchMesh(this.game.coinsArray)
                        this.addEnergy(this.game.coinValue)
                        this.coinAudio.play()
                        break
                    
                    case 'Mushroom':
                        catchMesh(this.game.mushroomsArray)
                        this.yoshi.big()
                        break

                    case 'Block':
                        catchMesh(this.game.blocksArray)
                        if (this.yoshi.yoshi.isBig){
                            this.destroyBlockAudio.play()
                            this.addEnergy(this.game.blockValue)
                        } else {
                            this.removeEnergy(this.game.blockValue)
                            this.ouchAudio.play()
                        }
                        break

                    case 'Egg':
                        catchMesh(this.game.eggsArray)
                        this.addEnergy(this.game.eggValue)
                        this.eggAudio.play()
                        break

                    default:
                        break;
                }
            }
        }
    }

    update() {
        this.yoshi.update(this.game.yoshiSpeed)
        this.renderer.render(this.scene, this.camera);

        if (this.game.status == 'playing') {

            // Add energy
            if (this.game.coinsArray.length < this.game.minCoins && !this.game.coinSpawn) {
                this.game.coinSpawn = true
                console.log('spawnCoins')
                this.spawnCoins()
                this.game.coinSpawn = false
            }

            if (this.game.eggsArray.length < this.game.minEggs && !this.game.eggSpawn) {
                this.game.eggSpawn = true
                this.spawnEggs()
                this.game.eggSpawn = false
            }

            if (this.game.mushroomsArray.length < this.game.minMushrooms && !this.game.mushroomSpawn) {
                this.game.mushroomSpawn = true
                this.spawnMushrooms()
                this.game.mushroomSpawn = false
            }

            // Add enemies
            if (this.game.goombasArray.length < this.game.minGommbas && !this.game.goombasSpawn) {
                this.game.goombasSpawn = true
                this.spawnGoombas()
                this.game.goombasSpawn = false
            }

            if (this.game.blocksArray.length < this.game.minBlocks && !this.game.blockSpawn) {
                this.game.blockSpawn = true
                this.spawnBlocks()
                this.game.blockSpawn = false
            }

            // distance speed update
            if (Math.floor(this.game.distance)%this.game.distanceForSpeedUpdate == 0 && Math.floor(this.game.distance) > this.game.speedLastUpdate) {
                this.game.speedLastUpdate = Math.floor(this.game.distance);
                this.game.targetSpeed += this.game.incrementSpeedByDistance;
            } 

            // level speed update
            if (Math.floor(this.game.distance)%this.game.distanceForLevelUpdate == 0 && Math.floor(this.game.distance) > this.game.levelLastUpdate) {
                this.game.levelLastUpdate = Math.floor(this.game.distance)
                this.game.level++
                this.game.targetSpeed += this.game.incrementSpeedByLevel*this.game.level
                this.fieldLevel.innerHTML = Math.floor(this.game.level)
            }
            
            this.globalMesh.rotation.z = this.game.rotationSpeed
            this.collisionDetection()
            this.updateSpeed()
            this.updateDistance()
            this.updateEnergy()

        } else if (this.game.status == 'gameover') {
            
            this.yoshi.cry(() => {
                console.log('Game over!')
                this.title.innerHTML = 'GAME OVER'
                this.subtitle.innerHTML = 'Press Start to Play Again'
                this.game.status = 'waiting'
            })
        }
    }
}