export default class MainModel {
    public fish!: Phaser.Physics.Arcade.Sprite;
    public fisherman!: Phaser.GameObjects.Sprite; 
    public hook!: Phaser.Physics.Arcade.Image;
    public fishGroup!: Phaser.Physics.Arcade.Group;
    public rope!: Phaser.GameObjects.Graphics;
    public shark!: Phaser.Physics.Arcade.Sprite;
    public maxScore = 2;       
    public currentScore = 0;
    public barWidth = 450;
    public barHeight = 15;
    public barBg!: Phaser.GameObjects.Rectangle;
    public barFill!: Phaser.GameObjects.Rectangle;
    public isBarFull: Boolean = false;

    constructor(){}
}
