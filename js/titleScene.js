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

        var text = this.add.text(200,300, 'Welcome to Super Chain Fighter Turbo!');
        var play = this.add.text(350,400, 'Play');
        play.setInteractive({ useHandCursor: true });
        play.on('pointerdown', () => this.clickButton());
	}

    clickButton() {
        this.scene.start('characterSelect');
    }

}

export default TitleScene;