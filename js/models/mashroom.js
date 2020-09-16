import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'

export default class Mushroom {

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
        var jump_tween1 = new TWEEN.Tween(this.mushroom.position).to({y: this.mushroom.position.y+3}, 350).easing(TWEEN.Easing.Quadratic.Out).delay(200)
        var jump_tween2 = new TWEEN.Tween(this.mushroom.position).to({y: this.mushroom.position.y}, 350).easing(TWEEN.Easing.Quadratic.In)
        jump_tween1.chain(jump_tween2.chain(jump_tween1))
        jump_tween1.start()
    }

    catch () {
        TWEEN.removeAll()
        this.scene.remove(this.mushroom)
    }
}