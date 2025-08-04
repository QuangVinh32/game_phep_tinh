import secondModel from "../Model/secondModel";
export default class FishCaught {
    private scene: Phaser.Scene;
    private secondGeneral: secondModel;
    constructor(scene: Phaser.Scene, secondGeneral: secondModel) {
        this.scene = scene;
        this.secondGeneral = secondGeneral;
    }
    public playClam(): void {
        this.secondGeneral.clam.play("clam_anim");
    }
}
