import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'

export default class Goomba {

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
        var move_tween1 = new TWEEN.Tween(this.goomba.position).to({x: this.goomba.position.y+7}, 500)
        var move_tween2 = new TWEEN.Tween(this.goomba.position).to({x: this.goomba.position.y-7}, 1000)
        var move_tween3 = new TWEEN.Tween(this.goomba.position).to({x: this.goomba.position.y}, 500)
        move_tween1.chain(move_tween2.chain(move_tween3.chain(move_tween1)))
        var rotation_tween1 = new TWEEN.Tween(this.goomba.rotation).to({z: this.goomba.rotation.z+0.4}, 500)
        var rotation_tween2 = new TWEEN.Tween(this.goomba.rotation).to({z: this.goomba.rotation.z}, 500)
        rotation_tween1.chain(rotation_tween2.chain(rotation_tween1))
        var rotation_tween3 = new TWEEN.Tween(this.goomba.rotation).to({y: this.goomba.rotation.y+0.4}, 500)
        var rotation_tween4 = new TWEEN.Tween(this.goomba.rotation).to({y: this.goomba.rotation.y}, 500)
        rotation_tween3.chain(rotation_tween4.chain(rotation_tween3))
        move_tween1.start()
        rotation_tween1.start()
        rotation_tween3.start()
    }
}