import {GLTFLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'

export var Colors = {
	white:0xd8d0d1,
	blue: 0x99CCff,
};

export class Coin {

    constructor(mesh) {
        this.mesh = new THREE.Mesh(
            new THREE.CubeGeometry(15, 15, 15),
            new THREE.MeshBasicMaterial({opacity: 0.0, transparent: true})
        ).add(mesh)
        this.id = mesh.id
    }

    move() {
        this.rotation_tween = new TWEEN.Tween(this.mesh.children[0].rotation).to({y: this.mesh.children[0].rotation.y+3.14}, 1000).repeat(Infinity).start()
    }

    catch (callback) {
        TWEEN.remove(this.rotation_tween)
        new TWEEN.Tween(this.mesh.children[0].rotation).to({y: this.mesh.children[0].rotation.y+3.14}, 200).repeat(3).start()
        new TWEEN.Tween(this.mesh.children[0].position).to({y: this.mesh.children[0].position.y+30}, 600).easing(TWEEN.Easing.Quadratic.Out).start()
            .onComplete(() => {
                callback()
            }).start()
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('./models/coin/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(0.05, 0.05, 0.05)
                mesh.position.y = -5
                mesh.name = 'Coin'
                resolve(mesh)
            }, null, reject)
        })
    }
}

export class Egg {

    constructor(mesh) {
        this.mesh = new THREE.Mesh(
            new THREE.CubeGeometry(15, 15, 15),
            new THREE.MeshBasicMaterial({opacity: 0.0, transparent: true})
        ).add(mesh)
        this.id = mesh.id
    }

    move() {
        this.rotation_tween1 = new TWEEN.Tween(this.mesh.children[0].position).to({y: this.mesh.children[0].position.y+1}, 300).repeat(Infinity).yoyo(true).easing(TWEEN.Easing.Quadratic.Out).start()
        this.rotation_tween2 = new TWEEN.Tween(this.mesh.children[0].rotation).to({y: this.mesh.children[0].rotation.y+6.28}, 2000).repeat(Infinity).start()
    }

    catch (callback) {
        TWEEN.remove(this.rotation_tween1)
        TWEEN.remove(this.rotation_tween2)
        new TWEEN.Tween(this.mesh.children[0].rotation).to({y: this.mesh.children[0].rotation.y+6.28}, 200).repeat(2).start()
        new TWEEN.Tween(this.mesh.scale).to({x: 0, y:0, z:0}, 300)
            .onComplete(() => {
                callback()
            }).start()
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('./models/egg/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(5, 5, 5)
                mesh.position.y -= 2
                mesh.name = 'Egg'
                resolve(mesh)
            }, null, reject)
        })
    }
}

export class Goomba {

    constructor(mesh) {
        this.mesh = new THREE.Mesh(
            new THREE.CubeGeometry(15, 15, 15),
            new THREE.MeshBasicMaterial({opacity: 0.0, transparent: true})
        ).add(mesh)
        this.id = mesh.id
    }

    move() {
        this.rotation_tween1 = new TWEEN.Tween(this.mesh.children[0].rotation).to({z: this.mesh.children[0].rotation.z+0.4}, 500)
        var rotation_tween2 = new TWEEN.Tween(this.mesh.children[0].rotation).to({z: this.mesh.children[0].rotation.z}, 500)
        this.rotation_tween1.chain(rotation_tween2.chain(this.rotation_tween1))
        this.rotation_tween3 = new TWEEN.Tween(this.mesh.children[0].rotation).to({y: this.mesh.children[0].rotation.y+0.4}, 500)
        var rotation_tween4 = new TWEEN.Tween(this.mesh.children[0].rotation).to({y: this.mesh.children[0].rotation.y}, 500)
        this.move_tween1 = new TWEEN.Tween(this.mesh.position).to({z: this.mesh.position.z+Math.random()*15+1}, 500).repeat(Infinity).yoyo(true)
        this.rotation_tween3.chain(rotation_tween4.chain(this.rotation_tween3))
        this.rotation_tween1.start()
        this.rotation_tween3.start()
        this.move_tween1.delay(Math.random()*500+1).start()
    }

    catch(callback) {
        TWEEN.remove(this.rotation_tween1)
        TWEEN.remove(this.rotation_tween3)
        TWEEN.remove(this.move_tween1)
        new TWEEN.Tween(this.mesh.position).to({y: this.mesh.position.y}, 500)
            .onComplete(() => {
                callback()
            }).start()
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('./models/goomba/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(0.06, 0.06, 0.06)
                mesh.rotation.y += Math.PI/2
                mesh.position.z -= 3
                mesh.name = 'Goomba'
                resolve(object.scene)
            }, null, reject)
        })
    }
}

export class Mushroom {

    constructor(mesh) {
        this.mesh = new THREE.Mesh(
            new THREE.CubeGeometry(8, 8, 8),
            new THREE.MeshBasicMaterial({opacity: 0.0, transparent: true})
        ).add(mesh)
        this.id = mesh.id
    }

    move() {
        this.jump_tween1 = new TWEEN.Tween(this.mesh.children[0].position).to({y: this.mesh.children[0].position.y+10}, 350).easing(TWEEN.Easing.Quadratic.Out).delay(200)
        var jump_tween2 = new TWEEN.Tween(this.mesh.children[0].position).to({y: this.mesh.children[0].position.y}, 350).easing(TWEEN.Easing.Quadratic.In)
        this.jump_tween1.chain(jump_tween2.chain(this.jump_tween1))
        this.jump_tween1.start()
    }

    catch (callback) {
        TWEEN.remove(this.jump_tween1)
        callback()
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('./models/mushroom/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(5, 5, 5)
                mesh.position.y = -5
                mesh.name = 'Mushroom'
                resolve(object.scene)
            }, null, reject)
        })
    }
}

export class Block {

    constructor(mesh) {
        this.mesh = new THREE.Mesh(
            new THREE.CubeGeometry(18, 18, 18),
            new THREE.MeshBasicMaterial({opacity: 0.0, transparent: true})
        ).add(mesh)
        this.id = mesh.id
    }

    move () {return}

    catch (callback){
        callback()
    }

    static async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('./models/block/scene.gltf', object => {
                var mesh = object.scene
                mesh.scale.set(0.15, 0.15, 0.15)
                mesh.position.y -=10
                mesh.position.z -= 2
                mesh.name = 'Block'
                resolve(object.scene)
            }, null, reject)
        })
    }
}

export class Cloud {
    
    constructor() {
        this.mesh = new THREE.Object3D()
        this.mesh.name = "Cloud"
        var geom = new THREE.BoxGeometry(20, 20, 20)
        var mat = new THREE.MeshPhongMaterial({color: Colors.white})

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
        }
    }
}