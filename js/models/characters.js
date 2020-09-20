import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'

export class Star {

    constructor(scene) {
        this.scene = scene
        this.load()
        this.tweens = new TWEEN.Group()
    }

    async load() {
        var loader = new GLTFLoader()
        loader.load('/models/star/scene.gltf', object => {
            
            this.star = object.scene
            this.star.scale.set(0.02, 0.02, 0.02)
            this.star.rotation.y += 1.5
            this.scene.add(this.star)
            this.move()

        }, null, null)
    }

    move() {
        this.jump_tween = new TWEEN.Tween(this.star.position).to({y: this.star.position.y+3.5}, 1000).repeat(Infinity).yoyo(true)
        this.rotate_tween1 = new TWEEN.Tween(this.star.rotation).to({y: this.star.rotation.y+0.5}, 300)
        var rotate_tween2 = new TWEEN.Tween(this.star.rotation).to({y: this.star.rotation.y-0.5}, 600)
        var rotate_tween3 = new TWEEN.Tween(this.star.rotation).to({y: this.star.rotation.y}, 300)
        this.rotate_tween1.chain(rotate_tween2.chain(rotate_tween3.chain(this.rotate_tween1)))
        this.jump_tween.start()
        this.rotate_tween1.start()
    }

    catch () {
        TWEEN.remove(this.jump_tween)
        TWEEN.remove(this.rotate_tween1)
        new TWEEN.Tween(this.star.rotation).to({y: this.star.rotation.y+3.14}, 200).repeat(3).start()
        new TWEEN.Tween(this.star.position).to({y: this.star.position.y+30}, 600)
            .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                this.scene.remove(this.star)
            }).start()
    }
}

export class Coin {

    constructor(scene) {
        this.scene = scene
        this.load()
        this.audio = new Audio('/models/coin/sounds/catch.mp3')
        this.audio.volume = 0.05
    }

    async load() {
        var loader = new GLTFLoader()
        loader.load('/models/coin/scene.gltf', object => {
            
            this.coin = object.scene
            this.coin.scale.set(0.03, 0.03, 0.03)
            this.coin.position.y = -4.0
            this.scene.add(this.coin)
            this.move()

        }, null, null)
    }

    move() {
        this.rotation_tween = new TWEEN.Tween(this.coin.rotation).to({y: this.coin.rotation.y+3.14}, 1000).repeat(Infinity).start()
    }

    catch () {

        this.audio.play()

        TWEEN.remove(this.rotation_tween)

        new TWEEN.Tween(this.coin.rotation).to({y: this.coin.rotation.y+3.14}, 200).repeat(3).start()
        new TWEEN.Tween(this.coin.position).to({y: this.coin.position.y+30}, 600)
            .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                this.scene.remove(this.coin)
            }).start()
    }
}

export class Egg {

    constructor(scene) {
        this.scene = scene
        this.load()
    }

    async load() {
        var loader = new GLTFLoader()
        loader.load('/models/egg/scene.gltf', object => {
            
            this.egg = object.scene
            this.egg.scale.set(4, 4, 4)
            this.scene.add(this.egg)
            this.move()

        }, null, null)
    }

    move() {
        this.rotation_tween1 = new TWEEN.Tween(this.egg.position).to({y: this.egg.position.y+1}, 300).repeat(Infinity).yoyo(true).easing(TWEEN.Easing.Quadratic.Out).start()
        this.rotation_tween2 = new TWEEN.Tween(this.egg.rotation).to({y: this.egg.rotation.y+6.28}, 2000).repeat(Infinity).start()
    }

    catch () {
        TWEEN.remove(this.rotation_tween1)
        TWEEN.remove(this.rotation_tween2)
        new TWEEN.Tween(this.egg.rotation).to({y: this.egg.rotation.y+6.28}, 200).repeat(2).start()
        new TWEEN.Tween(this.egg.scale).to({x: 0, y:0, z:0}, 300)
            .onComplete(() => {
                this.scene.remove(this.egg)
            }).start()
    }
}

export class Goomba {

    constructor(scene) {
        this.scene = scene
        this.load()
    }

    async load() {
        var loader = new GLTFLoader()
        loader.load('/models/goomba/scene.gltf', object => {
            
            this.goomba = object.scene
            this.goomba.scale.set(0.05, 0.05, 0.05)
            this.goomba.rotation.y += 3.14
            this.scene.add(this.goomba)
            this.move()

        }, null, null)
    }

    move() {
        this.move_tween1 = new TWEEN.Tween(this.goomba.position).to({x: this.goomba.position.y+7}, 500)
        var move_tween2 = new TWEEN.Tween(this.goomba.position).to({x: this.goomba.position.y-7}, 1000)
        var move_tween3 = new TWEEN.Tween(this.goomba.position).to({x: this.goomba.position.y}, 500)
        this.move_tween1.chain(move_tween2.chain(move_tween3.chain(this.move_tween1)))
        this.rotation_tween1 = new TWEEN.Tween(this.goomba.rotation).to({z: this.goomba.rotation.z+0.4}, 500)
        var rotation_tween2 = new TWEEN.Tween(this.goomba.rotation).to({z: this.goomba.rotation.z}, 500)
        this.rotation_tween1.chain(rotation_tween2.chain(this.rotation_tween1))
        this.rotation_tween3 = new TWEEN.Tween(this.goomba.rotation).to({y: this.goomba.rotation.y+0.4}, 500)
        var rotation_tween4 = new TWEEN.Tween(this.goomba.rotation).to({y: this.goomba.rotation.y}, 500)
        this.rotation_tween3.chain(rotation_tween4.chain(this.rotation_tween3))
        this.move_tween1.start()
        this.rotation_tween1.start()
        this.rotation_tween3.start()
    }

    catch() {
        TWEEN.remove(this.move_tween1)
        TWEEN.remove(this.rotation_tween1)
        TWEEN.remove(this.rotation_tween3)
        new TWEEN.Tween(this.goomba.position).to({y: this.goomba.position.y}, 500)
            .onComplete(() => {
                this.scene.remove(this.goomba)
            }).start()
    }
}

export class Mushroom {

    constructor(scene) {
        this.scene = scene
        this.load()
    }

    async load() {
        var loader = new GLTFLoader()
        loader.load('/models/mushroom/scene.gltf', object => {
            
            this.mushroom = object.scene
            this.mushroom.scale.set(4, 4, 4)
            this.mushroom.rotation.y = 1.6
            this.scene.add(this.mushroom)
            this.move()

        }, null, null)
    }

    move() {
        this.jump_tween1 = new TWEEN.Tween(this.mushroom.position).to({y: this.mushroom.position.y+3}, 350).easing(TWEEN.Easing.Quadratic.Out).delay(200)
        var jump_tween2 = new TWEEN.Tween(this.mushroom.position).to({y: this.mushroom.position.y}, 350).easing(TWEEN.Easing.Quadratic.In)
        this.jump_tween1.chain(jump_tween2.chain(this.jump_tween1))
        this.jump_tween1.start()
    }

    catch () {
        TWEEN.remove(this.jump_tween1)
        this.scene.remove(this.mushroom)
    }
}