import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'

export var Colors = {
	white:0xd8d0d1,
	blue: 0x99CCff,
};

export class Coin {

    constructor(mesh) {
        this.mesh = mesh
    }

    move() {
        this.rotation_tween = new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y+3.14}, 1000).repeat(Infinity).start()
    }

    catch (scene, audio) {

        audio.play()

        TWEEN.remove(this.rotation_tween)

        new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y+3.14}, 200).repeat(3).start()
        new TWEEN.Tween(this.mesh.position).to({y: this.mesh.position.y+30}, 600)
            .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                scene.remove(this.mesh)
            }).start()
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('/models/coin/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(0.03, 0.03, 0.03)
                mesh.name = 'Coin'
                resolve(mesh)
            }, null, reject)
        })
    }
}

export class Star {

    constructor(mesh) {
        this.mesh = mesh
    }

    move() {
        this.jump_tween = new TWEEN.Tween(this.mesh.position).to({y: this.mesh.position.y+3.5}, 1000).repeat(Infinity).yoyo(true)
        this.rotate_tween1 = new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y+0.5}, 300)
        var rotate_tween2 = new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y-0.5}, 600)
        var rotate_tween3 = new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y}, 300)
        this.rotate_tween1.chain(rotate_tween2.chain(rotate_tween3.chain(this.rotate_tween1)))
        this.jump_tween.start()
        this.rotate_tween1.start()
    }

    catch (scene) {
        TWEEN.remove(this.jump_tween)
        TWEEN.remove(this.rotate_tween1)
        new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y+3.14}, 200).repeat(3).start()
        new TWEEN.Tween(this.mesh.position).to({y: this.mesh.position.y+30}, 600)
            .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                scene.remove(this.mesh)
            }).start()
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('/models/star/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(0.02, 0.02, 0.02)
                mesh.position.y += 1.5
                mesh.rotation.y = 90*Math.PI/180
                mesh.name = 'Star'
                resolve(mesh)
            }, null, reject)
        })
    }
}

export class Egg {

    constructor(mesh) {
        this.mesh = mesh
    }

    move() {
        this.rotation_tween1 = new TWEEN.Tween(this.mesh.position).to({y: this.mesh.position.y+1}, 300).repeat(Infinity).yoyo(true).easing(TWEEN.Easing.Quadratic.Out).start()
        this.rotation_tween2 = new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y+6.28}, 2000).repeat(Infinity).start()
    }

    catch (scene) {
        TWEEN.remove(this.rotation_tween1)
        TWEEN.remove(this.rotation_tween2)
        new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y+6.28}, 200).repeat(2).start()
        new TWEEN.Tween(this.mesh.scale).to({x: 0, y:0, z:0}, 300)
            .onComplete(() => {
                scene.remove(this.mesh)
            }).start()
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('/models/egg/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(5, 5, 5)
                mesh.name = 'Egg'
                resolve(mesh)
            }, null, reject)
        })
    }
}

export class Goomba {

    constructor(mesh) {
        this.mesh = mesh
    }

    move() {
        let vel = 500-Math.random()*200
        this.move_tween1 = new TWEEN.Tween(this.mesh.position).to({z: this.mesh.position.z+30}, vel)
        var move_tween2 = new TWEEN.Tween(this.mesh.position).to({z: this.mesh.position.z-30}, vel*2)
        var move_tween3 = new TWEEN.Tween(this.mesh.position).to({z: this.mesh.position.z}, vel)
        this.move_tween1.chain(move_tween2.chain(move_tween3.chain(this.move_tween1)))
        this.rotation_tween1 = new TWEEN.Tween(this.mesh.rotation).to({z: this.mesh.rotation.z+0.4}, 500)
        var rotation_tween2 = new TWEEN.Tween(this.mesh.rotation).to({z: this.mesh.rotation.z}, 500)
        this.rotation_tween1.chain(rotation_tween2.chain(this.rotation_tween1))
        this.rotation_tween3 = new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y+0.4}, 500)
        var rotation_tween4 = new TWEEN.Tween(this.mesh.rotation).to({y: this.mesh.rotation.y}, 500)
        this.rotation_tween3.chain(rotation_tween4.chain(this.rotation_tween3))
        this.move_tween1.start(Math.random()*1000)
        this.rotation_tween1.start()
        this.rotation_tween3.start()
    }

    catch(scene) {
        TWEEN.remove(this.move_tween1)
        TWEEN.remove(this.rotation_tween1)
        TWEEN.remove(this.rotation_tween3)
        new TWEEN.Tween(this.mesh.position).to({y: this.mesh.position.y}, 500)
            .onComplete(() => {
                scene.remove(this.mesh)
            }).start()
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('/models/goomba/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(0.05, 0.05, 0.05)
                mesh.rotation.y += Math.PI/2
                mesh.name = 'Goomba'
                resolve(object.scene)
            }, null, reject)
        })
    }
}

export class Mushroom {

    constructor(scene) {
        this.scene = scene
    }

    move() {
        this.jump_tween1 = new TWEEN.Tween(this.mesh.position).to({y:this.mesh.position.y+3}, 350).easing(TWEEN.Easing.Quadratic.Out).delay(200)
        var jump_tween2 = new TWEEN.Tween(this.mesh.position).to({y:this.mesh.position.y}, 350).easing(TWEEN.Easing.Quadratic.In)
        this.jump_tween1.chain(jump_tween2.chain(this.jump_tween1))
        this.jump_tween1.start()
    }

    catch (scene) {
        TWEEN.remove(this.jump_tween1)
        scene.remove(this.mesh)
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('/models/mushroom/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(4, 4, 4)
                mesh.rotation.y = 1.6
                mesh.name = 'Mushroom'
                resolve(object.scene)
            }, null, reject)
        })
    }
}

export class Cloud {
    
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