class TitleScene extends Phaser.Scene {

	constructor() {
		super({key:'titleScene'});
	};

	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');
	};

	create() {
		var bg = this.add.sprite(0,0,'sky');
		bg.setOrigin(0,0);

        var text = this.add.text(50, 250, 'Welcome to Super Chain Fighter Turbo!', {font: '32px'});
        var play = this.add.text(150, 400, 'Play', {font: '24px'});
        play.setInteractive({ useHandCursor: true });
        play.on('pointerdown', () => this.clickButton());

        var highScore = this.add.text(500, 400, 'High Scores', {font: '24px'});
        highScore.setInteractive({ useHandCursor: true });
        highScore.on('pointerdown', () => this.clickHighScore());
	};

    clickButton() {
        this.scene.start('characterSelect');
    };

    clickHighScore() {
    	this.scene.start('highScoreScene');
    };
};

export default TitleScene;