
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
	this.load.spritesheet('heavy', 'assets/sprites/heavy/heavy.png', {frameWidth: 100, frameHeight: 100 });
}


let hp = 200;




function create ()
{
	this.add.image(400, 300, 'sky');

	this.add.text(10, 10, "health");


	//the health bar is drawn here
	//it's static and doesn't change
	//there is an event described in phaser-component-health (github) called 'healthchange'
	//that can be used to make the health bar dynamic
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

	/**
	 * This is the initial set up for the "hit boxes"
	 * Right now the hit box is the size of the entire character
	 * This should be updated in order to acheive the "Joust" style gameplay
	 * This is where we should add the hit boxes for the fist or foot for attacks
	 * 
	 * **/
	playerOne.body.setSize(40, 100);
	playerTwo.body.setSize(40, 100);


	//allows characters to collide with the ground
	this.physics.add.collider(playerTwo, platforms);
	this.physics.add.collider(playerOne, platforms);

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
	this.physics.add.collider(playerOne, playerTwo, function (playerOne, playerTwo) {
		playerTwo.damage(0.1);

	});

	//enemy health described here (starting health, min health, max health);
	//one can be added for P1 easily and both P1 and P2 should be dynamic with the NFT
	PhaserHealth.AddTo(playerTwo, 2, 0, 2);

	//describes what to do when the die command is executed
	//can be changed to add a die animation
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

	//this is the punch animation but I haven't drawn any hit sprites yet
	//right now it's the same as a walk to the right
	this.anims.create({	
		key: 'punch',
		frames: this.anims.generateFrameNumbers('rogue', { start: 5, end: 7 }),
		frameRate: 20
	});

	cursors = this.input.keyboard.createCursorKeys();

	//the button for a punch is currently D, but can be changed
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
		//this is where you will update what animation is played for the punch
		playerOne.anims.play('punch', true);
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
