import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'
export default class Yoshi {

    constructor(scene) {

        this.isJumping = false;
        this.isRunning = false;
        this.isCrying = false;
        this.isPlaying = false;
        this.isWaiting = false;
        this.yoshiTweens = new TWEEN.Group()
        
        this.jump1_audio = new Audio('/models/yoshi/sounds/jump1.mp3')
        this.jump1_audio.volume = 0.5
        this.jump2_audio = new Audio('/models/yoshi/sounds/jump2.mp3')
        this.jump2_audio.volume = 0.5
        this.yoshi_audio = new Audio('/models/yoshi/sounds/yoshi.mp3')
        this.yoshi_audio.volume = 0.5
        this.lose_audio = new Audio('/models/yoshi/sounds/lose.mp3')
        this.lose_audio.volume = 0.5

        this.load(scene)
    }

    async load(scene) {
        var loader = new GLTFLoader()
        loader.load('/models/yoshi/scene.gltf', object => {
            this.init(object.scene)
            scene.add(object.scene)
        }, null, null)
    }

    init(model) {
        this.bones(model);
        // position bones
        this.body.position.y = -15
        this.body.rotation.y = 240*Math.PI/180
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
        
        this.right_pressed = false
        this.left_pressed = false
        this.up_pressed = false
        this.down_pressed = false
        this.right_bound = -60
        this.left_bound = 60
        this.up_bound = -40
        this.down_bound = 50
        
        this.keyboard();
    }

    bones(model) {
        // retrieve bones
        this.body = model
        this.body2 = this.body.children[0]
        this.spine = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[4]
        this.head = model.children[0].children[0].children[0].children[0].children[0].children[0].children[46].skeleton.bones[5]
        this.nose = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[7]
        this.mouth = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[8]
        this.L_arm = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[23]
        this.L_hand = this.L_arm.children[0].children[0].children[0]
        this.R_arm = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[37]
        this.R_hand = this.R_arm.children[0].children[0].children[0]
        this.L_hand = this.L_arm.children[0].children[0].children[0]
        this.L_leg = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[52]
        this.L_calf = this.L_leg.children[0]
        this.L_foot = this.L_calf.children[0]
        this.R_leg = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[56]
        this.R_calf = this.R_leg.children[0]
        this.R_foot = this.R_calf.children[0]
        this.tail = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[60]
    }

    keyboard () {
        var moveRight = (delta=5, time=120) => {new TWEEN.Tween(this.body.position, this.yoshiTweens).to({z: this.body.position.z-delta}, time).start()}
        var moveLeft = (delta=5, time=120) => {new TWEEN.Tween(this.body.position, this.yoshiTweens).to({z: this.body.position.z+delta}, time).start()}
        var moveUp = (delta=5, time=120) => {new TWEEN.Tween(this.body.position, this.yoshiTweens).to({x: this.body.position.x-delta}, time).start()}
        var moveDown = (delta=5, time=120) => {new TWEEN.Tween(this.body.position, this.yoshiTweens).to({x: this.body.position.x+delta}, time).start()}
        
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case 'r' || 'R': 
                    if (!this.isPlaying) this.run()
                    break

                case ' ':
                    this.jump()
                    break

                case 'ArrowRight':
                    if (this.isPlaying && this.body.position.z > this.right_bound){
                        if (!this.right_pressed) this.right_pressed = true
                        moveRight()
                        if (this.up_pressed && this.body.position.x > this.up_bound) moveUp()
                        else if (this.down_pressed && this.body.position.x < this.down_bound) moveDown()
                    }
                    break
                
                case 'ArrowLeft':
                    if (this.isPlaying && this.body.position.z < this.left_bound) {
                        this.left_pressed = true
                        moveLeft()
                        if (this.up_pressed && this.body.position.x > this.up_bound) moveUp()
                        else if (this.down_pressed && this.body.position.x < this.down_bound) moveDown()
                    }
                    break

                case 'ArrowUp':
                    if (this.isPlaying && this.body.position.x > this.up_bound) {
                        this.up_pressed = true
                        moveUp()
                        if (this.right_pressed && this.body.position.z > this.right_bound) moveRight()
                        else if (this.left_pressed && this.body.position.z < this.left_bound)  moveLeft()
                    }
                    break

                case 'ArrowDown':
                    if (this.isPlaying && this.body.position.x < this.down_bound) {
                        this.down_pressed = true
                        moveDown()
                        if (this.right_pressed && this.body.position.z > this.right_bound) moveRight()
                        else if (this.left_pressed && this.body.position.z < this.left_bound)  moveLeft()
                    }
                    break

                default:
                    break
            }
        }, false)

        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case 'ArrowRight':
                    this.right_pressed = false
                    if (this.up_pressed && this.body.position.x > this.up_bound) moveUp()
                    else if (this.down_pressed && this.body.position.x < this.down_bound) moveDown()
                    break
                
                case 'ArrowLeft':
                    this.left_pressed = false
                    if (this.up_pressed && this.body.position.x > this.up_bound) moveUp()
                    else if (this.down_pressed && this.body.position.x < this.down_bound) moveDown()
                    break

                case 'ArrowUp':
                    this.up_pressed = false
                    if (this.right_pressed && this.body.position.z > this.right_bound) moveRight()
                    else if (this.left_pressed && this.body.position.z < this.left_bound)  moveLeft()
                    break

                case 'ArrowDown':
                    this.down_pressed = false
                    if (this.right_pressed && this.body.position.z > this.right_bound) moveRight()
                    else if (this.left_pressed && this.body.position.z < this.left_bound)  moveLeft()
                
                case ' ':
                    if (this.right_pressed && this.body.position.z > this.right_bound) moveRight()
                    else if (this.left_pressed && this.body.position.z < this.left_bound)  moveLeft()
                    else if (this.up_pressed && this.body.position.x > this.up_bound) moveUp()
                    else if (this.down_pressed && this.body.position.x < this.down_bound) moveDown()
                    break

                default:
                    break
            }
        })
    }

    run(v=1) {
        if (this.isJumping || this.isCrying || this.isWaiting) return
        if (this.isRunning) {
            this.stop()
            this.pose()
            this.isRunning = false
            return
        }
        
        this.isRunning = true

        var body_tween1 = new TWEEN.Tween(this.body2.position, this.yoshiTweens).to({y: this.body2.position.y+0.5}, 200/v)
        var body_tween2 = new TWEEN.Tween(this.body2.position, this.yoshiTweens).to({y: this.body2.position.y-0.5}, 200/v)
        body_tween1.chain(body_tween2.chain(body_tween1))
        this.yoshiTweens.add(body_tween1)

        var spine_tween1 = new TWEEN.Tween(this.spine.rotation, this.yoshiTweens).to({x: 0.5}, 400/v)
        this.yoshiTweens.add(spine_tween1)
        
        var head_tween1 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: 0.1}, 200/v)
        var head_tween2 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: -0.1}, 400/v)
        var head_tween3 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({y: 0.0}, 200/v)
        var head_tween4 = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({x: -0.3}, 400/v)
        this.yoshiTweens.add(head_tween4)
        head_tween1.chain(head_tween2.chain(head_tween3.chain(head_tween1)))
        this.yoshiTweens.add(head_tween1)

        var tail_tween1 = new TWEEN.Tween(this.tail.rotation, this.yoshiTweens).to({y: 0.3}, 200/v)
        var tail_tween2 = new TWEEN.Tween(this.tail.rotation, this.yoshiTweens).to({y: -0.3}, 400/v)
        var tail_tween3 = new TWEEN.Tween(this.tail.rotation, this.yoshiTweens).to({y: 0.0}, 200/v)
        tail_tween1.chain(tail_tween2.chain(tail_tween3.chain(tail_tween1)))
        this.yoshiTweens.add(tail_tween1)

        var leg_tween1 = new TWEEN.Tween(this.L_leg.rotation, this.yoshiTweens).to({x: -4.2}, 200/v)
        var leg_tween2 = new TWEEN.Tween(this.L_leg.rotation, this.yoshiTweens).to({x: -1.8}, 400/v)
        var leg_tween3 = new TWEEN.Tween(this.L_leg.rotation, this.yoshiTweens).to({x: -3.14}, 200/v)
        leg_tween1.chain(leg_tween2.chain(leg_tween3.chain(leg_tween1)))
        this.yoshiTweens.add(leg_tween1)
        
        var leg_tween4 = new TWEEN.Tween(this.R_leg.rotation, this.yoshiTweens).to({x: 1.5}, 200/v)
        var leg_tween5 = new TWEEN.Tween(this.R_leg.rotation, this.yoshiTweens).to({x: -1.0}, 400/v)
        var leg_tween6 = new TWEEN.Tween(this.R_leg.rotation, this.yoshiTweens).to({x: 0.0}, 200/v)
        leg_tween4.chain(leg_tween5.chain(leg_tween6.chain(leg_tween4)))
        this.yoshiTweens.add(leg_tween4)			
        
        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -2.5}, 200/v)
        var arm_tween2 = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -5.0}, 400/v)
        var arm_tween3 = new TWEEN.Tween(this.L_arm.rotation, this.yoshiTweens).to({x: -4.0}, 200/v)
        arm_tween1.chain(arm_tween2.chain(arm_tween3.chain(arm_tween1)))
        this.yoshiTweens.add(arm_tween1)

        var arm_tween4 = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: -1.5}, 200/v)
        var arm_tween5 = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: 0.5}, 400/v)
        var arm_tween6 = new TWEEN.Tween(this.R_arm.rotation, this.yoshiTweens).to({x: -0.5}, 200/v)
        arm_tween4.chain(arm_tween5.chain(arm_tween6.chain(arm_tween4)))
        this.yoshiTweens.add(arm_tween4)
        
        this.start()

        return
    }

    jump() {
        if (this.isJumping || this.isCrying || this.isWaiting) return
        
        this.isJumping = true
        var jump_height = 15

        if (this.choose(1,2) == 1) this.jump1_audio.play()
        else this.jump2_audio.play()

        if (this.isRunning) {
            
            if (this.isPlaying) jump_height = 40
            
            var spine_tween = new TWEEN.Tween(this.spine.rotation, this.yoshiTweens).to({x: 0}, 400).repeat(1).yoyo(true)
            this.yoshiTweens.add(spine_tween)

            var head_tween = new TWEEN.Tween(this.head.rotation, this.yoshiTweens).to({x: 0}, 400).repeat(1).yoyo(true)
            this.yoshiTweens.add(head_tween)

            var jump_tween1 = new TWEEN.Tween(this.body.position, this.yoshiTweens).to({y: this.body.position.y+jump_height}, 500).easing(TWEEN.Easing.Quadratic.Out)
            var jump_tween2 = new TWEEN.Tween(this.body.position, this.yoshiTweens).to({y: this.body.position.y}, 300).easing(TWEEN.Easing.Quadratic.In)
                .onComplete(() => {
                    this.isJumping = false
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
                this.isJumping = false;
            })
        this.yoshiTweens.add(foot_tween1)
        this.yoshiTweens.add(foot_tween2)

        var body_tween = new TWEEN.Tween(this.body.position, this.yoshiTweens).to({y: this.body.position.y-0.2}, 200).repeat(1).yoyo(true)
        this.yoshiTweens.add(body_tween)

        var tail_tween = new TWEEN.Tween(this.tail.rotation, this.yoshiTweens).to({y: 1.0}, 200).repeat(3).yoyo(true)
        this.yoshiTweens.add(tail_tween)
        
        var jump_tween1 = new TWEEN.Tween(this.body.position, this.yoshiTweens).to({y: this.body.position.y+jump_height}, 500).easing(TWEEN.Easing.Quadratic.Out)
        var jump_tween2 = new TWEEN.Tween(this.body.position, this.yoshiTweens).to({y: this.body.position.y}, 300).easing(TWEEN.Easing.Quadratic.In)
        jump_tween1.chain(jump_tween2, foot_tween3, foot_tween4)
        this.yoshiTweens.add(jump_tween1)
        
        this.start()

        return
    }

    cry() {
        if (this.isCrying || this.isJumping || this.isWaiting) return
        this.isCrying = true
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
                this.pose()
                this.isCrying = false
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

        this.lose_audio.play()

        this.start()
    }

    pose() {
        var body_tween = new TWEEN.Tween(this.body.position, this.yoshiTweens).to({y: this.body.position.y}, 200)
        this.yoshiTweens.add(body_tween)

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

    game() {
        this.isWaiting = true
        this.stop()
        this.pose()
        
        this.yoshi_audio.play()

        var body_tween = new TWEEN.Tween(this.body.rotation, this.yoshiTweens).to({y: 270*Math.PI/180}, 2000)
            .onComplete(() => {
                this.isWaiting = false
                this.run()
                this.isPlaying = true
            })
        var nose_tween = new TWEEN.Tween(this.nose.position, this.yoshiTweens).to({y: 0.35}, 200).repeat(1).yoyo(true).delay(300)
        this.yoshiTweens.add(nose_tween)
        this.yoshiTweens.add(body_tween)
        this.start()
    }

    start() {
        this.yoshiTweens.getAll().forEach(element => {
            element.start()
        })
    }

    stop() {
        this.yoshiTweens.removeAll()
    }

    choose(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from
    }

    update() {
        this.yoshiTweens.update()
    }
}