export default class LoadOther{
    private scene: Phaser.Scene;
    private spriteData: any;
    constructor(scene: Phaser.Scene, spriteData: any){
        this.scene = scene;
        this.spriteData = spriteData;
        this.loadFrames();
    }
    private loadFrames(): void {
        const categories = ['bird', 'bird_post', 'crab', 'clam'];
        categories.forEach((category) =>{
        if (this.spriteData?.fishing_assets[category]) {
            this.spriteData.fishing_assets[category].forEach(
                (path: string, index: number) => {
                    this.scene.load.image(`${category}_${index}`, path);
                }
            );
        }
    });
    }
}