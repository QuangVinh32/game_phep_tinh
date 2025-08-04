import secondModel from "../Model/secondModel";
export default class BirdFlyService {
    private scene: Phaser.Scene;
    private secondGeneral: secondModel;
    constructor(scene: Phaser.Scene, secondGeneral: secondModel) {
        this.scene = scene;
        this.secondGeneral = secondGeneral;
    }
    public createBirdFly() {
        this.secondGeneral.bird_fly = this.scene.add.sprite(-20, 30, "bird_0");
        this.secondGeneral.bird_fly.play("bird_anim");
        this.scene.tweens.add({
            targets: this.secondGeneral.bird_fly,
            x: 900,
            duration: 1500,
            ease: "Linear",
            repeat: 0,
        });
    }
}
