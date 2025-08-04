import mainModel from "../Model/mainModel";
import CommunicateBetweenScene from "../controller/CommunicateBetweenScene";
import generateModelInstance from "../Model/generateModel";
import ProgressBarService from "./ProgressBarService";

export default class CheckFishCaught {
    private mainGeneral: mainModel;
    private scene: Phaser.Scene;
    private progressBar: ProgressBarService;
    constructor(scene: Phaser.Scene, mainGeneral: mainModel) {
        this.scene = scene;
        this.mainGeneral = mainGeneral;
        this.progressBar = new ProgressBarService(this.scene, this.mainGeneral);
    }

    // Hàm kiểm tra cá bị bắt theo khoảng cách với hook
    // public checkFishCaught(): void {
    //     const hook = this.mainGeneral.hook;
    //     (
    //         this.mainGeneral.fishGroup.getChildren() as Phaser.GameObjects.Sprite[]
    //     ).forEach((fish) => {
    //         if (
    //             !fish.getData("isCaught") && // Nếu cá chưa bị bắt
    //             Math.abs(fish.x - hook.x) < 15 &&
    //             Math.abs(fish.y - hook.y) < 15
    //         ) {
    //             fish.setData("isCaught", true);
    //             const fishType: string = fish.texture.key.split("_")[0];
    //             this.catchFish(fish, fishType);
    //         }
    //     });
    // }

    // Nếu dùng collider overlap, callback có thể sử dụng hàm này
    public onHookFishOverlap(fish: Phaser.Physics.Arcade.Sprite): void {
        const fishType: string = fish.texture.key.split("_")[0];
        this.catchFish(fish, fishType);
    }

    // Ẩn hook và dây câu
    private HookAndRopeDestroy(): void {
        this.mainGeneral.rope.setVisible(false);
        this.mainGeneral.hook.destroy();
    }

    private catchFish(
        fish: Phaser.Physics.Arcade.Sprite,
        fishType: string
    ): void {
        console.log("Catch Fish Progressing");

        // // Đánh dấu con cá đã bị bắt
        // if (!fish.getData("isCaught")) {
        //     fish.setData("isCaught", true);
        //     // Loại bỏ cá khỏi group để không được overlap kiểm tra thêm
        //     this.mainGeneral.fishGroup.remove(fish, false, false);
        // }

        if (fishType === "shark") {
            fish.play("shark_caught_anim");
            this.HookAndRopeDestroy();
            CommunicateBetweenScene.instance.playFailureOfSceneB();
            this.mainGeneral.fisherman.play("fisherman_failure_anim");

            // Xóa cá sau khi animation (với delay)
            this.scene.time.delayedCall(500, () => {
                fish.destroy();
                CommunicateBetweenScene.instance.setNotifyContainerSceneBInVisible();
                this.scene.time.delayedCall(200, () => {
                    CommunicateBetweenScene.instance.setTextSceneB();
                    CommunicateBetweenScene.instance.setStartButtonToRestart();
                });
            });
        } else {
            console.log(`CurrentID: ${generateModelInstance.currentID}`);
            generateModelInstance.currentFishID = fish.getData("fishID");
            console.log(`CurrentFishID: ${generateModelInstance.currentFishID}`);
            generateModelInstance.HookCanInteract = false;

            if (!generateModelInstance.isVisible) {
                CommunicateBetweenScene.instance.setNotifyContainerSceneBVisible();
                generateModelInstance.isVisible = true;
            }

            if(generateModelInstance.currentFishID !== generateModelInstance.currentID){
                CommunicateBetweenScene.instance.setCatchRightFish(false);
                this.scene.time.delayedCall(500, () => {
                    CommunicateBetweenScene.instance.pullHookSceneA();
                    CommunicateBetweenScene.instance.setCatchRightFishInvisible();
                })
                return;
            }

            this.Score(fishType);

            if (this.mainGeneral.isBarFull) {
                const fishNumber = fish.getData("fishNumber");
                CommunicateBetweenScene.instance.setNotifyFinalSceneB();
                CommunicateBetweenScene.instance.playFinalSuccessSceneB();
                CommunicateBetweenScene.instance.playBirdFlyTweenSceneB();
                this.scene.time.delayedCall(500, () => {
                    fish.destroy();
                    CommunicateBetweenScene.instance.pullHookSceneA();
                    if (fishNumber) {
                        fishNumber.destroy();
                    }
                });
                return;
            }

            CommunicateBetweenScene.instance.playSuccessOfSceneB();
            this.mainGeneral.fisherman.play("fisherman_success_anim");
            CommunicateBetweenScene.instance.playClamOfSceneB();
            fish.play(`${fishType}_fish_caught_anim`);

            // Sau 800ms, đổi animation fisherman về idle
            this.scene.time.delayedCall(800, () =>
                this.mainGeneral.fisherman.play("fisherman_idle_anim")
            );
            // Giảm độ mờ của cá sau 500ms
            this.scene.time.delayedCall(500, () => fish.setAlpha(0.5));

            // Sau 500ms, xóa cá
            this.scene.time.delayedCall(500, () => {
                const fishNumber = fish.getData("fishNumber");
                CommunicateBetweenScene.instance.setNotifyContainerSceneB(
                    generateModelInstance.currentID
                );
                CommunicateBetweenScene.instance.pullHookSceneA();
                if (fishNumber) {
                    fishNumber.destroy();
                }
                fish.destroy();
            });
        }
    }

    // Cập nhật điểm và kiểm tra nếu đã bắt đủ cá của màn chơi
    private Score(category: string): void {
        CommunicateBetweenScene.instance.updateCurrentID();
        this.progressBar.addScore(1);
        if(generateModelInstance.scoreCategory[category] < 10){
            generateModelInstance.scoreCategory[category] += 1;
        }
        generateModelInstance.fishLeft -= 1;
        if (
            this.mainGeneral.isBarFull
        ) {
            generateModelInstance.AllFishCaught = true;
            this.mainGeneral.fisherman.play("fisherman_success_final_anim");
            this.HookAndRopeDestroy();
            // Sau 3 giây, báo hiệu đã bắt đủ cá (để chuyển scene)
            this.scene.time.delayedCall(5000, () => {
                CommunicateBetweenScene.instance.setNotifyContainerSceneBInVisible();
                this.scene.scene.start(
                    "FishCountScene",
                    generateModelInstance.scoreCategory
                );
            });
        }
        console.log(generateModelInstance.scoreCategory);
        console.log(`CurrentID: ${generateModelInstance.currentID}`);
    }
}
