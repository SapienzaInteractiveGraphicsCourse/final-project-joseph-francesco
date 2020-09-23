import {Coin, Egg, Mushroom, Goomba, Block, Cloud, Colors} from '/js/models/objects.js'

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
        goombasSpawn:false,
        blockSpawn:false,

        nClouds:20,
        nCoins:30,
        nGoombas:20,
        nEggs:4,
        nMushrooms: 1,
        nBlocks: 11,

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

    constructor(scene, camera, renderer, yoshi) {
    
        this.scene = scene
        this.camera = camera
        this.renderer = renderer    
        this.yoshi = yoshi

        yoshi.yoshi.radius = this.game.yPosition
        
        this.coinAudio = new Audio('/models/coin/sounds/catch.mp3')
        this.ouchAudio = new Audio('/models/goomba/sounds/ouch.mp3')
        this.eggAudio = new Audio('/models/egg/sounds/eat.mp3')
        
        this.coinAudio.volume = 0.5
        this.eggAudio.volume = 0.5
        this.ouchAudio.volume = 0.5

        Coin.load().then((mesh) => {this.coinMesh = mesh})
        Goomba.load().then((mesh) => {this.goombaMesh = mesh})
        Egg.load().then((mesh) => {this.eggMesh = mesh})
        Mushroom.load().then((mesh) => {this.mushroomMesh = mesh})
        Block.load().then((mesh) => {this.blockMesh = mesh})

        this.globalMesh = new THREE.Object3D()
        this.globalMesh.name = 'Global'
        this.enemyMesh = new THREE.Object3D()
        this.enemyMesh.name = 'Enemy'

        new THREE.TextureLoader().load('assets/grass.jpeg', (texture) => {
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
                    default:
                        break
                }
            }, false)
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
        if (this.game.status == 'playing') return
        
        else if (this.game.status == 'init') {
        
            this.camera.position.set(this.game.cameraOffsetX, this.game.fieldRadius + 67.42, 0)
            this.scene.background = null
            this.scene.add(this.globalMesh)
            
            this.instruction.style.display = 'none'
            this.level.style.visibility = 'visible'
            this.distance.style.visibility = 'visible'
            this.energy.style.visibility = 'visible'
            this.renderer.setClearColor(Colors.blue, 1)
            
            setTimeout(() => this.game.status = 'playing', 1000)
        }
        
        else if (this.game.status == 'waiting') this.reset()
        
        this.yoshi.play()
        this.camera.lookAt(this.yoshi.mesh.position)

        this.spawnEggs()
        this.spawnCoins()
        this.spawnGoombas()
        this.spawnMushrooms()
        this.spawnBlocks()
    }

    reset() {
        this.game = new GameSettings().settings
        this.fieldEnergy.innerHTML = this.game.energy
        this.fieldLevel.innerHTML = this.game.level
        this.fieldDistance.innerHTML = this.game.distance
        this.title.innerHTML = this.game.title
        this.subtitle.innerHTML = this.game.subtitle
        this.game.status = 'playing'
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
        var h = this.game.fieldRadius+20
        for (var i = 0; i < n; i++) {
            var o = arr[i]
            var x_pos = Math.cos(a*i)*h + Math.random()*10
            var y_pos = Math.sin(a*i)*h + 8
            // o.mesh.rotation.x = Math.PI
            // o.mesh.rotation.y = Math.PI
            // o.mesh.rotation.z = Math.PI
            o.mesh.position.x = x_pos
            o.mesh.position.y = y_pos
            o.mesh.position.z = 60-Math.random()*120
            // o.mesh.children[0].children[0].rotation.x = Math.atan(y_pos/x_pos)
            // const rot_val = Math.PI/2
            const rot_val = a*i-Math.PI
            // const rot_val = Math.sin(Math.atan(y_pos/x_pos)*2)
            o.mesh.children[0].children[0].children[0].children[0].rotation.x = -rot_val
            // o.mesh.children[0].children[0].rotation.x = Math.atan(y_pos/x_pos)
            //console.log('the o value, ', rot_val, ' when i is  ',i)
            //o.mesh.rotation.z = (Math.tan(y_pos/x_pos)*180)/Math.PI
            //var a = stepAngle*i
            //c.mesh.rotation.z = a + Math.PI/2
            //o.mesh.rotation.y = a*i
            o.move()
            this.game.collidableArray.push(o.mesh)
            //this.scene.add(o.mesh)
            this.enemyMesh.add(o.mesh)
        }
    }

    addEnergy(value) {
        this.game.energy += value
        //this.game.energy = Math.min(this.game.energy, 100);
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
                        this.removeEnergy(this.game.goombaValue)
                        this.ouchAudio.play()
                        break

                    case 'Coin':
                        catchMesh(this.game.coinsArray)
                        this.addEnergy(this.game.coinValue)
                        this.coinAudio.play()
                        break
                    
                    case 'Mushroom':
                        catchMesh(this.game.mushroomsArray)
                        //this.yoshi.big()
                        //this.bigAudio.play()
                        break

                    case 'Block':
                        catchMesh(this.game.blocksArray)
                        this.removeEnergy(this.game.blockValue)
                        this.ouchAudio.play()
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
            if (this.game.coinsArray.length < 10 && !this.game.coinSpawn) {
                this.game.coinSpawn = true
                this.spawnCoins()
                this.game.coinSpawn = false
            }

            if (this.game.eggsArray.length < 1 && !this.game.eggSpawn) {
                this.game.eggSpawn = true
                this.spawnEggs()
                this.game.eggSpawn = false
            }

            // Add enemies
            if (this.game.goombasArray.length < 5 && !this.game.goombasSpawn) {
                this.game.goombasSpawn = true
                this.spawnGoombas()
                this.game.goombasSpawn = false
            }

            if (this.game.blocksArray.length < 5 && !this.game.blockSpawn) {
                this.game.blockSpawn = true
                this.spawnBlocks()
                this.game.blockSpawn = false
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
            
            this.globalMesh.rotation.z = this.game.rotationSpeed
            this.collisionDetection()
            this.updateSpeed()
            this.updateDistance()
            this.updateEnergy()

        } else if (this.game.status == 'gameover') {
            
            this.game.status = 'waiting'
            console.log('Game over!')
            this.title.innerHTML = 'GAME OVER'
            this.subtitle.innerHTML = 'Press Start to Play Again'
            this.yoshi.cry()   
        }
    }
}