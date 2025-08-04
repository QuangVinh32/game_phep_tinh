const frameRate: number = 20;
let destination: number;
let repeat_fisherman: number = 0;
let repeat_clam: number = -1;
const Max_Depth: number = 690;
const Min_Depth: number = 250;
const Max_Width: number = 900;
const Min_Width: number = -100;
let randomAmount_category: number = 5;
let amount_fish: number = 7;
let amount_shark: number = 2;
let category: string[] = ["orange", "blue", "green", "purple", "yellow"];
let categoryObject: { [key: string]: number } = {
    orange: 0,
    blue: 0,
    green: 0,
    purple: 0,
    yellow: 0,
    shark: 0,
};

export class Fishing extends Phaser.Scene {
    private spriteData: any;
    private fisherman!: Phaser.GameObjects.Sprite;
    private fish!: Phaser.GameObjects.Sprite;
    private clam!: Phaser.GameObjects.Sprite;
    private shark!: Phaser.GameObjects.Sprite;
    private hook!: Phaser.GameObjects.Image;
    private rope!: Phaser.GameObjects.Graphics;
    private fishGroup!: Phaser.GameObjects.Group;
    private initial!: Phaser.Sound.BaseSound;
    private success!: Phaser.Sound.BaseSound;
    private final_success!: Phaser.Sound.BaseSound;
    private failure!: Phaser.Sound.BaseSound;
    private containerBoard!: Phaser.GameObjects.Container;
    private levelText!: Phaser.GameObjects.Text;
    private levelStateText!: Phaser.GameObjects.Text;
    private levelInstructionText!: Phaser.GameObjects.Text;
    private levelStartText!: Phaser.GameObjects.Text;
    private levelInstructionBoard!: Phaser.GameObjects.Image;
    private levelStartButton!: Phaser.GameObjects.Image;
    private lastHookX: number = 0;
    private lastHookY: number = 0;
    private hookIsMoving: boolean = false;
    private fishCount: number = 0;

    constructor() {
        super({ key: "Fishing" });
    }

    init(data: any): void {
        this.spriteData = data.spriteData;
    }

    private loadFontAndAddText(
        fontFamily: string,
        fontSize: string,
        text: string,
        x: number,
        y: number,
        color: string
    ): Promise<Phaser.GameObjects.Text> {
        return new Promise((resolve) => {
            document.fonts.load(`1em '${fontFamily}'`).then(() => {
                const textObject = this.add
                    .text(x, y, text, {
                        fontSize: fontSize,
                        fontFamily: fontFamily,
                        color: color,
                        align: "center",
                    })
                    .setOrigin(0.5, 0.5);
                resolve(textObject);
            });
        });
    }

    private loadFrames(category: string): void {
        if (this.spriteData?.fishing_assets[category]) {
            this.spriteData.fishing_assets[category].forEach(
                (path: string, index: number) => {
                    this.load.image(`${category}_${index}`, path);
                }
            );
        }
    }

    private loadFishermanFrames(): void {
        const fishermanStates = ["idle", "success", "failure", "success_final"];

        fishermanStates.forEach((state) => {
            const frames = this.spriteData?.fishing_assets.fisherman?.[state];
            if (frames) {
                frames.forEach((path: string, index: number) => {
                    this.load.image(`fisherman_${state}_${index}`, path);
                });
            }
        });
    }

    private loadFishFrames(): void {
        const fishColors = ["yellow", "orange", "green", "purple", "blue"];

        fishColors.forEach((color) => {
            const frames =
                this.spriteData?.fishing_assets.fish?.[color]?.caught;
            if (frames) {
                frames.forEach((path: string, index: number) => {
                    this.load.image(`${color}_fish_caught_${index}`, path);
                });
            }
        });
        fishColors.forEach((color) => {
            const frames = this.spriteData?.fishing_assets.fish?.[color]?.swim;
            if (frames) {
                frames.forEach((path: string, index: number) => {
                    this.load.image(`${color}_fish_swim_${index}`, path);
                });
            }
        });
        // Shark
        const frame_shark_caught =
            this.spriteData?.fishing_assets.shark?.caught;
        if (frame_shark_caught) {
            frame_shark_caught.forEach((path: string, index: number) => {
                this.load.image(`shark_caught_${index}`, path);
            });
        }
        const frame_shark_swim = this.spriteData?.fishing_assets.shark?.swim;
        if (frame_shark_swim) {
            frame_shark_swim.forEach((path: string, index: number) => {
                this.load.image(`shark_swim_${index}`, path);
            });
        }
    }
    private createFishAnimation(): void {
        const fishColors = ["yellow", "blue", "green", "orange", "purple"];

        fishColors.forEach((color) => {
            const frames =
                this.spriteData?.fishing_assets.fish?.[color]?.caught;
            if (frames) {
                this.anims.create({
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
                this.anims.create({
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
            this.anims.create({
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
            this.anims.create({
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
                this.anims.create({
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
            this.fisherman = this.add
                .sprite(390, 185, "fisherman_idle_0")
                .setOrigin(0.5, 1);
            this.fisherman.play("fisherman_idle_anim");
        }
    }

    preload(): void {
        this.load.image(
            "background-fishing",
            "assets/fishing_assets/background.jpg"
        );
        this.load.image(
            "background_instructions",
            "assets/fishing_assets/ui/background_instructions.png"
        );
        this.load.image(
            "button_start",
            "assets/fishing_assets/ui/button_start.png"
        );
        this.load.image("foreground", "assets/fishing_assets/foreground.png");
        this.load.image("hook", "assets/fishing_assets/hook.png");
        this.load.audio("success", "assets/fishing_assets/success.mp3");
        this.load.audio("failure", "assets/fishing_assets/failure.mp3");
        // Load frame bird
        this.loadFrames("bird");
        // Load frame bird_post
        this.loadFrames("bird_post");
        //Load frame fisherman
        this.loadFishermanFrames();
        // Load frame crab
        this.loadFrames("crab");
        // Load frame clam
        this.loadFrames("clam");
        // Load frame fish
        this.loadFishFrames();
    }

    create(): void {
        // Font_style
        const fontStyle = document.createElement("style");
        fontStyle.innerHTML = `
            @font-face {
                font-family: 'Mukta Bold';
                src: url('assets/fishing_assets/font_mukta/Mukta-Bold.woff2') format('woff2');
            }
            @font-face {
                font-family: 'Mukta ExtraBold';
                src: url('assets/fishing_assets/font_mukta/Mukta-ExtraBold.woff2') format('woff2');
            }
            @font-face {
                font-family: 'Mukta Regular';
                src: url('assets/fishing_assets/font_mukta/Mukta-Regular.woff2') format('woff2');
            }
        `;
        document.head.appendChild(fontStyle);

        this.add.image(390, 375, "background-fishing").setOrigin(0.5, 0.5);
        this.add.image(390, 760, "foreground").setOrigin(0.5, 1);
        this.hook = this.add.image(490, 170, "hook").setOrigin(0.5, 1);
        this.fishGroup = this.add.group();
        this.success = this.sound.add("success");
        this.failure = this.sound.add("failure");
        this.containerBoard = this.add.container(390, 375);
        this.levelInstructionBoard = this.add
            .image(0, -35, "background_instructions")
            .setOrigin(0.5, 0.5);
        this.levelStartButton = this.add
            .image(0, 130, "button_start")
            .setOrigin(0.5, 0.5);
        // // Gán giá trị cho các biến
        // this.loadFontAndAddText("Mukta ExtraBold", "45px", "Start", 390, 460, "#7d1108").then(text => this.levelStartText = text);
        // this.loadFontAndAddText("Mukta Bold", "25px", "Level 1", 390, 550, "#7d1108").then(text => this.levelText = text);
        // this.loadFontAndAddText("Mukta ExtraBold", "38px", "Tap to try and catch the fish.", 390, 325, "#0e8a7d").then(text => this.levelInstructionText = text);
        // this.loadFontAndAddText("Mukta Regular", "20px", "Watch out for sharks.", 390, 360, "#0e8a7d").then(text => this.levelStateText = text);
        // // Container
        // this.containerBoard.add([
        //     this.levelInstructionBoard,
        //     this.levelInstructionText,
        //     this.levelStartButton,
        //     this.levelStateText,
        //     this.levelText,
        //     this.levelStartText
        // ]);
        Promise.all([
            this.loadFontAndAddText(
                "Mukta ExtraBold",
                "45px",
                "Start",
                0,
                90,
                "#7d1108"
            ),
            this.loadFontAndAddText(
                "Mukta Regular",
                "25px",
                "Watch out for sharks.",
                0,
                -10,
                "#0e8a7d"
            ),
            this.loadFontAndAddText(
                "Mukta ExtraBold",
                "38px",
                "Tap to try and catch the fish.",
                0,
                -50,
                "#0e8a7d"
            ),
            this.loadFontAndAddText(
                "Mukta Bold",
                "25px",
                "Level 1",
                0,
                180,
                "#7d1108"
            ),
        ]).then(
            ([
                levelStartText,
                levelStateText,
                levelInstructionText,
                levelText,
            ]) => {
                this.levelStateText = levelStateText;
                this.levelInstructionText = levelInstructionText;
                this.levelStartText = levelStartText;
                this.levelText = levelText;

                this.containerBoard.add([
                    this.levelInstructionBoard,
                    this.levelInstructionText,
                    this.levelStartButton,
                    this.levelStateText,
                    this.levelText,
                    this.levelStartText,
                ]);
                this.levelStartButton
                    .setInteractive()
                    .on("pointerover", () => {
                        this.input.setDefaultCursor("pointer");
                    })
                    .on("pointerout", () => {
                        this.input.setDefaultCursor("default");
                    })
                    .on("pointerdown", () => {
                        this.scene.restart();
                    });
            }
        );
        this.containerBoard.setDepth(1);
        this.containerBoard.setVisible(false);

        // Tạo animation bird
        this.createAnimationPlay("bird", "bird_anim");
        // Tạo animation bird_post
        this.createAnimationPlay("bird_post", "bird_post_anim", {
            x: 74,
            y: 107,
        });
        // Tạo animation fisherman
        this.createFishermanAnimation();
        // Tạo animation crab
        this.createAnimationPlay("crab", "crab_anim", { x: 425, y: 680 });
        // Tạo animation clam
        this.createAnimationPlay("clam", "clam_anim", {
            x: 265,
            y: 720,
            initialFrame: 6,
        });
        // Tạo animation fish
        this.createFishAnimation();
        // Tạo cá
        this.randomFish(amount_fish);
        // Tạo rope
        this.rope = this.add.graphics();
        this.drawRope();

        // Xử lý click để di chuyển hook
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            const targetY = Phaser.Math.Clamp(
                pointer.y,
                200,
                (this.sys.game.config.height as number) - 50
            );
            this.tweens.add({
                targets: this.hook,
                y: targetY,
                duration: 300,
                ease: "Expo",
                onUpdate: () => this.drawRope(),
            });
        });
    }
    update(): void {
        this.hookIsMoving =
            this.hook.x !== this.lastHookX || this.hook.y !== this.lastHookY;

        if (this.hookIsMoving) {
            this.checkFishCaught();
        }

        // Cập nhật vị trí hook để kiểm tra lần sau
        this.lastHookX = this.hook.x;
        this.lastHookY = this.hook.y;
    }

    private checkFishCaught(): void {
        (this.fishGroup.getChildren() as Phaser.GameObjects.Sprite[]).forEach(
            (fish) => {
                if (
                    !fish.getData("isCaught") && // Kiểm tra nếu chưa bị bắt
                    Math.abs(fish.x - this.hook.x) < 15 &&
                    Math.abs(fish.y - this.hook.y) < 15
                ) {
                    fish.setData("isCaught", true); // Đánh dấu cá đã bị bắt
                    const fishType: string = fish.texture.key.split("_")[0];
                    this.catchFish(fish, fishType);
                }
            }
        );
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
                repeat_clam = 0;
            } else {
                repeat_clam = -1;
            }
            this.anims.create({
                key: animKey,
                frames: frames,
                frameRate: frameRate,
                repeat: repeat_clam,
            });

            if (spriteConfig) {
                if (assetKey === "clam") {
                    this.clam = this.add
                        .sprite(
                            spriteConfig.x,
                            spriteConfig.y,
                            `${assetKey}_${spriteConfig.initialFrame ?? 0}`
                        )
                        .setOrigin(0.5, 1);
                } else {
                    const sprite = this.add
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

    private drawRope(): void {
        this.rope.clear();
        this.rope.lineStyle(1, 0xffffff, 1);
        this.rope.beginPath();
        this.rope.moveTo(this.fisherman.x + 111, this.fisherman.y - 144);
        this.rope.lineTo(this.hook.x + 5, this.hook.y - 45);
        this.rope.strokePath();
    }

    private Score(category: string) {
        categoryObject[category] += 1;
    }

    private spawnFishSwim(category: string, depth: number, flip: number) {
        if (category === "shark") {
            this.shark = this.add
                .sprite(Min_Width, depth, "shark_caught_0")
                .setOrigin(0.5, 1);
            this.shark.play("shark_swim_anim");

            this.tweens.add({
                targets: this.shark,
                x: Max_Width,
                duration: Phaser.Math.Between(3000, 7000),
                ease: "Linear",
                repeat: -1,
            });

            this.fishGroup.add(this.shark);
        } else {
            this.createTweenSwim(category, flip, depth);
        }
    }

    private createTweenSwim(category: string, flip: number, depth: number) {
        if (flip === 1) {
            this.fish = this.add
                .sprite(Min_Width, depth, `${category}_fish_caught_0`)
                .setOrigin(0.5, 1)
                .setFlipX(true);
            destination = Max_Width;
        } else {
            this.fish = this.add
                .sprite(800, depth, `${category}_fish_caught_0`)
                .setOrigin(0.5, 1);
            destination = Min_Width;
        }

        let fishNumber = this.add
            .text(
                this.fish.x,
                this.fish.y - 30,
                this.fishGroup.getLength().toString(),
                {
                    fontSize: "20px",
                    fontStyle: "bold",
                    color: "#fff",
                }
            )
            .setOrigin(0.5);

        this.fish.setData("fishNumber", fishNumber);

        this.fish.play(`${category}_fish_swim_anim`);
        this.tweens.add({
            targets: [this.fish, fishNumber],
            x: destination,
            duration: Phaser.Math.Between(3000, 7000),
            ease: "Linear",
            repeat: -1,
        });

        this.fishGroup.add(this.fish);
    }

    private randomFish(amount: number): void {
        const delayBetweenSpawns = 500; // Thời gian giữa mỗi lần spawn (ms)

        for (let i: number = 0; i < amount; i++) {
            const randomIndex: number = Math.floor(
                Math.random() * randomAmount_category
            );
            const flip: number = Math.floor(Math.random() * 1);
            const depth: number = Math.floor(
                Math.random() * Min_Depth + Max_Depth - Min_Depth
            );

            this.time.delayedCall(i * delayBetweenSpawns, () => {
                this.spawnFishSwim(category[randomIndex], depth, flip);
            });
        }
        for (let i: number = 0; i < amount_shark; i++) {
            const depth: number = Math.floor(
                Math.random() * Min_Depth + Max_Depth - Min_Depth
            );
            const flip: number = Math.floor(Math.random() * 1);
            this.spawnFishSwim("shark", depth, flip);
        }
    }
    // Hàm xử lý khi cá bị bắt
    private catchFish(fish: Phaser.GameObjects.Sprite, fishType: string): void {
        // Lấy loại cá từ key của frame đầu tiên
        if (fishType === "shark") {
            fish.play("shark_caught_anim");
            this.rope.setVisible(false);
            this.hook.setVisible(false);
            this.failure.play();
            this.fisherman.play("fisherman_failure_anim");
        } else {
            this.success.play();
            this.fisherman.play("fisherman_success_anim");
            this.clam.play("clam_anim");
            fish.play(`${fishType}_fish_caught_anim`);
            this.time.delayedCall(800, () =>
                this.fisherman.play("fisherman_idle_anim")
            );
            this.time.delayedCall(500, () => fish.setAlpha(0.5));

            // Sau khi chạy xong animation thì xóa cá
            this.time.delayedCall(500, () => {
                let fishNumber = fish.getData("fishNumber");
                fishNumber.destroy();
                this.Score(fishType);
                fish.destroy();
            });
        }
    }
}
