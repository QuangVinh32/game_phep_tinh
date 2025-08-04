import FishCaught from "../service/FishCaught";
import secondModel from "../Model/secondModel";
import BirdFlyService from "../service/BirdFlyService";
import mainModel from "../Model/mainModel";
import mainSceneController from "./mainSceneController";
import generateModelInstance from "../Model/generateModel";
export default class CommunicateBetweenScene {
    private secondGeneral: secondModel;
    private mainGeneral: mainModel;
    private fishCaught: FishCaught;
    private birdFly: BirdFlyService;
    private mainController: mainSceneController;
    private static _instance: CommunicateBetweenScene;

    private sceneA: Phaser.Scene | null = null;
    private sceneB: Phaser.Scene | null = null;

    private constructor() {}

    static get instance() {
        if (!CommunicateBetweenScene._instance) {
            CommunicateBetweenScene._instance = new CommunicateBetweenScene();
        }
        return CommunicateBetweenScene._instance;
    }

    // General 

    restartStat(){
        generateModelInstance.AllFishCaught = false;
        generateModelInstance.HookCanInteract = true;
        generateModelInstance.AllFishCaught = false;
        generateModelInstance.isVisible = false;
        generateModelInstance.fishLeft = generateModelInstance.fishAmountOfLevel;
        generateModelInstance.scoreCategory = {
            "orange": 0,
            "blue": 0,
            "green": 0,
            "purple": 0,
            "yellow": 0,
        };
    }

    // Scene A
    setSceneA(
        scene: Phaser.Scene,
        mainGeneral: mainModel,
        mainController: mainSceneController
    ) {
        this.sceneA = scene;
        this.mainGeneral = mainGeneral;
        this.mainController = mainController;
    }

    pullHookSceneA() {
        this.mainController.pullHook();
    }

    setHookInteractSceneA() {
        console.log("Pressed");
        this.sceneA?.input.on(
            "pointerdown",
            (pointer: Phaser.Input.Pointer) => {
                const targetY = Phaser.Math.Clamp(
                    pointer.y,
                    200,
                    (this.sceneA?.sys.game.config.height as number) - 50
                );
                const targetX = Phaser.Math.Clamp(
                    pointer.x,
                    200,
                    (this.sceneA?.sys.game.config.width as number) - 50
                );
                this.mainController.updateHookPosition(targetX, targetY);
            }
        );
    }

    updateBarStat(){
        this.mainGeneral.currentScore = 0;
        this.mainGeneral.isBarFull = false;
    }
    updateCurrentID(){
        generateModelInstance.currentID = generateModelInstance.availableIDs.pop()!;
    }

    // Scene B
    setSceneB(scene: Phaser.Scene, secondGeneral: secondModel) {
        this.sceneB = scene;
        this.secondGeneral = secondGeneral;
        this.fishCaught = new FishCaught(this.sceneB, secondGeneral);
        this.birdFly = new BirdFlyService(this.sceneB, this.secondGeneral);
    }

    playClamOfSceneB() {
        this.fishCaught.playClam();
    }

    playSuccessOfSceneB() {
        this.secondGeneral.success.play();
    }

    playFailureOfSceneB() {
        this.secondGeneral.failure.play();
    }

    playFinalSuccessSceneB() {
        this.secondGeneral.final_success.play();
    }

    playBirdFlyTweenSceneB() {
        this.birdFly.createBirdFly();
    }

    setTextSceneB(): void {
        this.secondGeneral.levelInstructionText.setText(
            "Oh no! A shark ate your hook!"
        );
        this.secondGeneral.levelStateText.setText(
            'Select "Start" to try this level again.'
        );
        this.secondGeneral.levelText.setText(`Level ${generateModelInstance.levelIndex}`);
    }

    setContainerTextVisibleSceneB() {
        this.secondGeneral.containerBoard.setVisible(true);
    }

    setNotifyContainerSceneBVisible() {
        this.secondGeneral.notifyContainer.setVisible(true);
    }

    setNotifyContainerSceneB(numberCaught: number) {
        this.secondGeneral.notifyIndexText.setText(
            `Catch number: ${numberCaught.toString()}`
        );
        this.secondGeneral.notifyFishLeft.setText(`Fish Left: ${generateModelInstance.fishLeft}`);
    }

    setNotifyFinalSceneB() {
        this.secondGeneral.notifyIndexText.setText("Completed 😀");
        this.secondGeneral.notifyFishLeft.setText(`Fish Left: ${generateModelInstance.fishLeft}`);
    }
    setNotifyContainerSceneBInVisible() {
        this.secondGeneral.notifyContainer.setVisible(false);
    }

    setStartButtonToRestart() {
        // Xóa các event listener cũ
        this.secondGeneral.containerStart.removeAllListeners();

        this.secondGeneral.containerStart.on("pointerdown", () => {
            generateModelInstance.isRestartPressed = true;
            this.sceneA?.scene.restart();
            this.secondGeneral.containerBoard.setVisible(false);
            this.restartStat();
        });
        this.secondGeneral.containerBoard.setVisible(true);
    }

    setCatchRightFish(right: boolean){
        if(right){
            this.secondGeneral.notifyCatchRight.setText("Good!");
        }else{
            this.secondGeneral.notifyCatchRight.setText("Wrong Fish!!!");
        }
        this.secondGeneral.notifyCatchRight.setVisible(true);
    }

    setCatchRightFishInvisible(){
        this.secondGeneral.notifyCatchRight.setVisible(false);
    }
}
