export default class LoadMainFrames{
    public scene: Phaser.Scene;
    private spriteData: any;
    constructor(scene: Phaser.Scene, spriteData: any){
        this.scene = scene
        this.spriteData = spriteData;
        this.loadFishFrames();
        this.loadFishermanFrames();
    }
    
    private loadFishermanFrames(): void {
        const fishermanStates = ["idle", "success", "failure", "success_final"];
    
        fishermanStates.forEach((state) => {
            const frames = this.spriteData?.fishing_assets.fisherman?.[state];
            if (frames) {
                frames.forEach((path: string, index: number) => {
                    this.scene.load.image(`fisherman_${state}_${index}`, path);
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
                    this.scene.load.image(`${color}_fish_caught_${index}`, path);
                });
            }
        });
        fishColors.forEach((color) => {
            const frames = this.spriteData?.fishing_assets.fish?.[color]?.swim;
            if (frames) {
                frames.forEach((path: string, index: number) => {
                    this.scene.load.image(`${color}_fish_swim_${index}`, path);
                });
            }
        });
        // Shark
        const frame_shark_caught =
            this.spriteData?.fishing_assets.shark?.caught;
        if (frame_shark_caught) {
            frame_shark_caught.forEach((path: string, index: number) => {
                this.scene.load.image(`shark_caught_${index}`, path);
            });
        }
        const frame_shark_swim = this.spriteData?.fishing_assets.shark?.swim;
        if (frame_shark_swim) {
            frame_shark_swim.forEach((path: string, index: number) => {
                this.scene.load.image(`shark_swim_${index}`, path);
            });
        }
    }
}


