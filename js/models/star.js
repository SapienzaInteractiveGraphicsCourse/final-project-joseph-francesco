import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'

export default class Star {

    constructor(scene) {
        this.scene = scene
        this.load()
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
        var jump_tween = new TWEEN.Tween(this.star.position).to({y: this.star.position.y+3.5}, 1000).repeat(Infinity).yoyo(true)
        var rotate_tween1 = new TWEEN.Tween(this.star.rotation).to({y: this.star.rotation.y+0.5}, 300)
        var rotate_tween2 = new TWEEN.Tween(this.star.rotation).to({y: this.star.rotation.y-0.5}, 600)
        var rotate_tween3 = new TWEEN.Tween(this.star.rotation).to({y: this.star.rotation.y}, 300)
        rotate_tween1.chain(rotate_tween2.chain(rotate_tween3.chain(rotate_tween1)))
        jump_tween.start()
        rotate_tween1.start()
    }

    catch () {
        TWEEN.removeAll()

        var rotate_tween = new TWEEN.Tween(this.star.rotation).to({y: this.star.rotation.y+3.14}, 200).repeat(Infinity)
        var position_tween = new TWEEN.Tween(this.star.position).to({y: this.star.position.y+30}, 600)
            .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                this.scene.remove(this.star)
            })
        rotate_tween.start()
        position_tween.start()
    }
}