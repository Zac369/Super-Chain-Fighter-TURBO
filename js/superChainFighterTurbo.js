const serverUrl = "https://6thwxfwcdmhf.usemoralis.com:2053/server";
const appId = "vs0g4jMVvYwMO27KJ7G0XB2czwTK8JetVwtdB5Vv";
Moralis.start({ serverUrl, appId });

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
		update: update
	}
};

var game;

(function launch(){
	let user = Moralis.User.current();
	if (!user) {
		console.log("PLEASE LOG IN WITH METAMASK!");
	} else {
		console.log(user.get("ethAddress") + " " + "logged in");
		game = new Phaser.Game(config);
	}
})()

function preload ()
{

	this.load.image('sky', 'assets/skies/sky1.png');
	this.load.image('ground','assets/platforms/ground.png');
	this.load.spritesheet('rogue', 'assets/sprites/rogue/rogue.png', {frameWidth: 100, frameHeight: 100 });

}

function create ()
{
	this.add.image(400, 300, 'sky');

	platforms = this.physics.add.staticGroup();

	platforms.create(400, 570, 'ground').setScale(2).refreshBody();

	player = this.physics.add.sprite(80, 450, 'rogue');

	player.setBounce(0.2);
	player.setCollideWorldBounds(true);

	player.body.setGravityY(300);

	this.physics.add.collider(player, platforms);

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
		frames: this.anims.generateFrameNumbers( 'rogue', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});

	cursors = this.input.keyboard.createCursorKeys();




}

function update ()
{
	if (cursors.left.isDown)
	{
		player.setVelocityX(-160);

		player.anims.play('left', true);
	} else if (cursors.right.isDown)
	{
		player.setVelocityX(160);

		player.anims.play('right', true);
	} else
	{
		player.setVelocityX(0);

		player.anims.play('turn');
	}

	if (cursors.up.isDown && player.body.touching.down)
	{
		player.setVelocityY(-330);
	}
}