import {GLTFLoader} from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'

export default class Yoshi {

    yoshi = {
        isJumping: false,
        isRunning:false,
        isCrying:false,
        isPlaying:false,
        isWaiting:false,
        isBig:false,

        rightPressed:false,
        leftPressed:false,
        upPressed:false,
        downPressed:false,
        rightBound:-90,
        leftBound:90,

        delta:1.5,
        radius:0
    }

    constructor() {

        this.yoshiTweens = new TWEEN.Group()
        this.playingTweens = new TWEEN.Group()
        this.runningTweens = new TWEEN.Group()
        
        this.jumpAudio1 = new Audio('./models/yoshi/sounds/jump1.mp3')
        this.jumpAudio2 = new Audio('./models/yoshi/sounds/jump2.mp3')
        this.yoshiAudio = new Audio('./models/yoshi/sounds/yoshi.mp3')
        this.cryAudio = new Audio('./models/yoshi/sounds/lose.mp3')
        this.bigAudio = new Audio('./models/yoshi/sounds/big.mp3')
        this.jumpAudio1.volume = 0.5
        this.jumpAudio2.volume = 0.5
        this.yoshiAudio.volume = 0.5
        this.cryAudio.volume = 0.5
        this.bigAudio.volume = 0.1
    }

    async load(scene, callback) {
        var loader = new GLTFLoader()
        loader.load('./models/yoshi/scene.gltf', object => {
            this.mesh = new THREE.Mesh(
                new THREE.CubeGeometry(20, 30, 15),
                new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0})
            ).add(object.scene)
            this.mesh.name = 'Yoshi'
            this.init()
            scene.add(this.mesh)
            callback()
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
        this.body = this.mesh.children[0].children[0]
        this.spine = this.mesh.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[4]
        this.head = this.mesh.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[46].skeleton.bones[5]
        this.nose = this.mesh.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[7]
        this.mouth = this.mesh.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[8]
        this.L_arm = this.mesh.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[23]
        this.L_hand = this.L_arm.children[0].children[0].children[0]
        this.R_arm = this.mesh.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[37]
        this.R_hand = this.R_arm.children[0].children[0].children[0]
        this.L_hand = this.L_arm.children[0].children[0].children[0]
        this.L_leg = this.mesh.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[52]
        this.L_calf = this.L_leg.children[0]
        this.L_foot = this.L_calf.children[0]
        this.R_leg = this.mesh.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[56]
        this.R_calf = this.R_leg.children[0]
        this.R_foot = this.R_calf.children[0]
        this.tail = this.mesh.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[60]
    }

    keyboard () {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case 'r' || 'R': 
                    if (!this.yoshi.isPlaying || this.yoshi.isWaiting) this.run()
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
            this.stopRunning()
            this.pose()
            this.yoshi.isRunning = false
            return
        }
        
        this.yoshi.isRunning = true

        var mesh_tween1 = new TWEEN.Tween(this.body.position, this.runningTweens).to({y: this.body.position.y+0.5}, 200)
        var mesh_tween2 = new TWEEN.Tween(this.body.position, this.runningTweens).to({y: this.body.position.y-0.5}, 200)
        mesh_tween1.chain(mesh_tween2.chain(mesh_tween1))
        this.runningTweens.add(mesh_tween1)

        var spine_tween1 = new TWEEN.Tween(this.spine.rotation, this.runningTweens).to({x: 0.5}, 400)
        this.runningTweens.add(spine_tween1)
        
        var head_tween1 = new TWEEN.Tween(this.head.rotation, this.runningTweens).to({y: 0.1}, 200)
        var head_tween2 = new TWEEN.Tween(this.head.rotation, this.runningTweens).to({y: -0.1}, 400)
        var head_tween3 = new TWEEN.Tween(this.head.rotation, this.runningTweens).to({y: 0.0}, 200)
        var head_tween4 = new TWEEN.Tween(this.head.rotation, this.runningTweens).to({x: -0.3}, 400)
        this.runningTweens.add(head_tween4)
        head_tween1.chain(head_tween2.chain(head_tween3.chain(head_tween1)))
        this.runningTweens.add(head_tween1)

        var tail_tween1 = new TWEEN.Tween(this.tail.rotation, this.runningTweens).to({y: 0.3}, 200)
        var tail_tween2 = new TWEEN.Tween(this.tail.rotation, this.runningTweens).to({y: -0.3}, 400)
        var tail_tween3 = new TWEEN.Tween(this.tail.rotation, this.runningTweens).to({y: 0.0}, 200)
        tail_tween1.chain(tail_tween2.chain(tail_tween3.chain(tail_tween1)))
        this.runningTweens.add(tail_tween1)

        var leg_tween1 = new TWEEN.Tween(this.L_leg.rotation, this.runningTweens).to({x: -4.2}, 200)
        var leg_tween2 = new TWEEN.Tween(this.L_leg.rotation, this.runningTweens).to({x: -1.8}, 400)
        var leg_tween3 = new TWEEN.Tween(this.L_leg.rotation, this.runningTweens).to({x: -3.14}, 200)
        leg_tween1.chain(leg_tween2.chain(leg_tween3.chain(leg_tween1)))
        this.runningTweens.add(leg_tween1)
        
        var leg_tween4 = new TWEEN.Tween(this.R_leg.rotation, this.runningTweens).to({x: 1.5}, 200)
        var leg_tween5 = new TWEEN.Tween(this.R_leg.rotation, this.runningTweens).to({x: -1.0}, 400)
        var leg_tween6 = new TWEEN.Tween(this.R_leg.rotation, this.runningTweens).to({x: 0.0}, 200)
        leg_tween4.chain(leg_tween5.chain(leg_tween6.chain(leg_tween4)))
        this.runningTweens.add(leg_tween4)			
        
        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation, this.runningTweens).to({x: -2.5}, 200)
        var arm_tween2 = new TWEEN.Tween(this.L_arm.rotation, this.runningTweens).to({x: -5.0}, 400)
        var arm_tween3 = new TWEEN.Tween(this.L_arm.rotation, this.runningTweens).to({x: -4.0}, 200)
        arm_tween1.chain(arm_tween2.chain(arm_tween3.chain(arm_tween1)))
        this.runningTweens.add(arm_tween1)

        var arm_tween4 = new TWEEN.Tween(this.R_arm.rotation, this.runningTweens).to({x: -1.5}, 200)
        var arm_tween5 = new TWEEN.Tween(this.R_arm.rotation, this.runningTweens).to({x: 0.5}, 400)
        var arm_tween6 = new TWEEN.Tween(this.R_arm.rotation, this.runningTweens).to({x: -0.5}, 200)
        arm_tween4.chain(arm_tween5.chain(arm_tween6.chain(arm_tween4)))
        this.runningTweens.add(arm_tween4)
        
        this.startRunningTweens()
    }

    jump() {
        if (this.yoshi.isJumping || this.yoshi.isCrying || this.yoshi.isWaiting) return
        
        this.yoshi.isJumping = true
        var jump_height = 15

        if (this.choose(1,2) == 1) this.jumpAudio1.play()
        else this.jumpAudio2.play()

        if (this.yoshi.isRunning) {
            
            if (this.yoshi.isPlaying) jump_height = 60
            
            var spine_tween = new TWEEN.Tween(this.spine.rotation, this.yoshiTweens).to({x: 0}, 600).repeat(1).yoyo(true)
            this.yoshiTweens.add(spine_tween)

            var head_tween = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({x: 0}, 600).repeat(1).yoyo(true)
            this.yoshiTweens.add(head_tween)
            
            var jump_tween1 = new TWEEN.Tween(this.mesh.position, this.yoshiTweens).to({y: this.mesh.position.y+jump_height}, 600).easing(TWEEN.Easing.Quadratic.Out)
            var jump_tween2 = new TWEEN.Tween(this.mesh.position, this.yoshiTweens).to({y: this.mesh.position.y}, 600).easing(TWEEN.Easing.Quadratic.In)
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

    cry(callback) {
        if (this.yoshi.isCrying || this.yoshi.isWaiting) return
        this.yoshi.isCrying = true
        this.yoshi.isWaiting = true
        this.yoshi.isRunning = false
        this.yoshi.rightPressed = false
        this.yoshi.leftPressed = false
        this.yoshi.upPressed = false
        this.yoshi.downPressed = false
        this.stopRunning()
        this.pose()

        var head_tween1 = new TWEEN.Tween(this.head.rotation, this.playingTweens).to({x: 0.8}, 200)
        var head_tween2 = new TWEEN.Tween(this.head.rotation, this.playingTweens).to({y: -0.2}, 200)
        var head_tween3 = new TWEEN.Tween(this.head.rotation, this.playingTweens).to({y: 0.2}, 400)
        var head_tween4 = new TWEEN.Tween(this.head.rotation, this.playingTweens).to({y: 0.0}, 200)
        var head_tween5 = new TWEEN.Tween(this.head.rotation, this.playingTweens).to({y: -0.2}, 200)
        var head_tween6 = new TWEEN.Tween(this.head.rotation, this.playingTweens).to({y: 0.2}, 400)
        var head_tween7 = new TWEEN.Tween(this.head.rotation, this.playingTweens).to({y: 0.0}, 200)
            .onComplete(() => {
                this.yoshi.isCrying = false
                callback()
            })
        head_tween1.chain(head_tween2.chain(head_tween3.chain(head_tween4.chain(head_tween5.chain(head_tween6.chain(head_tween7))))))
        this.playingTweens.add(head_tween1)

        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation, this.playingTweens).to({x: -5.5}, 200)
        var arm_tween2 = new TWEEN.Tween(this.R_arm.rotation, this.playingTweens).to({x: -2.2}, 200)
        this.playingTweens.add(arm_tween1)
        this.playingTweens.add(arm_tween2)

        var hand_tween1 = new TWEEN.Tween(this.L_hand.rotation, this.playingTweens).to({x: 0.5}, 200)
        var hand_tween2 = new TWEEN.Tween(this.R_hand.rotation, this.playingTweens).to({x: 0.2}, 200)
        this.playingTweens.add(hand_tween1)
        this.playingTweens.add(hand_tween2)

        var nose_tween = new TWEEN.Tween(this.nose.position, this.playingTweens).to({y: 0.4}, 400).repeat(4).yoyo(true)
        this.playingTweens.add(nose_tween)

        this.cryAudio.play()

        this.startPlayingTweens()
    }

    big() {
        if (this.yoshi.isBig) return
        this.yoshi.isBig = true
        this.bigAudio.play()
        // bigger
        var big_tween1_b = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 1.7, y: 1.7, z: 1.7}, 100)
        var big_tween2_b = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 1.2, y: 1.2, z: 1.2}, 100)
        var big_tween3_b = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 2.5, y: 2.5, z: 2.5}, 100)
        var big_tween4_b = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 2.2, y: 2.2, z: 2.2}, 100)
        var big_tween5_b = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 2.7, y: 2.7, z: 2.7}, 100)
        var y_tween = new TWEEN.Tween(this.mesh.children[0].position, this.playingTweens).to({y: this.mesh.children[0].position.y+7}, 500)
        big_tween1_b.chain(big_tween2_b.chain(big_tween3_b.chain(big_tween4_b.chain(big_tween5_b))))
        this.playingTweens.add(y_tween)
        this.playingTweens.add(big_tween1_b)

        // smaller
        var big_tween1_s = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 2.2, y: 2.2, z: 2.2}, 100).delay(10000)
        var big_tween2_s = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 2.5, y: 2.5, z: 2.5}, 100)
        var big_tween3_s = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 1.5, y: 1.5, z: 1.5}, 100)
        var big_tween4_s = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 1.7, y: 1.7, z: 1.7}, 100)
        var big_tween5_s = new TWEEN.Tween(this.mesh.scale, this.playingTweens).to({x: 1, y: 1, z: 1}, 100)
        var y_tween2 = new TWEEN.Tween(this.mesh.children[0].position, this.playingTweens).to({y: this.mesh.children[0].position.y}, 500).delay(10000)
            .onComplete(() => {
                this.yoshi.isBig = false
            })
        big_tween1_s.chain(big_tween2_s.chain(big_tween3_s.chain(big_tween4_s.chain(big_tween5_s))))
        this.playingTweens.add(y_tween2)
        this.playingTweens.add(big_tween1_s)
        this.startPlayingTweens()
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

    playPose() {
        this.mesh.position.y = this.yoshi.radius
        this.mesh.rotation.y = 270*Math.PI/180
        this.mesh.scale.set(1,1,1)
        this.pose()
    }

    play(callback, millis) {
        this.yoshi.isWaiting = true
        this.playPose()
        this.stopRunning()
        
        var play_tween = new TWEEN.Tween().to({}, millis)
        var nose_tween = new TWEEN.Tween(this.nose.position, this.playingTweens).to({y: 0.35}, 400).repeat(1).yoyo(true)
            .onComplete(() => {
                this.yoshi.isWaiting = false
                this.run()
                this.yoshi.isPlaying = true
                callback()
            })
            .onStart(() => {
                this.yoshiAudio.play()
            })
        play_tween.chain(nose_tween)
        this.playingTweens.add(play_tween)
        this.startPlayingTweens()
    }

    start = () => {
        this.yoshiTweens.getAll().forEach(element => {
            element.start()
        })
    }

    startRunningTweens = () => {
        this.runningTweens.getAll().forEach(element => {
            element.start()
        })
    }

    startPlayingTweens = () => {
        this.playingTweens.getAll().forEach(element => {
            element.start()
        })
    }   

    stop() {
        this.yoshiTweens.removeAll()
    }

    stopPlaying = () => {
        this.playingTweens.removeAll()
    }

    stopRunning = () => {
        this.yoshi.isRunning = false
        this.runningTweens.removeAll()
    }

    choose = (from, to) => {
        return Math.floor(Math.random() * (to - from + 1)) + from
    }

    moveRight = (delta) => {
        if (this.mesh.position.z > this.yoshi.rightBound)
            this.mesh.position.z -= delta
    }

    moveLeft = (delta) => {
        if (this.mesh.position.z < this.yoshi.leftBound)
            this.mesh.position.z += delta
    }

    update(step) {
        
        if (this.yoshi.isPlaying) {

            this.runningTweens.getAll().forEach(element => {
                element.duration(element._duration/step)
            })

            if (this.yoshi.rightPressed && !this.yoshi.isWaiting)
                this.moveRight(this.yoshi.delta)

            if (this.yoshi.leftPressed && !this.yoshi.isWaiting)
                this.moveLeft(this.yoshi.delta)
        }

        this.yoshiTweens.update() 
        this.runningTweens.update()
        this.playingTweens.update() 
    }
}