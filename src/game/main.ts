import Boot from './scenes/Boot';
import GameOver from './scenes/GameOver';
import MainGame from './scenes/Game';
import MainMenu from './scenes/MainMenu';
import Preloader from './scenes/Preloader';
import { AUTO, Game } from 'phaser';
// import { Fishing } from './scenes/Fishing_Game/Fishing';
import mainScene from './scenes/Fishing_Game/mainScene';
import { PreloadFishing } from './scenes/Fishing_Game/Loading';
import { FishCountScene } from './scenes/Fishing_Game/CountFish';
import secondScene from './scenes/Fishing_Game/secondScene';
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 780, // Fishing: 780
    height: 750, // Fishing: 750
    parent: 'game-container',
    backgroundColor: '#fff',
    scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade", 
        arcade: {
            gravity: {x: 0, y: 0 }, 
            debug: true, 
        }
    },
    scene: [
        PreloadFishing,
        Boot,
        mainScene,
        secondScene,
        FishCountScene,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
