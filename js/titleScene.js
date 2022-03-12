class TitleScene extends Phaser.Scene {

	constructor() {
		super({key:'titleScene'});
	}

	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');
	}

	create() {
		var bg = this.add.sprite(0,0,'sky');
		bg.setOrigin(0,0);

        var text = this.add.text(250,200, 'Welcome to Super Chain Fighter Turbo!');
        var play = this.add.text(400,400, 'Play');
        play.setInteractive({ useHandCursor: true });
        play.on('pointerdown', () => this.clickButton());

        var highScore = this.add.text( 650, 400, 'High Scores' );
        highScore.setInteractive({ useHandCursor: true });
        highScore.on('pointerdown', () => this.clickHighScore());

        var upgrade = this.add.text( 50, 400, 'Upgrades' );
        upgrade.setInteractive({ useHandCursor: true });
        upgrade.on('pointerdown', () => this.clickUpgrade());
	}

    clickButton() {
        this.scene.start('characterSelect');
    }

    clickHighScore() {
    	this.scene.start('highScoreScene');
    }

    clickUpgrade() {
    	this.scene.start('upgradeScene');
    }

}

export default TitleScene;