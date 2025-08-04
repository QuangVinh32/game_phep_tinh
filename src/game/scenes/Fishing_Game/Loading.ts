import generateModelInstance from "@/game/Model/generateModel";
export class PreloadFishing extends Phaser.Scene {
    constructor() {
        super("PreloadFishing");
    }

    preload() {
        // Load JSON chứa danh sách frame
        this.load.json("spriteData", "assets/fishing_assets/frameFishing.json");

        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.add
            .text(width / 2, height / 2 - 50, "Loading...", {
                fontSize: "20px",
                color: "#ffffff",
            })
            .setOrigin(0.5, 0.5);

        this.load.on("progress", (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on("complete", () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            this.startGame();
        });
    }

    startGame() {
        generateModelInstance.spriteData = this.cache.json.get("spriteData");
        const spriteData = generateModelInstance.spriteData;
        console.log("✅ JSON Loaded:", generateModelInstance.spriteData);

        this.scene.start("mainScene", { spriteData });

        this.scene.launch("secondScene", { spriteData });
    }
}
