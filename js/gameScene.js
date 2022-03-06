class GameScene extends Phaser.Scene {

    constructor() {
		super({key : 'gameScene'});
	}

    init(data) {
        this.selectedCharacter = data.character;
    }

    preload () {
        this.load.image('sky', 'assets/skies/sky1.png');
        this.load.image('ground','assets/platforms/ground.png');
        this.load.spritesheet(`${this.selectedCharacter}`, `assets/sprites/${this.selectedCharacter}/${this.selectedCharacter}.png`, {frameWidth: 100, frameHeight: 100 });
    };

    create () {
        this.hp = 200;

        this.add.image(400, 300, 'sky');

        this.add.text(10, 10, "health");

        //the health bar is drawn here
        //it's static and doesn't change
        //there is an event described in phaser-component-health (github) called 'healthchange'
        //that can be used to make the health bar dynamic
        this.add.rectangle(200, 18, 200, 20, "0xf54242");

        var platforms = this.physics.add.staticGroup();

        platforms.create(400, 570, 'ground').setScale(2).refreshBody();

        this.player1 = this.physics.add.sprite(80, 450, this.selectedCharacter);

        this.player2 = this.physics.add.sprite(450, 450, 'heavy');

        this.player1.setBounce(0.2);
        this.player1.setCollideWorldBounds(true);
        this.player2.setCollideWorldBounds(true);

        this.player1.body.setGravityY(300);
        this.player2.body.setGravityY(300);
        this.player2.body.setMaxVelocityX(0);

        /**
         * This is the initial set up for the "hit boxes"
         * Right now the hit box is the size of the entire character
         * This should be updated in order to acheive the "Joust" style gameplay
         * This is where we should add the hit boxes for the fist or foot for attacks
         * 
         * **/
        this.player1.body.setSize(40, 100);
        this.player2.body.setSize(40, 100);

        this.physics.add.collider(this.player1, platforms);
        this.physics.add.collider(this.player2, platforms);

        /**
         * allows characters to collide with each other
         * the function describes what event should occur upon collision
         * 
         * TO DO: punch/kick animation, punch/kick hit boxes, punch/kick damage, punch/kick hit box colliders
         * 
         * this is where you will put how much damage P1 can do to P2
         * this should be dynamically expressed by the NFT character loaded
         * 
         * right now P1 kills P2 after colliding with him enough times because no punch/kick parts have been finished
         * **/
        this.physics.add.collider(this.player1, this.player2, function (playerOne, playerTwo) {
            playerTwo.damage(0.1);

        });

            //enemy health described here (starting health, min health, max health);
        //one can be added for P1 easily and both P1 and P2 should be dynamic with the NFT
        PhaserHealth.AddTo(this.player2, 2, 0, 2);

        //describes what to do when the die command is executed
        //can be changed to add a die animation
        this.player2.on('die', function (spr) {
            spr.setActive(false).setVisible(false);
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(this.selectedCharacter, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: this.selectedCharacter, frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(this.selectedCharacter, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //this is the punch animation but I haven't drawn any hit sprites yet
        //right now it's the same as a walk to the right
        this.anims.create({	
            key: 'punch',
            frames: this.anims.generateFrameNumbers(this.selectedCharacter, { start: 5, end: 7 }),
            frameRate: 20
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        //the button for a punch is currently D, but can be changed
	    this.punchInput = this.input.keyboard.addKey("D");
    };

    update () {
        if (this.cursors.left.isDown)
        {
            this.player1.setVelocityX(-160);

            this.player1.anims.play('left', true);
        } else if (this.cursors.right.isDown)
        {
            this.player1.setVelocityX(160);

            this.player1.anims.play('right', true);
        } else if (this.punchInput.isDown) {
            this.player1.anims.play('punch', true);
        } else
        {
            this.player1.setVelocityX(0);

            this.player1.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player1.body.touching.down)
        {
            this.player1.setVelocityY(-330);
        }
    };
}

export default GameScene;