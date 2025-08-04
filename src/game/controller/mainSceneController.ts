import mainModel from "@/game/Model/mainModel";
import CreateFishAndFisherAnimation from "../view/CreateFishAnimation";
import SpawnFish from "../service/SpawnFish";
import CreateFishingRope from "../view/CreateFishingRod";
import CheckFishCaught from "../service/CheckFishCaught";
import generateModelInstance from "../Model/generateModel";
import ProgressBarService from "../service/ProgressBarService";
import CommunicateBetweenScene from "./CommunicateBetweenScene";
const INITIAL_HOOK_Y = 100;
const INITIAL_HOOK_X = 495;
export default class mainSceneController {
    public data: { [key: string]: number };
    private mainGeneral: mainModel;
    private createFishAndFisherAnimation: CreateFishAndFisherAnimation;
    private spawnFish: SpawnFish;
    private scene: Phaser.Scene;
    private spriteData: any;
    private createFishingRope: CreateFishingRope;
    private isFishCaught: CheckFishCaught;
    private progressBar: ProgressBarService;
    constructor(scene: Phaser.Scene, spriteData: any, mainGeneral: mainModel) {
        this.scene = scene;
        this.spriteData = spriteData;
        this.mainGeneral = mainGeneral;
        this.createFishAndFisherAnimation = new CreateFishAndFisherAnimation(
            this.scene,
            this.spriteData,
            this.mainGeneral
        );
        this.spawnFish = new SpawnFish(this.scene, this.mainGeneral);
        generateModelInstance.availableIDs = this.CreateAndShuffleIDArray();
        this.spawnFish.randomFish(generateModelInstance.fishAmountOfLevel);
        CommunicateBetweenScene.instance.updateCurrentID();
        console.log(`CurrentID: ${generateModelInstance.currentID}`);
        CommunicateBetweenScene.instance.setNotifyContainerSceneB(generateModelInstance.currentID);
        CommunicateBetweenScene.instance.setNotifyContainerSceneBVisible();
        this.createFishingRope = new CreateFishingRope(
            this.scene,
            this.mainGeneral
        );
        this.isFishCaught = new CheckFishCaught(this.scene, this.mainGeneral);
        this.progressBar = new ProgressBarService(this.scene, this.mainGeneral);
    }

    public initialOverlap(): void {
        this.scene.physics.add.overlap(
            this.mainGeneral.hook,
            this.mainGeneral.fishGroup,
            this.checkFishCaught,
            undefined,
            this
        );
    }

    public updateTaskBarView(Score: number){
        this.progressBar.addScore(Score);
    }

    public updateHookPosition(targetX: number, targetY: number): void {
        this.scene.tweens.add({
            targets: this.mainGeneral.hook,
            x: targetX,
            y: targetY,
            duration: 300,
            ease: "Sine.easeInOut",
            onUpdate: () => this.createFishingRope.drawRope(),
        });
    }

    public checkFishCaught(): Phaser.Types.Physics.Arcade.ArcadePhysicsCallback {
        return (hook, fish) => {
            console.log("Check fish overlap called");
            if (!generateModelInstance.HookCanInteract) return;
            this.isFishCaught.onHookFishOverlap(
                fish as Phaser.Physics.Arcade.Sprite
            );
        };
    }

    pullHook() {
        this.scene.tweens.add({
            targets: this.mainGeneral.hook,
            x: INITIAL_HOOK_X,
            y: INITIAL_HOOK_Y,
            duration: 100,
            ease: "Linear",
            onUpdate: () => this.createFishingRope.drawRope(),
            onComplete: () => {
                generateModelInstance.HookCanInteract = true;
            },
        });
    }

    CreateAndShuffleIDArray(){
        const availableIDs = Array.from({ length: generateModelInstance.fishAmountOfLevel }, (_, i) => i);
        // 2. Shuffle mảng (Fisher–Yates)
        for (let i = availableIDs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableIDs[i], availableIDs[j]] = [availableIDs[j], availableIDs[i]];
        }

        return availableIDs;
    }
}
