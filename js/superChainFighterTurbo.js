import TitleScene from './titleScene.js';
import GameScene from './gameScene.js';
import CharacterSelect from './characterSelect.js';
import HighScoreScene from './highScoreScene.js';
import UpgradeScene from './upgradeScene.js';

// Our game scene
var gameScene = new GameScene();
var titleScene = new TitleScene();
var characterSelect = new CharacterSelect();
var highScoreScene = new HighScoreScene();
var upgradeScene = new UpgradeScene();

const serverUrl = "https://6thwxfwcdmhf.usemoralis.com:2053/server";
const appId = "vs0g4jMVvYwMO27KJ7G0XB2czwTK8JetVwtdB5Vv";
Moralis.start({ serverUrl, appId });

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: false
		}
	},
};

var game;

(function launch(){
	let user = Moralis.User.current();
	if (!user) {
		console.log("PLEASE LOG IN WITH METAMASK!");
	} else {
		console.log(user.get("ethAddress") + " " + "logged in");
		game = new Phaser.Game(config);

		// load scenes
		game.scene.add('titleScene', titleScene);
		game.scene.add("game", gameScene);
		game.scene.add("characterSelect", characterSelect);
		game.scene.add('highScoreScene', highScoreScene);
		game.scene.add('upgradeScene', upgradeScene);

		// start title
		game.scene.start('titleScene');
	}
})()

