import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'

export default class Egg {

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
        var jump_tween = new TWEEN.Tween(this.egg.position).to({y: this.egg.position.y+1}, 300).repeat(Infinity).yoyo(true).easing(TWEEN.Easing.Quadratic.Out)
        var rotate_tween = new TWEEN.Tween(this.egg.rotation).to({y: this.egg.rotation.y+6.28}, 2000).repeat(Infinity)
        jump_tween.start()
        rotate_tween.start()
    }

    catch () {
        TWEEN.removeAll()

        var rotate_tween = new TWEEN.Tween(this.egg.rotation).to({y: this.egg.rotation.y+6.28}, 200).repeat(Infinity)
        var scale_tween = new TWEEN.Tween(this.egg.scale).to({x: 0, y:0, z:0}, 300)
            .onComplete(() => {
                this.scene.remove(this.egg)
            })
        rotate_tween.start()
        scale_tween.start()
    }
}