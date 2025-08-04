import { Spicy_Rice } from "next/font/google";
import mainModel from "@/game/Model/mainModel";
let repeat_fisherman: number = 0;
const frameRate: number = 20;
export default class CreateFishAndFisherAnimation {
    public scene: Phaser.Scene;
    private spriteData: any;
    private mainGeneral: mainModel;
    constructor(scene: Phaser.Scene, spriteData: any, mainGeneral: mainModel) {
        this.scene = scene;
        this.spriteData = spriteData;
        this.mainGeneral = mainGeneral;
        this.createFishAnimation();
        this.createFishermanAnimation();
    }
    private createFishAnimation(): void {
        const fishColors = ["yellow", "blue", "green", "orange", "purple"];

        fishColors.forEach((color) => {
            const frames =
                this.spriteData?.fishing_assets.fish?.[color]?.caught;
            if (frames) {
                this.scene.anims.create({
                    key: `${color}_fish_caught_anim`,
                    frames: frames.map((_: string, index: number) => ({
                        key: `${color}_fish_caught_${index}`,
                    })),
                    frameRate: frameRate,
                    repeat: -1,
                });
            }
        });

        fishColors.forEach((color) => {
            const frames = this.spriteData?.fishing_assets.fish?.[color]?.swim;
            if (frames) {
                this.scene.anims.create({
                    key: `${color}_fish_swim_anim`,
                    frames: frames.map((_: string, index: number) => ({
                        key: `${color}_fish_swim_${index}`,
                    })),
                    frameRate: frameRate,
                    repeat: -1,
                });
            }
        });
        // Shark
        const shark_frame_caught =
            this.spriteData?.fishing_assets.shark?.caught;
        if (shark_frame_caught) {
            this.scene.anims.create({
                key: `shark_caught_anim`,
                frames: shark_frame_caught.map((_: string, index: number) => ({
                    key: `shark_caught_${index}`,
                })),
                frameRate: frameRate,
                repeat: 0,
            });
        }
        const shark_frame_swim = this.spriteData?.fishing_assets.shark?.swim;
        if (shark_frame_swim) {
            this.scene.anims.create({
                key: `shark_swim_anim`,
                frames: shark_frame_swim.map((_: string, index: number) => ({
                    key: `shark_swim_${index}`,
                })),
                frameRate: frameRate,
                repeat: -1,
            });
        }
    }

    private createFishermanAnimation(): void {
        const animations = ["success", "failure", "success_final", "idle"];

        animations.forEach((anim) => {
            if (anim === "idle") {
                repeat_fisherman = -1;
            } else {
                repeat_fisherman = 0;
            }
            const frames = this.spriteData?.fishing_assets.fisherman?.[anim];
            if (frames) {
                this.scene.anims.create({
                    key: `fisherman_${anim}_anim`,
                    frames: frames.map((_: string, index: number) => ({
                        key: `fisherman_${anim}_${index}`,
                    })),
                    frameRate: frameRate,
                    repeat: repeat_fisherman,
                });
            }
        });

        if (this.spriteData?.fishing_assets.fisherman?.idle) {
            this.mainGeneral.fisherman = this.scene.add
                .sprite(390, 185, "fisherman_idle_0")
                .setOrigin(0.5, 1);
            this.mainGeneral.fisherman.play("fisherman_idle_anim");
        }
    }
}
