import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'

export default class Coin {

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
        var rotate_tween = new TWEEN.Tween(this.coin.rotation).to({y: this.coin.rotation.y+3.14}, 1000).repeat(Infinity)
        rotate_tween.start()
    }

    catch () {

        this.audio.play()

        TWEEN.removeAll()

        var rotate_tween = new TWEEN.Tween(this.coin.rotation).to({y: this.coin.rotation.y+3.14}, 200).repeat(Infinity)
        var position_tween = new TWEEN.Tween(this.coin.position).to({y: this.coin.position.y+30}, 600)
            .easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                this.scene.remove(this.coin)
            })
        rotate_tween.start()
        position_tween.start()
    }
}