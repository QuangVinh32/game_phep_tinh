export default class secondModel {
    public clam!: Phaser.GameObjects.Sprite;
    public bird_fly!: Phaser.GameObjects.Sprite;
    public failure!: Phaser.Sound.BaseSound;
    public success!: Phaser.Sound.BaseSound;
    public final_success!: Phaser.Sound.BaseSound;
    public containerBoard!: Phaser.GameObjects.Container;
    public containerStart!: Phaser.GameObjects.Container;
    public levelText!: Phaser.GameObjects.Text;
    public levelStateText!: Phaser.GameObjects.Text;
    public levelInstructionText!: Phaser.GameObjects.Text;
    public levelStartText!: Phaser.GameObjects.Text;
    public levelInstructionBoard!: Phaser.GameObjects.Image;
    public levelStartButton!: Phaser.GameObjects.Image;
    public level: number = 1;
    public isFail: boolean = false;
    public notifyIndexText: Phaser.GameObjects.Text;
    public notifyContainer!: Phaser.GameObjects.Container;
    public notifyFishLeft: Phaser.GameObjects.Text;
    public notifyCatchRight: Phaser.GameObjects.Text;
    constructor() {}
}
