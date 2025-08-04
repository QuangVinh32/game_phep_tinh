import CreateText from "@/game/view/CreateText";
import LoadOther from "@/game/LoadData/LoadOtherObject";
import CreateSecondAnimation from "../../view/CreateSecondAnimation";
import secondModel from "@/game/Model/secondModel";
import CommunicateBetweenScene from "@/game/controller/CommunicateBetweenScene";
import secondSceneController from "@/game/controller/secondSceneController";
import { Create } from "phaser";
export default class secondScene extends Phaser.Scene {
    private spriteData: any;
    private createSecondAnimation: CreateSecondAnimation;
    private createFont: CreateText;
    private secondGeneral: secondModel;
    private control: secondSceneController;
    constructor() {
        super({ key: "secondScene" });
        this.secondGeneral = new secondModel();
        this.control = new secondSceneController(this.secondGeneral);
    }

    init(data: any): void {
        this.spriteData = data.spriteData;
    }

    preload(): void {
        this.load.image(
            "background_instructions",
            "assets/fishing_assets/ui/background_instructions.png"
        );
        this.load.image(
            "button_start",
            "assets/fishing_assets/ui/button_start.png"
        );
        this.load.image("foreground", "assets/fishing_assets/foreground.png");
        this.load.audio("success", "assets/fishing_assets/success.mp3");
        this.load.audio("failure", "assets/fishing_assets/failure.mp3");
        this.load.audio(
            "final_success",
            "assets/fishing_assets/final_success.mp3"
        );
        const loadOther = new LoadOther(this, this.spriteData);
    }

    create(): void {
        this.add.image(390, 760, "foreground").setOrigin(0.5, 1);
        this.secondGeneral.levelInstructionBoard = this.add
            .image(0, -35, "background_instructions")
            .setOrigin(0.5, 0.5);
        this.secondGeneral.levelStartButton = this.add
            .image(0, 0, "button_start")
            .setOrigin(0.5, 0.5);
        this.secondGeneral.success = this.sound.add("success", { volume: 0.3 });
        this.secondGeneral.failure = this.sound.add("failure", { volume: 0.3 });
        this.secondGeneral.final_success = this.sound.add("final_success", {
            volume: 0.3,
        });
        this.createSecondAnimation = new CreateSecondAnimation(
            this,
            this.spriteData,
            this.secondGeneral
        );
        this.createFont = new CreateText(
            this,
            this.secondGeneral,
            this.control
        );
        CommunicateBetweenScene.instance.setSceneB(this, this.secondGeneral);
    }
}
