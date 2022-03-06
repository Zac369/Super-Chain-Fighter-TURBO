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
        this.add.image(400, 300, 'sky');

        var platforms = this.physics.add.staticGroup();

        platforms.create(400, 570, 'ground').setScale(2).refreshBody();

        this.player = this.physics.add.sprite(80, 450, this.selectedCharacter);

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.player.body.setGravityY(300);

        this.physics.add.collider(this.player, platforms);

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

        this.cursors = this.input.keyboard.createCursorKeys();
    };

    update () {
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        } else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    };
}

export default GameScene;