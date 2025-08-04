import generateModelInstance from "../Model/generateModel";
import mainModel from "../Model/mainModel";
const Max_Depth = 680;
const Min_Depth = 280;
const Max_Width = 900;
const Min_Width = -100;
const categories = ["orange","blue","green","purple","yellow"];

export default class SpawnFish {
  constructor(
    private scene: Phaser.Scene,
    private mainGeneral: mainModel
  ){}

  private createTweenSwim(category: string, flip: number, depth: number, ID: number) {
    // 1) Tạo fish sprite
    const x0 = flip === 1 ? Min_Width : Max_Width;
    this.mainGeneral.fish = this.scene.physics.add
      .sprite(x0, depth, `${category}_fish_caught_0`)
      .setOrigin(0.5, 1)
      .setFlipX(flip === 1);

    // 2) Tạo text & gán data
    const fishNumber = this.scene.add
      .text(this.mainGeneral.fish.x, this.mainGeneral.fish.y - 30, `${ID}`, {
        fontSize: "25px",
        fontStyle: "bold",
        color: "#a70000",
      })
      .setOrigin(0.5);

    this.mainGeneral.fish.setData("fishNumber", fishNumber);
    this.mainGeneral.fish.setData("fishID", ID);
    this.mainGeneral.fish.play(`${category}_fish_swim_anim`);

    // 3) Tween di chuyển
    this.scene.tweens.add({
      targets: [this.mainGeneral.fish, fishNumber],
      x: flip === 1 ? Max_Width : Min_Width,
      duration: Phaser.Math.Between(4000, 7000),
      ease: "Linear",
      repeat: -1,
    });

    this.mainGeneral.fish.body?.setSize(30, 20);
    this.mainGeneral.fishGroup.add(this.mainGeneral.fish);
  }

  private spawnShark(depth: number, flip: number) {
    this.mainGeneral.shark = this.scene.physics.add
      .sprite(Min_Width, depth, "shark_caught_0")
      .setOrigin(0.5, 1);
    this.mainGeneral.shark.play("shark_swim_anim");
    this.scene.tweens.add({
      targets: this.mainGeneral.shark,
      x: Max_Width,
      duration: Phaser.Math.Between(4000, 7000),
      ease: "Linear",
      repeat: -1,
    });
    this.mainGeneral.shark.body?.setSize(32, 30, false);
    this.mainGeneral.shark.body?.setOffset(110, 45);
    this.mainGeneral.fishGroup.add(this.mainGeneral.shark);
  }

  public randomFish(amount: number): void {
    // Lấy ID & shuffle
    const ids = [...generateModelInstance.availableIDs];
    const delay = 200;
    for (let i = 0; i < amount; i++) {
      const ID = ids[i];
      if (ID == null) {
        console.warn("Hết ID:", i, "/", amount);
        break;
      }

      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const flip = Math.random() < 0.5 ? 1 : 0;
      const depth = Phaser.Math.Between(Min_Depth, Max_Depth);

      this.scene.time.delayedCall(i * delay, () => {
        this.createTweenSwim(randomCat, flip, depth, ID);
      });
    }

    // Spawn sharks
    for (let i = 0; i < generateModelInstance.amount_shark; i++) {
      const flip = Math.random() < 0.5 ? 1 : 0;
      const depth = Phaser.Math.Between(Min_Depth, Max_Depth);
      this.spawnShark(depth, flip);
    }
  }
}
