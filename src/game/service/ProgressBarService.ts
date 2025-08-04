import MainModel from "../Model/mainModel";

export default class ProgressBarService{
    private model: MainModel;
    private scene: Phaser.Scene;
    constructor(scene: Phaser.Scene, model: MainModel){
        this.scene = scene;
        this.model = model;
    }
    public addScore(points: number) {
        this.model.currentScore = Phaser.Math.Clamp(this.model.currentScore + points, 0, this.model.maxScore);
        this.updateProgressBar();
      
        // Nếu đã đầy bar, kết thúc ván
        if (this.model.currentScore >= this.model.maxScore) {
          this.model.isBarFull = true;
        }
      }
      
    private updateProgressBar() {
        // Tính tỉ lệ: từ 0 đến 1
        const t = this.model.currentScore / this.model.maxScore;
        // Gán lại width proportional
        this.model.barFill.width = this.model.barWidth * t;
      }
      
    //   private onGameComplete() {
    //     // Ví dụ: dừng scene, show “Game Over” hoặc chuyển scene khác
    //     this.scene.pause();
    //     this.add.text(200, 200, 'You Win!', { fontSize: '32px', color: '#ff0' });
    //     // hoặc this.scene.start('GameOverScene');
    //   }
          
}