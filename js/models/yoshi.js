import { GLTFLoader } from 'https://unpkg.com/three@0.119.1/examples/jsm/loaders/GLTFLoader.js'
export default class Yoshi {

    constructor() {
        this.isJumping = false;
        this.isRunning = false;
        this.isCrying = false;
        this.isPlaying = false;
    }

    async load() {
        var loader = new GLTFLoader()
        return new Promise((resolve, reject) => {
            loader.load('/models/yoshi/scene.gltf', object => {
                this.init(object.scene)
                resolve(object.scene)
            }, null, reject)
        })
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
        this.up_bound = -60
        this.down_bound = 60
        
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
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case 'r' || 'R': 
                    this.run()
                    break

                case ' ':
                    this.jump()
                    break

                case 'ArrowRight':
                    this.right_pressed = true
                    if (this.isPlaying && this.body.position.z > this.right_bound){
                        if (this.up_pressed && this.body.position.x > this.up_bound)
                            new TWEEN.Tween(this.body.position).to({z: this.body.position.z-5, x: this.body.position.x-5}, 130).start()
                        else if (this.down_pressed && this.body.position.x < this.down_bound)
                            new TWEEN.Tween(this.body.position).to({z: this.body.position.z-5, x: this.body.position.x+5}, 130).start()
                        else
                            new TWEEN.Tween(this.body.position).to({z: this.body.position.z-5}, 130).start()
                    }
                    break
                
                case 'ArrowLeft':
                    this.left_pressed = true
                    if (this.isPlaying && this.body.position.z < this.left_bound) {
                        if (this.up_pressed && this.body.position.x > this.up_bound)
                            new TWEEN.Tween(this.body.position).to({z: this.body.position.z+5, x: this.body.position.x-5}, 130).start()
                        else if (this.down_pressed && this.body.position.x < this.down_bound)
                            new TWEEN.Tween(this.body.position).to({z: this.body.position.z+5, x: this.body.position.x+5}, 130).start()
                        else 
                            new TWEEN.Tween(this.body.position).to({z: this.body.position.z+5}, 130).start()
                    }
                    break

                case 'ArrowUp':
                    this.up_pressed = true
                    if (this.isPlaying && this.body.position.x > this.up_bound) {
                        if (this.left_pressed && this.body.position.z < this.left_bound)
                            new TWEEN.Tween(this.body.position).to({x: this.body.position.x-5, z: this.body.position.z+5}, 130).start()
                        else if (this.right_pressed && this.body.position.z > this.right_bound)
                            new TWEEN.Tween(this.body.position).to({x: this.body.position.x-5, z: this.body.position.z-5}, 130).start()
                        else 
                            new TWEEN.Tween(this.body.position).to({x: this.body.position.x-5}, 130).start()
                    }
                    break

                case 'ArrowDown':
                    this.down_pressed = true
                    if (this.isPlaying && this.body.position.x < this.down_bound) {
                        if (this.left_pressed && this.body.position.z < this.left_bound)
                            new TWEEN.Tween(this.body.position).to({x: this.body.position.x+5, z: this.body.position.z+5}, 130).start()
                        else if (this.right_pressed && this.body.position.z > this.right_bound)
                            new TWEEN.Tween(this.body.position).to({x: this.body.position.x+5, z: this.body.position.z-5}, 130).start()
                        else 
                            new TWEEN.Tween(this.body.position).to({x: this.body.position.x+5}, 130).start()
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
                    break
                
                case 'ArrowLeft':
                    this.left_pressed = false
                    break

                case 'ArrowUp':
                    this.up_pressed = false
                    break

                case 'ArrowDown':
                    this.down_pressed = false

                default:
                    break
            }
        })
    }

    run() {
        if (this.isJumping || this.isCrying || this.isPlaying) return
        if (this.isRunning) {
            this.stop()
            this.pose()
            this.isRunning = false
            return
        }
        
        this.isRunning = true

        var body_tween1 = new TWEEN.Tween(this.body2.position).to({y: this.body2.position.y+0.5}, 200)
        var body_tween2 = new TWEEN.Tween(this.body2.position).to({y: this.body2.position.y-0.5}, 200)
        body_tween1.chain(body_tween2.chain(body_tween1))
        TWEEN.add(body_tween1)

        var spine_tween1 = new TWEEN.Tween(this.spine.rotation).to({x: 0.5}, 400)
        TWEEN.add(spine_tween1)
        
        var head_tween1 = new TWEEN.Tween(this.head.rotation).to({y: 0.1}, 200)
        var head_tween2 = new TWEEN.Tween(this.head.rotation).to({y: -0.1}, 400)
        var head_tween3 = new TWEEN.Tween(this.head.rotation).to({y: 0.0}, 200)
        var head_tween4 = new TWEEN.Tween(this.head.rotation).to({x: -0.3}, 400)
        TWEEN.add(head_tween4)
        head_tween1.chain(head_tween2.chain(head_tween3.chain(head_tween1)))
        TWEEN.add(head_tween1)

        var tail_tween1 = new TWEEN.Tween(this.tail.rotation).to({y: 0.3}, 200)
        var tail_tween2 = new TWEEN.Tween(this.tail.rotation).to({y: -0.3}, 400)
        var tail_tween3 = new TWEEN.Tween(this.tail.rotation).to({y: 0.0}, 200)
        tail_tween1.chain(tail_tween2.chain(tail_tween3.chain(tail_tween1)))
        TWEEN.add(tail_tween1)

        var leg_tween1 = new TWEEN.Tween(this.L_leg.rotation).to({x: -4.2}, 200)
        var leg_tween2 = new TWEEN.Tween(this.L_leg.rotation).to({x: -1.8}, 400)
        var leg_tween3 = new TWEEN.Tween(this.L_leg.rotation).to({x: -3.14}, 200)
        leg_tween1.chain(leg_tween2.chain(leg_tween3.chain(leg_tween1)))
        TWEEN.add(leg_tween1)
        
        var leg_tween4 = new TWEEN.Tween(this.R_leg.rotation).to({x: 1.5}, 200)
        var leg_tween5 = new TWEEN.Tween(this.R_leg.rotation).to({x: -1.0}, 400)
        var leg_tween6 = new TWEEN.Tween(this.R_leg.rotation).to({x: 0.0}, 200)
        leg_tween4.chain(leg_tween5.chain(leg_tween6.chain(leg_tween4)))
        TWEEN.add(leg_tween4)			
        
        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation).to({x: -2.5}, 200)
        var arm_tween2 = new TWEEN.Tween(this.L_arm.rotation).to({x: -5.0}, 400)
        var arm_tween3 = new TWEEN.Tween(this.L_arm.rotation).to({x: -4.0}, 200)
        arm_tween1.chain(arm_tween2.chain(arm_tween3.chain(arm_tween1)))
        TWEEN.add(arm_tween1)

        var arm_tween4 = new TWEEN.Tween(this.R_arm.rotation).to({x: -1.5}, 200)
        var arm_tween5 = new TWEEN.Tween(this.R_arm.rotation).to({x: 0.5}, 400)
        var arm_tween6 = new TWEEN.Tween(this.R_arm.rotation).to({x: -0.5}, 200)
        arm_tween4.chain(arm_tween5.chain(arm_tween6.chain(arm_tween4)))
        TWEEN.add(arm_tween4)
        
        this.start()

        return
    }

    jump() {
        if (this.isJumping || this.isCrying) return
        
        this.isJumping = true

        var audio = new Audio('/models/yoshi/sounds/jump'+this.choose(1,2).toString()+'.mp3')
        audio.volume = 0.5
        audio.play()

        if (this.isRunning) {
            var height = 15
            if (this.isPlaying) height = 40
            var jump_tween1 = new TWEEN.Tween(this.body.position).to({y: this.body.position.y+height}, 500).easing(TWEEN.Easing.Quadratic.Out)
            var jump_tween2 = new TWEEN.Tween(this.body.position).to({y: this.body.position.y}, 300).easing(TWEEN.Easing.Quadratic.In)
                .onComplete(() => {
                    this.isJumping = false
                })
            jump_tween1.chain(jump_tween2)
            TWEEN.add(jump_tween1)

            var nose_tween = new TWEEN.Tween(this.nose.position).to({y: 0.35}, 200).repeat(1).yoyo(true).delay(300)
            TWEEN.add(nose_tween)

            this.start()
            return
        }
        
        var spine_tween = new TWEEN.Tween(this.spine.rotation).to({x: 0.5}, 600).repeat(1).yoyo(true)
        TWEEN.add(spine_tween)

        var head_tween = new TWEEN.Tween(this.head.rotation).to({x: -0.3}, 600).repeat(1).yoyo(true)
        TWEEN.add(head_tween)

        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation).to({x: -5.0}, 300).repeat(1).yoyo(true).delay(300)
        var arm_tween2 = new TWEEN.Tween(this.R_arm.rotation).to({x: 0.5}, 300).repeat(1).yoyo(true).delay(300)
        var arm_tween1_b = new TWEEN.Tween(this.L_arm.rotation).to({x: -3.0}, 300).repeat(1).yoyo(true).delay(300)
        var arm_tween2_b = new TWEEN.Tween(this.R_arm.rotation).to({x: -2.0}, 300).repeat(1).yoyo(true).delay(300)
        if (this.choose(1,2) == 1){
            TWEEN.add(arm_tween1)
            TWEEN.add(arm_tween2)
        } 
        else {
            TWEEN.add(arm_tween1_b)
            TWEEN.add(arm_tween2_b)
        }

        var nose_tween = new TWEEN.Tween(this.nose.position).to({y: 0.35}, 200).repeat(1).yoyo(true).delay(300)
        TWEEN.add(nose_tween)

        var calf_tween1 = new TWEEN.Tween(this.L_calf.rotation).to({x: 0.8}, 200).repeat(1).yoyo(true)
        TWEEN.add(calf_tween1) 
        var calf_tween2 = new TWEEN.Tween(this.R_calf.rotation).to({x: 0.8}, 200).repeat(1).yoyo(true)
        TWEEN.add(calf_tween2) 

        var foot_tween1 = new TWEEN.Tween(this.L_foot.rotation).to({x: -1.4}, 200).repeat(1).yoyo(true)
        var foot_tween2 = new TWEEN.Tween(this.R_foot.rotation).to({x: -1.4}, 200).repeat(1).yoyo(true)
        var foot_tween3 = new TWEEN.Tween(this.L_foot.rotation).to({x: 0.2}, 200)
        var foot_tween4 = new TWEEN.Tween(this.R_foot.rotation).to({x: 0.2}, 200)
        var foot_tween5 = new TWEEN.Tween(this.L_foot.rotation).to({x: -0.6}, 200).delay(160)
        var foot_tween6 = new TWEEN.Tween(this.R_foot.rotation).to({x: -0.6}, 200).delay(160)
            .onComplete(() => {
                this.isJumping = false;
            })
        foot_tween1.chain(foot_tween3)
        foot_tween2.chain(foot_tween4)
        TWEEN.add(foot_tween1)
        TWEEN.add(foot_tween2)

        var body_tween = new TWEEN.Tween(this.body.position).to({y: this.body.position.y-0.2}, 200).repeat(1).yoyo(true)
        TWEEN.add(body_tween)

        var tail_tween = new TWEEN.Tween(this.tail.rotation).to({y: 1.0}, 200).repeat(5).yoyo(true)
        TWEEN.add(tail_tween)
        
        var jump_tween1 = new TWEEN.Tween(this.body.position).to({y: this.body.position.y+15.0}, 500).easing(TWEEN.Easing.Quadratic.Out).delay(430)
        var jump_tween2 = new TWEEN.Tween(this.body.position).to({y: this.body.position.y}, 300).easing(TWEEN.Easing.Quadratic.In)
        jump_tween1.chain(jump_tween2, foot_tween5, foot_tween6)
        TWEEN.add(jump_tween1)
        
        audio.play()
        
        this.start()

        return
    }

    cry() {
        if (this.isCrying || this.isJumping || !this.isPlaying) return
        this.isCrying = true
        this.stop()
        this.pose()

        var head_tween1 = new TWEEN.Tween(this.head.rotation).to({x: 0.8}, 200)
        var head_tween2 = new TWEEN.Tween(this.head.rotation).to({y: -0.2}, 200)
        var head_tween3 = new TWEEN.Tween(this.head.rotation).to({y: 0.2}, 400)
        var head_tween4 = new TWEEN.Tween(this.head.rotation).to({y: 0.0}, 200)
        var head_tween5 = new TWEEN.Tween(this.head.rotation).to({y: -0.2}, 200)
        var head_tween6 = new TWEEN.Tween(this.head.rotation).to({y: 0.2}, 400)
        var head_tween7 = new TWEEN.Tween(this.head.rotation).to({y: 0.0}, 200)
            .onComplete(() => {
                this.pose()
                this.isCrying = false
            })
        head_tween1.chain(head_tween2.chain(head_tween3.chain(head_tween4.chain(head_tween5.chain(head_tween6.chain(head_tween7))))))
        TWEEN.add(head_tween1)

        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation).to({x: -5.5}, 200)
        var arm_tween2 = new TWEEN.Tween(this.R_arm.rotation).to({x: -2.2}, 200)
        TWEEN.add(arm_tween1)
        TWEEN.add(arm_tween2)

        var hand_tween1 = new TWEEN.Tween(this.L_hand.rotation).to({x: 0.5}, 200)
        var hand_tween2 = new TWEEN.Tween(this.R_hand.rotation).to({x: 0.2}, 200)
        TWEEN.add(hand_tween1)
        TWEEN.add(hand_tween2)

        var nose_tween = new TWEEN.Tween(this.nose.position).to({y: 0.4}, 400).repeat(4).yoyo(true)
        TWEEN.add(nose_tween)

        var audio = new Audio('/models/yoshi/sounds/lose.mp3')
        audio.volume = 0.5
        audio.play()

        this.start()
    }

    pose() {
        var body_tween = new TWEEN.Tween(this.body.position).to({y: this.body.position.y}, 200)
        TWEEN.add(body_tween)

        var spine_tween = new TWEEN.Tween(this.spine.rotation).to({x: 0}, 200)
        TWEEN.add(spine_tween)
        
        var head_tween1 = new TWEEN.Tween(this.head.position).to({y: 0.37}, 200)
        var head_tween2 = new TWEEN.Tween(this.head.rotation).to({x: 0.1}, 200)
        TWEEN.add(head_tween1)
        TWEEN.add(head_tween2)

        var tail_tween = new TWEEN.Tween(this.tail.rotation).to({y: 0.0}, 200)
        TWEEN.add(tail_tween)

        var leg_tween1 = new TWEEN.Tween(this.L_leg.rotation).to({x: -3.14}, 200)
        var leg_tween2 = new TWEEN.Tween(this.R_leg.rotation).to({x: 0}, 200)
        TWEEN.add(leg_tween1)
        TWEEN.add(leg_tween2)

        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation).to({x: -4.0}, 200)
        var arm_tween2 = new TWEEN.Tween(this.R_arm.rotation).to({x: -0.5}, 200)
        TWEEN.add(arm_tween1)
        TWEEN.add(arm_tween2)

        var nose_tween = new TWEEN.Tween(this.nose.position).to({y: 0.27}, 200)
        TWEEN.add(nose_tween)

        this.start();
    }

    game() {
        this.stop()
        this.pose()
        if (this.isRunning) this.isRunning = false
        
        var audio = new Audio('/models/yoshi/sounds/yoshi.mp3')
        audio.volume = 0.5
        audio.play()

        var body_tween = new TWEEN.Tween(this.body.rotation).to({y: 270*Math.PI/180}, 2000)
            .onComplete(() => {
                this.run()
                this.isPlaying = true
            })
        var nose_tween = new TWEEN.Tween(this.nose.position).to({y: 0.35}, 200).repeat(1).yoyo(true).delay(300)
        nose_tween.start()
        body_tween.start()
    }

    start() {
        TWEEN.getAll().forEach(element => {
            element.start()
        })
    }

    stop() {
        TWEEN.removeAll()
    }

    choose(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from
    }
}