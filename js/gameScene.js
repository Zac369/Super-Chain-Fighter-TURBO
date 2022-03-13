class GameScene extends Phaser.Scene {

    constructor() {
		super({key : 'gameScene'});
	}

    init(data) {
        this.data = data.character;
        this.tbl = data.tbl;
        this.selectedCharacter = data.character[1];
        console.log(this.selectedCharacter);
    }

    preload () {
        this.load.image('sky', 'assets/skies/sky1.png');
        this.load.image('ground','assets/platforms/ground.png');
        this.load.spritesheet('rogue', 'https://ipfs.infura.io/ipfs/QmdG2hytvmwLrk3dpqU4uEKDJHkCJDgtbZSmGSRGX2jx2D', {frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('heavy', 'https://ipfs.infura.io/ipfs/Qmf3Qas8LDQZAGdkJNudLZHoVG89WaggTwZ4Jay4Lj36WA', {frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('ryu', 'https://ipfs.infura.io/ipfs/QmWLbdKtQ4tHRSJPmJ271dgN5UMmz1PFbrALKnNkL8UXwp', {frameWidth: 100, frameHeight: 100 });
    };

    create () {
        this.hp = 200;

        this.add.image(400, 300, 'sky');

        this.add.text(10, 10, "Player 1");
        this.add.text(10, 30, "Health");

        this.deadBool = false;

        //the health bar is drawn here
        //it's static and doesn't change
        //there is an event described in phaser-component-health (github) called 'healthchange'
        //that can be used to make the health bar dynamic
        this.add.rectangle(200, 18, 200, 20, "0xf54242");

        var platforms = this.physics.add.staticGroup();

        platforms.create(400, 570, 'ground').setScale(2).refreshBody();

        // the 'rendered' box of the hitbox
        //var box = this.add.rectangle(30, 130, 30, 30, "0xf54242");

        // the hitbox sprite. it can hold the collider
        this.hitBox = this.physics.add.sprite(100, 450, 'box');
        this.hitBox.setVisible(false);


        //the player instances
        this.player1 = this.physics.add.sprite(80, 450, this.selectedCharacter);
        this.player2 = this.physics.add.sprite(450, 450, 'heavy');


        this.hitBox.setX(this.player1.x);
        this.hitBox.setY(this.player1.y - 20);


        this.player1.setBounce(0.2);
        this.player1.setCollideWorldBounds(true);
        this.player2.setCollideWorldBounds(true);
        this.hitBox.setCollideWorldBounds(true);

        this.player1.body.setGravityY(300);
        this.player2.body.setGravityY(300);
        this.hitBox.body.setGravityY(0, -20);
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
        this.physics.add.collider(this.hitBox, platforms);

        /**
         * allows characters to collide with each other
         * the function describes what event should occur upon collision
         * 
         * this is where you will put how much damage P1 can do to P2
         * this should be dynamically expressed by the NFT character loaded
         * 
         * **/


        var touchCollider = this.physics.add.collider(this.player1, this.player2);
        var boxTouchCollider = this.physics.add.collider(this.hitBox, this.player2);

        this.hitCollider = this.physics.add.collider(this.hitBox, this.player2, function (playerOne, playerTwo) {
            playerTwo.damage(0.1);

        }, null, this);

        this.hitCollider.active = false;


            //enemy health described here (starting health, min health, max health);
        //one can be added for P1 easily and both P1 and P2 should be dynamic with the NFT
        PhaserHealth.AddTo(this.player2, 2, 0, 2);

        //describes what to do when the die command is executed
        //can be changed to add a die animation
        this.player2.on('die', function (spr) {
            spr.setActive(false).setVisible(false);
            touchCollider.active = false;

        });


        if (this.selectedCharacter == 'rogue' || this.selectedCharacter == 'heavy') {
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
        }

        if (this.selectedCharacter == 'rogue') {
            this.anims.create({	
                key: 'punch',
                frames: this.anims.generateFrameNumbers('rogue', { start: 9, end: 11 }),
                frameRate: 20
            });
        }

        if (this.selectedCharacter == 'heavy') {
            this.anims.create({
                key: 'punch',
                frames: this.anims.generateFrameNumbers(this.selectedCharacter, { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (this.selectedCharacter == 'ryu') {
            // ryu animations
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('ryu', { start: 0, end: 4 }),
                frameRate: 12,
                repeat: -1
            });

            this.anims.create({ 
                key: 'turn',
                frames: this.anims.generateFrameNumbers('ryu', { start: 11, end: 14 }),
                frameRate: 12
            });

            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('ryu', { start: 5, end: 9 }),
                frameRate: 12,
                repeat: -1
            });

            this.anims.create({
                key: 'punch',
                frames: this.anims.generateFrameNumbers('ryu', { start: 15, end: 19 }),
                frameRate: 12,
                repeat: -1
            })
        }

        this.cursors = this.input.keyboard.createCursorKeys();

        //the button for a punch is currently D, but can be changed
	    this.punchInput = this.input.keyboard.addKey("D");
    };


    update () {
        if (this.cursors.left.isDown)
        {
            this.player1.setVelocityX(-160);
            this.hitBox.setVelocityX(-160);
            this.hitBox.setY(this.player1.y - 20);

            this.player1.anims.play('left', true);
        } else if (this.cursors.right.isDown)
        {
            this.player1.setVelocityX(160);
            this.hitBox.setVelocityX(160);
            this.hitBox.setY(this.player1.y - 20);

            this.player1.anims.play('right', true);
        } else if (this.punchInput.isDown && !this.player2.isDead()) {
            this.player1.anims.play('punch', true);
            setTimeout(() => {
                this.hitCollider.active = true;
                this.hitBox.body.setOffset(30, 0);
            }, 5);
            setTimeout(() => {
                this.hitCollider.active = false;
                this.hitBox.body.setOffset(-30, 0);
            }, 100);
        } else
        {
            this.player1.setVelocityX(0);
            this.hitBox.setVelocityX(0);

            this.player1.anims.play('turn');

            this.hitCollider.active = false;
            this.hitBox.setY(this.player1.y - 20);

        }

        if (this.cursors.up.isDown && this.player1.body.touching.down)
        {
            this.player1.setVelocityY(-330);
            this.hitBox.setVelocityY(-30);
        }

        if (this.player2.isDead()) {
            console.log("found he's dead");
            this.gameOver();
        }
    };

    gameOver() {
        this.scene.start('gameOver', {character: this.data, tbl: this.tbl});
    }

    
}

export default GameScene;