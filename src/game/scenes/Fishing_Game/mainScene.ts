import LoadMainFrames from "@/game/LoadData/LoadMainFrame";
import mainModel from "@/game/Model/mainModel";
import mainSceneController from "@/game/controller/mainSceneController";
import CommunicateBetweenScene from "@/game/controller/CommunicateBetweenScene";
import generateModelInstance from "@/game/Model/generateModel";

export default class mainScene extends Phaser.Scene {
    private spriteData: any;
    private mainGeneral: mainModel;
    private loadMainFrames: LoadMainFrames;
    private controller: mainSceneController;
    constructor() {
        super({ key: "mainScene" });
        this.mainGeneral = new mainModel();
    }

    init(data: any): void {
        this.spriteData = data.spriteData;
    }

    preload() {
        this.load.audio("success", "assets/fishing_assets/success.mp3");
        this.load.audio("failure", "assets/fishing_assets/failure.mp3");
        this.load.image("hook", "assets/fishing_assets/hook.png");
        this.load.image(
            "background-fishing",
            "assets/fishing_assets/background.jpg"
        );
        this.loadMainFrames = new LoadMainFrames(this, this.spriteData);
    }

    create() {
        this.add.image(390, 375, "background-fishing").setOrigin(0.5, 0.5);

        this.mainGeneral.fishGroup = this.physics.add.group();

        this.controller = new mainSceneController(
            this,
            this.spriteData,
            this.mainGeneral
        );

        CommunicateBetweenScene.instance.setSceneA(
            this,
            this.mainGeneral,
            this.controller
        );

        // Trong create(), thiết lập collider
        console.log(this.mainGeneral.fishGroup);

        this.physics.add.overlap(
            this.mainGeneral.hook,
            this.mainGeneral.fishGroup,
            this.controller.checkFishCaught(),
            undefined,
            this
        );

        if (generateModelInstance.isRestartPressed) {
            CommunicateBetweenScene.instance.setHookInteractSceneA();
            generateModelInstance.isRestartPressed = false;
        }

        // Bar background (khung ngoài)
        this.mainGeneral.barBg = this.add.rectangle(200, 5, this.mainGeneral.barWidth, this.mainGeneral.barHeight)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x666666);

        // Bar fill (phần sẽ scale theo score)
        this.mainGeneral.barFill = this.add.rectangle(200, 5, 0, this.mainGeneral.barHeight)
        .setOrigin(0, 0)
        .setFillStyle(0xb5e550);
            }

    // private isHookMoving(): boolean {
    //     return this.mainGeneral.hook.x !== this.mainGeneral.lastHookX || this.mainGeneral.hook.y !== this.mainGeneral.lastHookY;
    // }

    // private updateLastHookPosition(): void {
    //     this.mainGeneral.lastHookX = this.mainGeneral.hook.x;
    //     this.mainGeneral.lastHookY = this.mainGeneral.hook.y;
    // }
}
