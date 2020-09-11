
export default class Yoshi {

    constructor(model) {
        this.model = model;
        this.animations = [];

        // retrieve bones
        this.head = model.children[0].children[0].children[0].children[0].children[0].children[0].children[46].skeleton.bones[5];
        this.nose = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[7];
        this.mouth = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[8];
        this.L_arm = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[23];
        this.L_hand = this.L_arm.children[0].children[0].children[0];
        this.R_arm = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[37];
        this.R_hand = this.R_arm.children[0].children[0].children[0];
        this.L_hand = this.L_arm.children[0].children[0].children[0];
        this.L_leg = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[52];
        this.L_calf = this.L_leg.children[0];
        this.L_foot = this.L_calf.children[0];
        this.R_leg = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[56];
        this.R_calf = this.R_leg.children[0];
        this.R_foot = this.R_calf.children[0];
        this.tail = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[60];
        this.spine = model.children[0].children[0].children[0].children[0].children[0].children[0].children[45].skeleton.bones[4];
        
        // execute init function
        this.pose();

        
    }

    pose() {
        // position bones
        this.L_arm.rotation.set( -4.0, 0.0, -1.5707960072844427 );
        this.L_arm.children[0].rotation.set( 0.5, 0.0, 0.5);
        this.L_arm.children[0].children[0].rotation.set( 0.0, 0.0, 0.6);
        this.L_hand.rotation.set( 0.0, 2.0, 0.0 );
        this.R_arm.rotation.set( -0.5, 0.0, -1.570795870291479 );
        this.R_arm.children[0].rotation.set( 0.5, 0.0, 0.5);
        this.R_arm.children[0].children[0].rotation.set( 0.0, 0.0, 0.6);
        this.R_hand.rotation.set( 0.0, 2.0, 0.0 );
    }

    run() {
        var body_tween1 = new TWEEN.Tween(this.model.position).to({y: this.model.position.y+0.5}, 200);
        var body_tween2 = new TWEEN.Tween(this.model.position).to({y: this.model.position.y-0.5}, 200);
        body_tween1.chain(body_tween2.chain(body_tween1));
        this.animations.push(body_tween1);

        var spine_tween1 = new TWEEN.Tween(this.spine.rotation).to({x: 0.5}, 400);
        var spine_tween2 = new TWEEN.Tween(this.head.rotation).to({x: -0.3}, 400);
        this.animations.push(spine_tween1, spine_tween2);
        
        var head_tween1 = new TWEEN.Tween(this.head.rotation).to({y: 0.1}, 200);
        var head_tween2 = new TWEEN.Tween(this.head.rotation).to({y: -0.1}, 400);
        var head_tween3 = new TWEEN.Tween(this.head.rotation).to({y: 0.0}, 200);
        head_tween1.chain(head_tween2.chain(head_tween3.chain(head_tween1)));
        this.animations.push(head_tween1);

        var tail_tween1 = new TWEEN.Tween(this.tail.rotation).to({y: 0.3}, 200);
        var tail_tween2 = new TWEEN.Tween(this.tail.rotation).to({y: -0.3}, 400);
        var tail_tween3 = new TWEEN.Tween(this.tail.rotation).to({y: 0.0}, 200);
        tail_tween1.chain(tail_tween2.chain(tail_tween3.chain(tail_tween1)));
        this.animations.push(tail_tween1);

        var leg_tween1 = new TWEEN.Tween(this.L_leg.rotation).to({x: -4.2}, 200);
        var leg_tween2 = new TWEEN.Tween(this.L_leg.rotation).to({x: -1.8}, 400);
        var leg_tween3 = new TWEEN.Tween(this.L_leg.rotation).to({x: -3.14}, 200); //base
        leg_tween1.chain(leg_tween2.chain(leg_tween3.chain(leg_tween1)));
        this.animations.push(leg_tween1);
        
        var leg_tween4 = new TWEEN.Tween(this.R_leg.rotation).to({x: 1.5}, 200);
        var leg_tween5 = new TWEEN.Tween(this.R_leg.rotation).to({x: -1.0}, 400);
        var leg_tween6 = new TWEEN.Tween(this.R_leg.rotation).to({x: 0.0}, 200); //base
        leg_tween4.chain(leg_tween5.chain(leg_tween6.chain(leg_tween4)));
        this.animations.push(leg_tween4);			
        
        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation).to({x: -2.5}, 200)
        var arm_tween2 = new TWEEN.Tween(this.L_arm.rotation).to({x: -5.0}, 400)
        var arm_tween3 = new TWEEN.Tween(this.L_arm.rotation).to({x: -4.0}, 200)
        arm_tween1.chain(arm_tween2.chain(arm_tween3.chain(arm_tween1)));
        this.animations.push(arm_tween1);

        var arm_tween4 = new TWEEN.Tween(this.R_arm.rotation).to({x: -1.5}, 200)
        var arm_tween5 = new TWEEN.Tween(this.R_arm.rotation).to({x: 0.5}, 400)
        var arm_tween6 = new TWEEN.Tween(this.R_arm.rotation).to({x: -0.5}, 200)
        arm_tween4.chain(arm_tween5.chain(arm_tween6.chain(arm_tween4)));
        this.animations.push(arm_tween4);
        
        return this;
    }

    jump() {
        var spine_tween = new TWEEN.Tween(this.spine.rotation).to({x: 0.5}, 600).repeat(1).yoyo(true);
        var head_tween = new TWEEN.Tween(this.head.rotation).to({x: -0.3}, 600).repeat(1).yoyo(true);
        var arm_tween1 = new TWEEN.Tween(this.L_arm.rotation).to({x: -5.0}, 300).repeat(1).yoyo(true).delay(300);
        var arm_tween2 = new TWEEN.Tween(this.R_arm.rotation).to({x: 0.5}, 300).repeat(1).yoyo(true).delay(300);
        var arm_tween1_b = new TWEEN.Tween(this.L_arm.rotation).to({x: -3.0}, 300).repeat(1).yoyo(true).delay(300);
        var arm_tween2_b = new TWEEN.Tween(this.R_arm.rotation).to({x: -2.0}, 300).repeat(1).yoyo(true).delay(300);
        if (Math.round(Math.random()) == 1) this.animations.push(arm_tween1, arm_tween2)
        else this.animations.push(arm_tween1_b, arm_tween2_b)
        this.animations.push(spine_tween, head_tween)

        var nose_tween = new TWEEN.Tween(this.nose.position).to({y: 0.35}, 200).repeat(1).yoyo(true).delay(300);
        this.animations.push(nose_tween);

        var calf_tween1 = new TWEEN.Tween(this.L_calf.rotation).to({x: 0.8}, 200).repeat(1).yoyo(true);
        var calf_tween2 = new TWEEN.Tween(this.R_calf.rotation).to({x: 0.8}, 200).repeat(1).yoyo(true);
        this.animations.push(calf_tween1, calf_tween2)

        var foot_tween1 = new TWEEN.Tween(this.L_foot.rotation).to({x: -1.4}, 200).repeat(1).yoyo(true);
        var foot_tween2 = new TWEEN.Tween(this.R_foot.rotation).to({x: -1.4}, 200).repeat(1).yoyo(true);
        var foot_tween3 = new TWEEN.Tween(this.L_foot.rotation).to({x: 0.2}, 200);
        var foot_tween4 = new TWEEN.Tween(this.R_foot.rotation).to({x: 0.2}, 200);
        var foot_tween5 = new TWEEN.Tween(this.L_foot.rotation).to({x: -0.6}, 200).delay(160);
        var foot_tween6 = new TWEEN.Tween(this.R_foot.rotation).to({x: -0.6}, 200).delay(160);
        foot_tween1.chain(foot_tween3);
        foot_tween2.chain(foot_tween4);
        this.animations.push(foot_tween1, foot_tween2);

        var body_tween = new TWEEN.Tween(this.model.position).to({y: this.model.position.y-0.2}, 200).repeat(1).yoyo(true);
        this.animations.push(body_tween);

        var tail_tween = new TWEEN.Tween(this.tail.rotation).to({y: 1.0}, 200).repeat(5).yoyo(true);
        this.animations.push(tail_tween);
        
        var jump_tween1 = new TWEEN.Tween(this.model.position).to({y: this.model.position.y+15.0}, 500).easing(TWEEN.Easing.Quadratic.Out).delay(430);
        var jump_tween2 = new TWEEN.Tween(this.model.position).to({y: this.model.position.y}, 300).easing(TWEEN.Easing.Quadratic.In);
        jump_tween1.chain(jump_tween2, foot_tween5, foot_tween6);
        this.animations.push(jump_tween1);

        //new Audio('/models/yoshi/sounds/jump.mp3').volume(0.5).play(); 

        return this;
    }

    start() {
        this.animations.forEach(element => {
            element.start();
        });
    }

    stop() {
        this.animations.length = 0;
    }
}