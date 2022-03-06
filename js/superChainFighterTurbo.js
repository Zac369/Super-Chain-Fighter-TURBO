//import PhaserHealth from 'phaser-component-health';

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
	scene: {
		preload: preload,
		create: create,
		update: update,
		render: render
	}
};

var game = new Phaser.Game(config);

function preload ()
{

	this.load.image('sky', 'assets/skies/sky1.png');
	this.load.image('ground','assets/platforms/ground.png');
	this.load.spritesheet('rogue', 'assets/sprites/rogue/rogue.png', {frameWidth: 100, frameHeight: 100 });
	this.load.spritesheet('heavy', 'assets/sprites/heavy/heavy.png', {frameWidth: 100, frameHeight: 100 });
}

function render() {
	//this.debug.body(playerOne);
	//this.debug.body(playerTwo);
}

let hp = 200;




function create ()
{
	this.add.image(400, 300, 'sky');

	this.add.text(10, 10, "health");

	this.add.rectangle(200, 18, 200, 20, "0xf54242");


	platforms = this.physics.add.staticGroup();

	platforms.create(400, 570, 'ground').setScale(2).refreshBody();

	playerOne = this.physics.add.sprite(80, 450, 'rogue');

	playerTwo = this.physics.add.sprite(450, 450, 'heavy');


	playerTwo.setCollideWorldBounds(true);
	playerOne.setBounce(0.2);
	playerOne.setCollideWorldBounds(true);

	playerTwo.body.setGravityY(330);
	playerOne.body.setGravityY(300);
	playerTwo.body.setMaxVelocityX(0);
	//playerTwo.phyonCollide(true);

	playerOne.body.setSize(40, 100);
	playerTwo.body.setSize(40, 100);


	this.physics.add.collider(playerTwo, platforms);
	this.physics.add.collider(playerOne, platforms);
	this.physics.add.collider(playerOne, playerTwo, function (playerOne, playerTwo) {
		playerTwo.damage(0.1);

	});

	PhaserHealth.AddTo(playerTwo, 2, 0, 2);

	playerTwo.on('die', function (spr) {
		spr.setActive(false).setVisible(false);
	});

	

	this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('rogue', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});


	this.anims.create({
		key: 'turn',
		frames: [ { key: 'rogue', frame: 4 } ],
		frameRate: 20
	});


	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('rogue', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({	
		key: 'punch',
		frames: this.anims.generateFrameNumbers('rogue', { start: 5, end: 7 }),
		frameRate: 20
	});

	cursors = this.input.keyboard.createCursorKeys();
	punchInput = this.input.keyboard.addKey("D");




}

function update ()
{
	if (cursors.left.isDown)
	{
		playerOne.setVelocityX(-160);

		playerOne.anims.play('left', true);

	} else if (cursors.right.isDown)
	{
		playerOne.setVelocityX(160);

		playerOne.anims.play('right', true);
	} else if (punchInput.isDown)
	{
		playerOne.anims.play('punch', true);
		reduceHealth(0.25);
	} else
	{
		playerOne.setVelocityX(0);

		playerOne.anims.play('turn');
	}

	if (cursors.up.isDown && playerOne.body.touching.down)
	{
		playerOne.setVelocityY(-300);
	}
}

function reduceHealth(number) {
	this.hp = hp - number;

}