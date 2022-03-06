class CharacterSelect extends Phaser.Scene {

	constructor() {
		super({key:'characterSelect'});
	}

	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');
        this.load.spritesheet('rogue', 'assets/sprites/rogue/rogue.png', {frameWidth: 100, frameHeight: 100 });
	}

	create() {
        this.input.setDefaultCursor("default");
	    var bg = this.add.sprite(0,0,'sky');
        bg.setOrigin(0,0);

        var text = this.add.text(280,50, 'Choose Your Character');

        var rogue = this.add.sprite(150, 400, 'rogue', 4).setInteractive({ useHandCursor: true });

        // group all characters
        var charsGroup = this.add.group([rogue])

        rogue.on("pointerdown", function() {
            charsGroup.setVisible(false);
            rogue.setVisible(true);
			press_enter_rogue.setVisible(true);
            press_enter_rogue.setInteractive({ useHandCursor: true });
        });

        var press_enter_rogue = this.add.text(300, 500, "Press-Enter").setVisible(false);
        
        press_enter_rogue.on('pointerdown', () => {
            this.scene.start("gameScene", {character: "rogue"});
        });
        
	}

    handleContinue() {
        this.scene.start('gameScene', { character: this.selectedKey });
    }

}

export default CharacterSelect;