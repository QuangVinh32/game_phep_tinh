const ResolutionPara: number = 2;
const RANDOM_COUNT_NUMBER: number = 4;
const scaleRate: number = 0.8;
import CommunicateBetweenScene from "@/game/controller/CommunicateBetweenScene";
import generateModelInstance from "@/game/Model/generateModel";
export class FishCountScene extends Phaser.Scene {
    private gridSize: number = 60;
    private gridWidth: number = 10;
    private gridHeight: number = 5;
    private gridStartX: number = 170;
    private gridStartY: number = 190;
    private fishData: { [key: string]: number[][] } = {}; // Lưu vị trí cá
    private colors: string[] = ["yellow", "blue", "green", "purple", "orange"];
    private button_start_container!: Phaser.GameObjects.Container;
    private button_choice_container!: Phaser.GameObjects.Container;
    private answerButtons!: {
        btn: Phaser.GameObjects.Container;
        txt: Phaser.GameObjects.Text;
    }[];
    private choiceArray!: number[];
    private correctAnswer: number;
    private colorChosen: string;
    private dataFirstScene: { [key: string]: any };
    private levelIndexText: Phaser.GameObjects.Text;
    private questionText: Phaser.GameObjects.Text;
    private instructionText: Phaser.GameObjects.Text;
    private success: Phaser.Sound.BaseSound;
    private fail: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: "FishCountScene" });
    }

    init(data: any): void {
        this.dataFirstScene = data;
    }
    preload() {
        this.load.image(
            "blue",
            "assets/fishing_assets/fish/blue/caught/frame1.png"
        );
        this.load.image(
            "orange",
            "assets/fishing_assets/fish/orange/caught/frame1.png"
        );
        this.load.image(
            "yellow",
            "assets/fishing_assets/fish/yellow/caught/frame1.png"
        );
        this.load.image(
            "purple",
            "assets/fishing_assets/fish/purple/caught/frame1.png"
        );
        this.load.image(
            "green",
            "assets/fishing_assets/fish/green/caught/frame1.png"
        );
        this.load.image(
            "background_graph",
            "assets/fishing_assets/ui/background_graph.png"
        );
        this.load.image(
            "button_choice",
            "assets/fishing_assets/ui/button_choice.png"
        );
        this.load.image(
            "button_start2",
            "assets/fishing_assets/ui/button_start2.png"
        );
        this.load.audio(
            "success_sound",
            "assets/fishing_assets/sound_success.mp3"
        );
        this.load.audio("fail_sound", "assets/fishing_assets/fail_sound.mp3");
    }
    create() {
        this.add.image(390, 300, "background_graph").setOrigin(0.5, 0.5);
        this.success = this.sound.add("success_sound", {volume: 0.3});
        this.fail = this.sound.add("fail_sound",{volume: 0.3});
        this.createGrid();
        this.populateFish();
        this.colorForQuestion();
        this.questionText = this.add
            .text(
                390,
                545,
                `How many ${this.colorChosen} fish did you catch?`,
                {
                    fontSize: "30px",
                    fontFamily: "sans-serif",
                    color: "#036b84",
                    fontStyle: "bold",
                }
            )
            .setOrigin(0.5, 0.5)
            .setResolution(ResolutionPara);
        this.choiceArray = this.generateOptions(this.correctAnswer);
        this.createChoice(this.choiceArray);
        this.create_play_button();
    }
    update() {}
    private createGrid() {
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                // Vẽ ô lưới
                this.add
                    .rectangle(
                        this.gridStartX + col * this.gridSize,
                        this.gridStartY + row * this.gridSize,
                        this.gridSize,
                        this.gridSize,
                        0xffffff
                    )
                    .setStrokeStyle(3, 0x036b84);
            }
        }

        for (let i = 0; i < this.gridHeight; i++) {
            this.add
                .text(
                    45,
                    this.gridStartY + i * this.gridSize,
                    this.colors[i].toUpperCase(),
                    {
                        fontSize: "20px",
                        color: "#036b84",
                        fontStyle: "bold",
                        fontFamily: "sans-serif",
                    }
                )
                .setResolution(ResolutionPara);
        }

        // Thêm số thứ tự cột
        for (let i = 0; i < this.gridWidth; i++) {
            this.add
                .text(
                    this.gridStartX + i * this.gridSize - 10,
                    this.gridStartY + this.gridHeight * this.gridSize - 15,
                    (i + 1).toString(),
                    { fontSize: "30px", color: "#036b84", fontStyle: "bold" }
                )
                .setResolution(ResolutionPara);
        }
    }

    create_play_button(): void {
        if (!this.button_start_container) {
            this.button_start_container = this.add.container(0, 0);
        }

        this.button_start_container = this.add.container(390, 655);
        let button_start = this.add
            .image(0, 10, "button_start2")
            .setScale(scaleRate);
        let start_text = this.add
            .text(-70, 15, `Start`, {
                fontSize: "30px",
                fontStyle: "bolder",
                fontFamily: "sans-serif",
                color: "#cf0c0c",
            })
            .setOrigin(0.5, 0.5);

        this.levelIndexText = this.add
            .text(70, 15, `Level ${generateModelInstance.levelIndex}`, {
                fontSize: "30px",
                fontStyle: "bold",
                fontFamily: "sans-serif",
                color: "#cf0c0c",
            })
            .setOrigin(0.5, 0.5);

        this.instructionText = this.add
            .text(0, -55, 'Press the "Start" to continue', {
                fontSize: "17px",
                fontStyle: "",
                fontFamily: "sans-serif",
                color: "#036b84",
            })
            .setOrigin(0.5, 0.5);

        this.button_start_container.add([
            button_start,
            start_text,
            this.levelIndexText,
            this.instructionText,
        ]);
        this.button_start_container.setSize(
            button_start.width,
            button_start.height
        );
        this.button_start_container.setInteractive({ useHandCursor: true });
        this.button_start_container.on("pointerdown", () => {
            if(!generateModelInstance.isWrongAnswer){
                generateModelInstance.fishAmountOfLevel += 1;
            }
            this.scene.start("mainScene");
            CommunicateBetweenScene.instance.setHookInteractSceneA();
            CommunicateBetweenScene.instance.restartStat();
            CommunicateBetweenScene.instance.updateBarStat();

        });
        this.button_start_container.setVisible(false);
    }
    createChoice(options: number[]): void {
        this.button_choice_container = this.add.container(390, 655);
        this.answerButtons = [];

        for (let i = 0; i < RANDOM_COUNT_NUMBER; i++) {
            let xPos = -300 + i * 200;
            let yPos = 0;

            // Tạo container chứa button và text
            let btnContainer = this.add.container(xPos, yPos);

            // Tạo button hình ảnh
            let buttonChoice = this.add
                .image(0, 0, "button_choice")
                .setScale(scaleRate);

            // Tạo text và căn giữa
            let txt = this.add
                .text(3, 3, `${options[i]}`, {
                    fontSize: "40px",
                    fontStyle: "bolder",
                    fontFamily: "sans-serif",
                    color: "#cf0c0c",
                })
                .setOrigin(0.5, 0.5);

            // Thêm button và text vào container
            btnContainer.add([buttonChoice, txt]);

            // Thiết lập kích thước interactive cho button
            btnContainer.setSize(
                buttonChoice.width - 10,
                buttonChoice.height - 20
            );
            btnContainer.setInteractive({ useHandCursor: true });
            btnContainer.on("pointerdown", () => {
                this.checkAnswer(options[i]);
                this.button_choice_container.setVisible(false);
                this.button_start_container.setVisible(true);
            });

            // Thêm container vào scene
            this.button_choice_container.add(btnContainer);

            // Lưu vào mảng để xử lý sau
            this.answerButtons.push({ btn: btnContainer, txt });
        }

        // Đặt lại giá trị text cho từng button
        this.answerButtons.forEach((choice, index) => {
            choice.txt.setText(options[index].toString());
            choice.btn.setInteractive({ useHandCursor: true });
        });
    }

    private populateFish() {
        this.createXY();
        for (const color in this.fishData) {
            this.fishData[color].forEach(([x, y]) => {
                this.add
                    .image(
                        this.gridStartX + x * this.gridSize,
                        this.gridStartY + y * this.gridSize,
                        color
                    )
                    .setOrigin(0.5);
            });
        }
    }

    private checkAnswer(AnswerFromPlayer: number) {
        if (AnswerFromPlayer === this.correctAnswer) {
            generateModelInstance.levelIndex += 1;
            this.success.play();
            this.levelIndexText.setText(`Level ${generateModelInstance.levelIndex}`);
            this.questionText.setText("That's correct 😁");
        } else {
            generateModelInstance.isWrongAnswer = true;
            this.fail.play();
            this.questionText.setText(`Nah, That's ${this.correctAnswer} 😕`);
            this.instructionText.setText(
                `Press "Start" to try this level again.`
            );
        }
    }

    private createXY(): void {
        const color_count: number = this.colors.length;
        for (let i = 0; i < color_count; i++) {
            // Kiểm tra và khởi tạo mảng cho màu hiện tại nếu chưa tồn tại
                this.fishData[this.colors[i]] = [];
            // Đảm bảo rằng this.dataFirstScene[this.colors[i]] là số
            const count: number = Number(this.dataFirstScene[this.colors[i]]);
            if (isNaN(count)) {
                console.error(
                    `Expected a number for ${this.colors[i]} but got:`,
                    this.dataFirstScene[this.colors[i]]
                );
                continue;
            }

            for (let j = 0; j < count; j++) {
                this.fishData[this.colors[i]].push([j, i]);
            }
        }
    }
    private colorForQuestion() {
        const randomIndex: number = Math.floor(
            Math.random() * this.colors.length
        );
        this.colorChosen = this.colors[randomIndex];
        this.correctAnswer = this.dataFirstScene[this.colorChosen];
    }

    private generateOptions(correctAnswer: number): number[] {
        const options: Set<number> = new Set();
        const randomIndex: number = Math.floor(
            Math.random() * RANDOM_COUNT_NUMBER
        );
        let i: number = 0;

        while (options.size < RANDOM_COUNT_NUMBER) {
            if (i === randomIndex) {
                options.add(correctAnswer);
            } else {
                const randomAnswer: number =
                    correctAnswer + Phaser.Math.Between(0, 5);
                if (randomAnswer !== correctAnswer && randomAnswer >= 0) {
                    options.add(randomAnswer);
                }
            }
            i++;
        }

        return Array.from(options);
    }
}
