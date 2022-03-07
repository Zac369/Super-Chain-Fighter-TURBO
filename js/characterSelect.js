class CharacterSelect extends Phaser.Scene {

	constructor() {
		super({key:'characterSelect'});
	}

	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');
        this.load.spritesheet('rogue', 'assets/sprites/rogue/rogue.png', {frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('heavy', 'assets/sprites/heavy/heavy.png', {frameWidth: 100, frameHeight: 100 });
	}

	create() {
        this.input.setDefaultCursor("default");
	    var bg = this.add.sprite(0,0,'sky');
        bg.setOrigin(0,0);

        var text = this.add.text(170,250, 'Choose Your Character', {font: '36px'});

        var rogue = this.add.sprite(200, 400, 'rogue', 4).setInteractive({ useHandCursor: true });

        var heavy = this.add.sprite(580, 400, 'heavy', 4).setInteractive({ useHandCursor: true });

        // group all characters
        var charsGroup = this.add.group([rogue, heavy])

        rogue.on("pointerdown", function() {
            clear_choice.setVisible(true);
            charsGroup.setVisible(false);
            rogue.setVisible(true);
            press_enter_heavy.setVisible(false);
			press_enter_rogue.setVisible(true);
            press_enter_rogue.setInteractive({ useHandCursor: true });
            clear_choice.setInteractive({ useHandCursor: true });
        });

        var press_enter_rogue = this.add.text(300, 500, "Press-Enter").setVisible(false);
        
        press_enter_rogue.on('pointerdown', () => {
            this.scene.start("gameScene", {character: "rogue"});
        });

        heavy.on("pointerdown", function() {
            clear_choice.setVisible(true);
            charsGroup.setVisible(false);
            heavy.setVisible(true);
            press_enter_rogue.setVisible(false);
			press_enter_heavy.setVisible(true);
            press_enter_heavy.setInteractive({ useHandCursor: true });
            clear_choice.setInteractive({ useHandCursor: true });
        });

        var press_enter_heavy = this.add.text(300, 500, "Press-Enter").setVisible(false);
        
        press_enter_heavy.on('pointerdown', () => {
            this.scene.start("gameScene", {character: "heavy"});
        });

        var enterGroup = this.add.group([press_enter_rogue, press_enter_heavy])

        var clear_choice = this.add.text(500, 500, "clear choice").setVisible(false);
        
        clear_choice.on('pointerdown', () => {
            charsGroup.setVisible(true);
            enterGroup.setVisible(false);
            clear_choice.setVisible(false);
        });
	}

    

}

export default CharacterSelect;