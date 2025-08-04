import secondModel from "@/game/Model/secondModel";
let repeat: number = -1;
const frameSpeed: number = 20;
export default class CreateSecondAnimation {
    private secondGeneral: secondModel;
    private scene: Phaser.Scene;
    private spriteData: any;
    constructor(
        scene: Phaser.Scene,
        spriteData: any,
        secondGeneral: secondModel
    ) {
        this.scene = scene;
        this.secondGeneral = secondGeneral;
        this.spriteData = spriteData;
        this.Play();
    }
    private createAnimationPlay(
        assetKey: string,
        animKey: string,
        spriteConfig?: { x: number; y: number; initialFrame?: number }
    ): void {
        if (this.spriteData?.fishing_assets[assetKey]) {
            const frames = this.spriteData.fishing_assets[assetKey].map(
                (_: string, index: number) => ({
                    key: `${assetKey}_${index}`,
                })
            );
            if (assetKey === "clam") {
                repeat = 0;
            } else {
                repeat = -1;
            }
            this.scene.anims.create({
                key: animKey,
                frames: frames,
                frameRate: frameSpeed,
                repeat: repeat,
            });

            if (spriteConfig) {
                if (assetKey === "clam") {
                    this.secondGeneral.clam = this.scene.add
                        .sprite(
                            spriteConfig.x,
                            spriteConfig.y,
                            `${assetKey}_${spriteConfig.initialFrame ?? 0}`
                        )
                        .setOrigin(0.5, 1);
                } else {
                    const sprite = this.scene.add
                        .sprite(
                            spriteConfig.x,
                            spriteConfig.y,
                            `${assetKey}_${spriteConfig.initialFrame ?? 0}`
                        )
                        .setOrigin(0.5, 1);
                    sprite.play(animKey);
                }
            }
        }
    }
    private Play(): void {
        this.createAnimationPlay("bird", "bird_anim");
        this.createAnimationPlay("bird_post", "bird_post_anim", {
            x: 74,
            y: 107,
        });
        this.createAnimationPlay("crab", "crab_anim", { x: 425, y: 680 });
        this.createAnimationPlay("clam", "clam_anim", {
            x: 265,
            y: 720,
            initialFrame: 6,
        });
    }
}
