class HighScoreScene extends Phaser.Scene {

	constructor() {
		super({key:'highScoreScene'});

	}


	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');

	}


	create() {
		var bg = this.add.sprite(0,0,'sky');
		bg.setOrigin(0,0);

		this.add.text( 350, 50, 'High scores!');

		var back = this.add.text( 50, 550, '<-- Back');

		back.setInteractive({ useHandCursor: true });
        back.on('pointerdown', () => this.clickBack());

	}

	clickBack() {
    	this.scene.start('titleScene');
    }


}

export default HighScoreScene;