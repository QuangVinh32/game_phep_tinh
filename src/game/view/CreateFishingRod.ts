import mainModel from "@/game/Model/mainModel";

export default class CreateFishingRope {
    private scene: Phaser.Scene;
    private mainGeneral: mainModel;

    constructor(scene: Phaser.Scene, general: mainModel) {
        this.scene = scene;
        this.mainGeneral = general;
        this.createFishingRope();
    }

    // Tạo hook có physics body bằng cách sử dụng physics.add.image
    private initialHook(): void {
        this.mainGeneral.hook = this.scene.physics.add
            .image(495, 100, "hook")
            .setOrigin(0.5, 1)
            .setSize(25, 30);
    }

    private initialRope(): void {
        this.mainGeneral.rope = this.scene.add.graphics();
    }

    private createFishingRope(): void {
        this.initialHook();
        this.initialRope();
        this.drawRope();
    }

    public drawRope(): void {
        this.mainGeneral.rope.clear();
        this.mainGeneral.rope.lineStyle(1, 0xffffff, 1);
        this.mainGeneral.rope.beginPath();
        this.mainGeneral.rope.moveTo(
            this.mainGeneral.fisherman.x + 111,
            this.mainGeneral.fisherman.y - 144
        );
        this.mainGeneral.rope.lineTo(
            this.mainGeneral.hook.x + 5,
            this.mainGeneral.hook.y - 45
        );
        this.mainGeneral.rope.strokePath();
    }
}
