import secondModel from "../Model/secondModel";
import secondSceneController from "../controller/secondSceneController";
export default class CreateText {
    private control: secondSceneController;
    private scene: Phaser.Scene;
    private secondGeneral: secondModel;

    constructor(
        scene: Phaser.Scene,
        secondGeneral: secondModel,
        control: secondSceneController
    ) {
        this.scene = scene;
        this.secondGeneral = secondGeneral;
        this.control = control;
        this.addContainer();
        this.notifyText();
        // Khởi tạo các đối tượng text ngay từ đầu (cho ví dụ, bạn có thể truyền text khởi tạo)
        this.createTextPromise();
    }

    /**
     * Hàm load font và tạo đối tượng Text.
     * Sau khi font được load xong, đối tượng text được tạo và resolve.
     */
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
                const textObject = this.scene.add
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

    /**
     * Tạo container chứa các đối tượng text.
     */
    private addContainer() {
        this.secondGeneral.containerBoard = this.scene.add.container(390, 375);
        this.secondGeneral.notifyContainer = this.scene.add.container(670, 120);
    }

    /**
     * Hàm bất đồng bộ tạo các đối tượng text và gán chúng vào secondGeneral.
     * Vì các text được tạo và load font xong, sau này bạn có thể gọi setText từ bất kỳ hàm nào khác.
     */
    private createTextPromise(): Promise<void> {
        // Thêm style định nghĩa font (nên thực hiện một lần, ví dụ ở index.html hoặc trong một module riêng)
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

        // Tạo đối tượng text bất đồng bộ và lưu lại khi hoàn thành
        return Promise.all([
            this.loadFontAndAddText(
                "Mukta ExtraBold",
                "45px",
                "Start",
                0,
                -40,
                "#7d1108"
            ), // Ví dụ: Text cho LevelStartText
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
            ), // Ví dụ: LevelStateText hay LevelInstructionText tùy theo bạn đặt tên
            this.loadFontAndAddText(
                "Mukta Bold",
                "25px",
                "Level 1",
                0,
                50,
                "#7d1108"
            ), // Ví dụ: Text cho LevelText
        ]).then(
            ([
                levelStartText,
                levelStateText,
                levelInstructionText,
                levelText,
            ]) => {
                // Lưu các đối tượng text vào secondGeneral
                this.secondGeneral.levelStartText = levelStartText;
                this.secondGeneral.levelStateText = levelStateText;
                this.secondGeneral.levelInstructionText = levelInstructionText;
                this.secondGeneral.levelText = levelText;

                // Tạo container con chứa các đối tượng liên quan đến khởi đầu level:
                // Chỉ chứa LevelStartButton, LevelStartText và LevelText
                this.secondGeneral.containerStart = this.scene.add.container(
                    0,
                    130
                );
                // Thêm các đối tượng cần tương tác vào childContainer
                this.secondGeneral.containerStart.add([
                    this.secondGeneral.levelStartButton,
                    this.secondGeneral.levelStartText,
                    this.secondGeneral.levelText,
                ]);
                // Set size
                this.secondGeneral.containerStart.setSize(150, 200);
                this.secondGeneral.containerStart.setInteractive({
                    useHandCursor: true,
                });
                this.control.setInteractForStartButton();

                this.secondGeneral.containerBoard.add([
                    this.secondGeneral.levelInstructionBoard,
                    this.secondGeneral.levelInstructionText,
                    this.secondGeneral.levelStateText,
                    this.secondGeneral.containerStart,
                ]);

                this.secondGeneral.containerBoard.setVisible(true);
            }
        );
    }

    private notifyText() {
        this.secondGeneral.notifyCatchRight = this.scene.add
            .text(0, 0, "", {
                fontSize: "30px",
                fontStyle: "bolder",
                color: "#000",
                fontFamily: "Arial",
                align: "center",
            })
            .setOrigin(0.5, 0.5);

        this.secondGeneral.notifyFishLeft = this.scene.add
            .text(0, -77, "Fish Left: ", {
                fontSize: "20px",
                fontStyle: "bolder",
                color: "#000",
                fontFamily: "Arial",
                align: "center",
            })
            .setOrigin(0.5, 0.5);

        this.secondGeneral.notifyIndexText = this.scene.add
            .text(0, -30, "Catch number: ", {
                fontSize: "25px",
                fontStyle: "bolder",
                color: "#000",
                fontFamily: "Arial",
                align: "center",
            })
            .setOrigin(0.5, 0.5);

        this.secondGeneral.notifyContainer.add([
            // notifyText,
            this.secondGeneral.notifyFishLeft,
            this.secondGeneral.notifyIndexText,
            this.secondGeneral.notifyCatchRight,
        ]);
        this.secondGeneral.notifyContainer.setVisible(false);
    }
}
