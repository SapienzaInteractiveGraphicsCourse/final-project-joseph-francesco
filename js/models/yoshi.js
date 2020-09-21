import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'
export default class Yoshi {

    yoshi = {
        isJumping: false,
        isRunning:false,
        isCrying:false,
        isPlaying:false,
        isWaiting:false,

        rightPressed:false,
        leftPressed:false,
        upPressed:false,
        downPressed:false,
        rightBound:-60,
        leftBound:60,
        upBound:-40,
        downBound:50,

        delta:1,
    }

    constructor(scene) {

        this.yoshiTweens = new TWEEN.Group()
        
        this.jumpAudio1 = new Audio('/models/yoshi/sounds/jump1.mp3')
        this.jumpAudio1.volume = 0.5
        this.jumpAudio2 = new Audio('/models/yoshi/sounds/jump2.mp3')
        this.jumpAudio2.volume = 0.5
        this.yoshiAudio = new Audio('/models/yoshi/sounds/yoshi.mp3')
        this.yoshiAudio.volume = 0.5
        this.cryAudio = new Audio('/models/yoshi/sounds/lose.mp3')
        this.cryAudio.volume = 0.5

        this.load(scene)
    }

    async load(scene) {
        var loader = new GLTFLoader()
        loader.load('/models/yoshi/scene.gltf', object => {
            this.mesh = new Physijs.BoxMesh(
                new THREE.CubeGeometry(10, 30, 10),
                new THREE.MeshPhongMaterial({
                    opacity: 0.0,
                    transparent: true,
                })
            ).add(object.scene)
            this.init()
            scene.add(this.mesh)
        }, null, null)
    }

    init() {
        this.bones();
        // position bones
        this.body.position.y = -15
        this.mesh.rotation.y = 240*Math.PI/180
        this.spine.rotation.x = 0.0
        this.head.position.set(0, 0.37, 0)
        this.head.rotation.x = 0.1
        this.nose.position.y = 0.27
        this.L_arm.rotation.set(-4.0, 0.0, -1.5707960072844427)
        this.L_arm.children[0].rotation.set(0.5, 0.0, 0.5)
        this.L_arm.children[0].children[0].rotation.set(0.0, 0.0, 0.6)
        this.L_hand.rotation.set(0.0, 2.0, 0.0)
        this.R_arm.rotation.set(-0.5, 0.0, -1.570795870291479)
        this.R_arm.children[0].rotation.set(0.5, 0.0, 0.5)
        this.R_arm.children[0].children[0].rotation.set(0.0, 0.0, 0.6)
        this.R_hand.rotation.set(0.0, 2.0, 0.0)
        
        this.keyboard();
    }

    bones() {
        // retrieve bones
        this.body = this.mesh.children[0]
        this.spine = this.body.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[4]
        this.head = this.body.children[0].children[0].children[0].children[0].children[0].children[0].children[46].skeleton.bones[5]
        this.nose = this.body.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[7]
        this.mouth = this.body.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[8]
        this.L_arm = this.body.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[23]
        this.L_hand = this.L_arm.children[0].children[0].children[0]
        this.R_arm = this.body.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[37]
        this.R_hand = this.R_arm.children[0].children[0].children[0]
        this.L_hand = this.L_arm.children[0].children[0].children[0]
        this.L_leg = this.body.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[52]
        this.L_calf = this.L_leg.children[0]
        this.L_foot = this.L_calf.children[0]
        this.R_leg = this.body.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[56]
        this.R_calf = this.R_leg.children[0]
        this.R_foot = this.R_calf.children[0]
        this.tail = this.body.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[60]
    }

    keyboard () {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case 'r' || 'R': 
                    if (!this.yoshi.isPlaying) this.run()
                    break

                case ' ':
                    this.jump()
                    break

                case 'ArrowRight':
                    if (this.yoshi.isPlaying && !this.yoshi.rightPressed)
                        this.yoshi.rightPressed = true
                    break
                
                case 'ArrowLeft':
                    if (this.yoshi.isPlaying && !this.yoshi.leftPressed)
                        this.yoshi.leftPressed = true
                    break

                case 'ArrowUp':
                    if (this.yoshi.isPlaying && !this.yoshi.upPressed)
                        this.yoshi.upPressed = true
                    break

                case 'ArrowDown':
                    if (this.yoshi.isPlaying && !this.yoshi.downPressed)
                        this.yoshi.downPressed = true
                    break

                default:
                    break
            }
        }, false)

        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case 'ArrowRight':
                    if (this.yoshi.isPlaying) this.yoshi.rightPressed = false
                    break
                
                case 'ArrowLeft':
                    if (this.yoshi.isPlaying) this.yoshi.leftPressed = false
                    break

                case 'ArrowUp':
                    if (this.yoshi.isPlaying) this.yoshi.upPressed = false
                    break

                case 'ArrowDown':
                    if (this.yoshi.isPlaying) this.yoshi.downPressed = false

                default:
                    break
            }
        })
    }

    run() {
        if (this.yoshi.isJumping || this.yoshi.isCrying || this.yoshi.isWaiting) return
        if (this.yoshi.isRunning) {
            this.stop()
            this.pose()
            this.yoshi.isRunning = false
            return
        }
        
        this.yoshi.isRunning = true

        var mesh_tween1 = new TWEEN.Tween(this.body.position, this.yoshiTweens).to({y: this.body.position.y+0.5}, 200)
        var mesh_tween2 = new TWEEN.Tween(this.body.position, this.yoshiTweens).to({y: this.body.position.y-0.5}, 200)
        mesh_tween1.chain(mesh_tween2.chain(mesh_tween1))
        this.yoshiTweens.add(mesh_tween1)

        var spine_tween1 = new TWEEN.Tween(this.spine.rotation, this.yoshiTweens).to({x: 0.5}, 400)
        this.yoshiTweens.add(spine_tween1)
        
        var head_tween1 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: 0.1}, 200)
        var head_tween2 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: -0.1}, 400)
        var head_tween3 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: 0.0}, 200)
        var head_tween4 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({x: -0.3}, 400)
        this.yoshiTweens.add(head_tween4)
        head_tween1.chain(head_tween2.chain(head_tween3.chain(head_tween1)))
        this.yoshiTweens.add(head_tween1)

        var tail_tween1 = new TWEEN.Tween(this.tail.rotation, this.yoshiTweens).to({y: 0.3}, 200)
        var tail_tween2 = new TWEEN.Tween(this.tail.rotation, this.yoshiTweens).to({y: -0.3}, 400)
        var tail_tween3 = new TWEEN.Tween(this.tail.rotation, this.yoshiTweens).to({y: 0.0}, 200)
        tail_tween1.chain(tail_tween2.chain(tail_tween3.chain(tail_tween1)))
        this.yoshiTweens.add(tail_tween1)

        var leg_tween1 = new TWEEN.Tween(this.L_leg.rotation, this.yoshiTweens).to({x: -4.2}, 200)
        var leg_tween2 = new TWEEN.Tween(this.L_leg.rotation, this.yoshiTweens).to({x: -1.8}, 400)
        var leg_tween3 = new TWEEN.Tween(this.L_leg.rotation, this.yoshiTweens).to({x: -3.14}, 200)
        leg_tween1.chain(leg_tween2.chain(leg_tween3.chain(leg_tween1)))
        this.yoshiTweens.add(leg_tween1)
        
        var leg_tween4 = new TWEEN.Tween(this.R_leg.rotation, this.yoshiTweens).to({x: 1.5}, 200)
        var leg_tween5 = new TWEEN.Tween(this.R_leg.rotation, this.yoshiTweens).to({x: -1.0}, 400)
        var leg_tween6 = new TWEEN.Tween(this.R_leg.rotation, this.yoshiTweens).to({x: 0.0}, 200)
        leg_tween4.chain(leg_tween5.chain(leg_tween6.chain(leg_tween4)))
        this.yoshiTweens.add(leg_tween4)			
        
        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -2.5}, 200)
        var arm_tween2 = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -5.0}, 400)
        var arm_tween3 = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -4.0}, 200)
        arm_tween1.chain(arm_tween2.chain(arm_tween3.chain(arm_tween1)))
        this.yoshiTweens.add(arm_tween1)

        var arm_tween4 = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: -1.5}, 200)
        var arm_tween5 = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: 0.5}, 400)
        var arm_tween6 = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: -0.5}, 200)
        arm_tween4.chain(arm_tween5.chain(arm_tween6.chain(arm_tween4)))
        this.yoshiTweens.add(arm_tween4)
        
        this.start()

        return
    }

    jump() {
        if (this.yoshi.isJumping || this.yoshi.isCrying || this.yoshi.isWaiting) return
        
        this.yoshi.isJumping = true
        var jump_height = 15

        if (this.choose(1,2) == 1) this.jumpAudio1.play()
        else this.jumpAudio2.play()

        if (this.yoshi.isRunning) {
            
            if (this.yoshi.isPlaying) jump_height = 40
            
            var spine_tween = new TWEEN.Tween(this.spine.rotation, this.yoshiTweens).to({x: 0}, 400).repeat(1).yoyo(true)
            this.yoshiTweens.add(spine_tween)

            var head_tween = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({x: 0}, 400).repeat(1).yoyo(true)
            this.yoshiTweens.add(head_tween)

            var jump_tween1 = new TWEEN.Tween(this.mesh.position, this.yoshiTweens).to({y: this.mesh.position.y+jump_height}, 500).easing(TWEEN.Easing.Quadratic.Out)
            var jump_tween2 = new TWEEN.Tween(this.mesh.position, this.yoshiTweens).to({y: this.mesh.position.y}, 300).easing(TWEEN.Easing.Quadratic.In)
                .onComplete(() => {
                    this.yoshi.isJumping = false
                })
            jump_tween1.chain(jump_tween2)
            this.yoshiTweens.add(jump_tween1)
            
            var nose_tween = new TWEEN.Tween(this.nose.position, this.yoshiTweens).to({y: 0.35}, 200).repeat(1).yoyo(true).delay(300)
            this.yoshiTweens.add(nose_tween)
            
            this.start()

            return
        }
        
        var spine_tween = new TWEEN.Tween(this.spine.rotation, this.yoshiTweens).to({x: 0.5}, 400).repeat(1).yoyo(true)
        this.yoshiTweens.add(spine_tween)

        var head_tween = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({x: -0.3}, 400).repeat(1).yoyo(true)
        this.yoshiTweens.add(head_tween)

        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -5.0}, 400).repeat(1).yoyo(true)
        var arm_tween2 = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: 0.5}, 400).repeat(1).yoyo(true)
        var arm_tween1_b = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -3.0}, 400).repeat(1).yoyo(true)
        var arm_tween2_b = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: -2.0}, 400).repeat(1).yoyo(true)
        if (this.choose(1,2) == 1){
            this.yoshiTweens.add(arm_tween1)
            this.yoshiTweens.add(arm_tween2)
        } 
        else {
            this.yoshiTweens.add(arm_tween1_b)
            this.yoshiTweens.add(arm_tween2_b)
        }

        var nose_tween = new TWEEN.Tween(this.nose.position, this.yoshiTweens).to({y: 0.35}, 200).repeat(1).yoyo(true)
        this.yoshiTweens.add(nose_tween)

        var calf_tween1 = new TWEEN.Tween(this.L_calf.rotation, this.yoshiTweens).to({x: 0.8}, 200).repeat(1).yoyo(true)
        this.yoshiTweens.add(calf_tween1) 
        var calf_tween2 = new TWEEN.Tween(this.R_calf.rotation, this.yoshiTweens).to({x: 0.8}, 200).repeat(1).yoyo(true)
        this.yoshiTweens.add(calf_tween2) 

        var foot_tween1 = new TWEEN.Tween(this.L_foot.rotation, this.yoshiTweens).to({x: 0.2}, 200)
        var foot_tween2 = new TWEEN.Tween(this.R_foot.rotation, this.yoshiTweens).to({x: 0.2}, 200)
        var foot_tween3 = new TWEEN.Tween(this.L_foot.rotation, this.yoshiTweens).to({x: -0.6}, 200)
        var foot_tween4 = new TWEEN.Tween(this.R_foot.rotation, this.yoshiTweens).to({x: -0.6}, 200)
            .onComplete(() => {
                this.yoshi.isJumping = false;
            })
        this.yoshiTweens.add(foot_tween1)
        this.yoshiTweens.add(foot_tween2)

        var mesh_tween = new TWEEN.Tween(this.mesh.position, this.yoshiTweens).to({y: this.mesh.position.y-0.2}, 200).repeat(1).yoyo(true)
        this.yoshiTweens.add(mesh_tween)

        var tail_tween = new TWEEN.Tween(this.tail.rotation, this.yoshiTweens).to({y: 1.0}, 200).repeat(3).yoyo(true)
        this.yoshiTweens.add(tail_tween)
        
        var jump_tween1 = new TWEEN.Tween(this.mesh.position, this.yoshiTweens).to({y: this.mesh.position.y+jump_height}, 500).easing(TWEEN.Easing.Quadratic.Out)
        var jump_tween2 = new TWEEN.Tween(this.mesh.position, this.yoshiTweens).to({y: this.mesh.position.y}, 300).easing(TWEEN.Easing.Quadratic.In)
        jump_tween1.chain(jump_tween2, foot_tween3, foot_tween4)
        this.yoshiTweens.add(jump_tween1)
        
        this.start()

        return
    }

    cry() {
        if (this.yoshi.isCrying || this.yoshi.isWaiting) return
        if (this.yoshi.isJumping) this.cry()
        this.yoshi.isCrying = true
        this.yoshi.isWaiting = true
        this.yoshi.isRunning = false
        this.yoshi.isPlaying = false
        this.yoshi.rightPressed = false
        this.yoshi.leftPressed = false
        this.yoshi.upPressed = false
        this.yoshi.downPressed = false
        this.stop()
        this.pose()

        var head_tween1 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({x: 0.8}, 200)
        var head_tween2 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: -0.2}, 200)
        var head_tween3 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: 0.2}, 400)
        var head_tween4 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: 0.0}, 200)
        var head_tween5 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: -0.2}, 200)
        var head_tween6 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: 0.2}, 400)
        var head_tween7 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: 0.0}, 200)
            .onComplete(() => {
                this.yoshi.isCrying = false
                this.yoshi.isWaiting = false
            })
        head_tween1.chain(head_tween2.chain(head_tween3.chain(head_tween4.chain(head_tween5.chain(head_tween6.chain(head_tween7))))))
        this.yoshiTweens.add(head_tween1)

        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -5.5}, 200)
        var arm_tween2 = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: -2.2}, 200)
        this.yoshiTweens.add(arm_tween1)
        this.yoshiTweens.add(arm_tween2)

        var hand_tween1 = new TWEEN.Tween(this.L_hand.rotation, this.yoshiTweens).to({x: 0.5}, 200)
        var hand_tween2 = new TWEEN.Tween(this.R_hand.rotation, this.yoshiTweens).to({x: 0.2}, 200)
        this.yoshiTweens.add(hand_tween1)
        this.yoshiTweens.add(hand_tween2)

        var nose_tween = new TWEEN.Tween(this.nose.position, this.yoshiTweens).to({y: 0.4}, 400).repeat(4).yoyo(true)
        this.yoshiTweens.add(nose_tween)

        this.cryAudio.play()

        this.start()
    }

    pose() {
        var mesh_tween = new TWEEN.Tween(this.mesh.position, this.yoshiTweens).to({y: this.mesh.position.y}, 200)
        this.yoshiTweens.add(mesh_tween)

        var spine_tween = new TWEEN.Tween(this.spine.rotation, this.yoshiTweens).to({x: 0}, 200)
        this.yoshiTweens.add(spine_tween)
        
        var head_tween1 = new TWEEN.Tween(this.head.position, this.yoshiTweens).to({y: 0.37}, 200)
        var head_tween2 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({x: 0.1}, 200)
        this.yoshiTweens.add(head_tween1)
        this.yoshiTweens.add(head_tween2)

        var tail_tween = new TWEEN.Tween(this.tail.rotation, this.yoshiTweens).to({y: 0.0}, 200)
        this.yoshiTweens.add(tail_tween)

        var leg_tween1 = new TWEEN.Tween(this.L_leg.rotation, this.yoshiTweens).to({x: -3.14}, 200)
        var leg_tween2 = new TWEEN.Tween(this.R_leg.rotation, this.yoshiTweens).to({x: 0}, 200)
        this.yoshiTweens.add(leg_tween1)
        this.yoshiTweens.add(leg_tween2)

        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -4.0}, 200)
        var arm_tween2 = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: -0.5}, 200)
        this.yoshiTweens.add(arm_tween1)
        this.yoshiTweens.add(arm_tween2)

        var nose_tween = new TWEEN.Tween(this.nose.position, this.yoshiTweens).to({y: 0.27}, 200)
        this.yoshiTweens.add(nose_tween)

        this.start();
    }

    play() {
        this.yoshi.isWaiting = true
        if (this.yoshi.isRunning) this.yoshi.isRunning = false
        
        this.stop()
        this.pose()
        
        this.yoshiAudio.play()

        var mesh_tween = new TWEEN.Tween(this.mesh.rotation, this.yoshiTweens).to({y: 270*Math.PI/180}, 2000)
            .onComplete(() => {
                this.yoshi.isWaiting = false
                this.run()
                this.yoshi.isPlaying = true
            })
        var nose_tween = new TWEEN.Tween(this.nose.position, this.yoshiTweens).to({y: 0.35}, 200).repeat(1).yoyo(true)
        this.yoshiTweens.add(nose_tween)
        this.yoshiTweens.add(mesh_tween)
        this.start()
    }

    start = () => {
        this.yoshiTweens.getAll().forEach(element => {
            element.start()
        })
    }

    stop = () => {
        this.yoshiTweens.removeAll()
    }

    choose = (from, to) => {
        return Math.floor(Math.random() * (to - from + 1)) + from
    }

    moveRight = (delta) => {
        if (this.mesh.position.z > this.yoshi.rightBound){
            this.mesh.position.z -= delta
        }
    }

    moveLeft = (delta) => {
        if (this.mesh.position.z < this.yoshi.leftBound)
            this.mesh.position.z += delta
    }

    moveUp = (delta) => {
        if (this.mesh.position.x > this.yoshi.upBound)
            this.mesh.position.x -= delta
    }

    moveDown = (delta) => {
        if (this.mesh.position.x < this.yoshi.downBound)
            this.mesh.position.x += delta
    }

    update(step) {
        
        if (this.yoshi.isPlaying) {
            
            this.yoshiTweens.getAll().forEach(element => {
                element.duration(element._duration/step)
            })

            if (this.yoshi.rightPressed)
                this.moveRight(this.yoshi.delta)

            if (this.yoshi.leftPressed)
                this.moveLeft(this.yoshi.delta)
            
            //if (this.yoshi.upPressed)
              //  this.moveUp(this.yoshi.delta)
                    
            //if (this.yoshi.downPressed)
              // this.moveDown(this.yoshi.delta)
        }

        this.yoshiTweens.update() 
    }
}