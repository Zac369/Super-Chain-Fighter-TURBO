class UpgradeScene extends Phaser.Scene {

	constructor() {
		super({key:'upgradeScene'});

	};

	init(data) {
        this.data = data.character;
        this.tbl = data.tbl;
        this.selectedCharacter = data.character[1];
        this.id = data.character[0];
		this.currentPoints = data.character[13];
		this.tableName = 'chaingame_469'
        console.log(this.selectedCharacter);
    };


	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');
		this.load.spritesheet('rogue', 'https://ipfs.infura.io/ipfs/QmdG2hytvmwLrk3dpqU4uEKDJHkCJDgtbZSmGSRGX2jx2D', {frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('heavy', 'https://ipfs.infura.io/ipfs/Qmf3Qas8LDQZAGdkJNudLZHoVG89WaggTwZ4Jay4Lj36WA', {frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('ryu', 'https://ipfs.infura.io/ipfs/QmWLbdKtQ4tHRSJPmJ271dgN5UMmz1PFbrALKnNkL8UXwp', {frameWidth: 100, frameHeight: 100 });
	};


	async create() {
		var bg = this.add.sprite(0,0,'sky');
		bg.setOrigin(0,0);

		this.add.text(320, 50, 'Upgrades!', {font: '32px'});

		this.add.text(480, 550, '1 Win = 1 Upgrade point', {font: '20px'});

		var currentPointsText = this.add.text(480, 510, 'Current Points: ' + this.currentPoints, {font: '20px'});

		var back = this.add.text(50, 550, '<-- Back');

		back.setInteractive({ useHandCursor: true });
        back.on('pointerdown', () => this.clickBack());

		this.player1 = this.add.sprite(385, 150, this.selectedCharacter, 4);

		this.add.text(50, 300, 'Attack: ');
		this.add.text(50, 350, 'Defense: ');
		this.add.text(50, 400, 'Speed: ');
		this.add.text(50, 450, 'Jump: ');

		var attNum = this.add.text(200, 300, Math.round(this.data[4] * 1.3 ** this.data[9]));
		var defNum = this.add.text(200, 350, Math.round(this.data[5] * 1.3 ** this.data[10]));
		var spdNum = this.add.text(200, 400, Math.round(this.data[6] * 1.3 ** this.data[11]));
		var jmpNum = this.add.text(200, 450, Math.round(this.data[7] * 1.3 ** this.data[12]));

		this.add.text(300, 300, 'Upgrade Cost:', {font: '20px'});
		this.add.text(300, 350, 'Upgrade Cost:', {font: '20px'});
		this.add.text(300, 400, 'Upgrade Cost:', {font: '20px'});
		this.add.text(300, 450, 'Upgrade Cost:', {font: '20px'});

		var attackText = this.add.text(500, 300, this.data[9] + ' Points');
		var defenseText = this.add.text(500, 350, this.data[10] + ' Points');
		var speedText = this.add.text(500, 400, this.data[11] + ' Points');
		var jumpText = this.add.text(500, 450, this.data[12] + ' Points');

		var attackBuy = this.add.text(650, 300, 'BUY', {font: '24px'}).setInteractive({ useHandCursor: true });
		var defenseBuy = this.add.text(650, 350, 'BUY', {font: '24px'}).setInteractive({ useHandCursor: true });
		var speedBuy = this.add.text(650, 400, 'BUY', {font: '24px'}).setInteractive({ useHandCursor: true });
		var jumpBuy = this.add.text(650, 450, 'BUY', {font: '24px'}).setInteractive({ useHandCursor: true });

		attackBuy.on('pointerdown', async (a) => {
			await this.tbl.query(`UPDATE ${this.tableName} SET currentpoints = ${this.currentPoints - this.data[9]}, attacklevel = ${this.data[9] + 1} WHERE id = ${this.id};`);
			this.currentPoints -= this.data[9];
			this.data[9]++;
			attackText.setText(this.data[9] + ' Points');
			currentPointsText.setText('Current Points: ' + this.currentPoints);
			attNum.setText(Math.round(this.data[4] * 1.3 ** this.data[9]));
		});

		defenseBuy.on('pointerdown', async (a) => {
			await this.tbl.query(`UPDATE ${this.tableName} SET currentpoints = ${this.currentPoints - this.data[10]}, defenselevel = ${this.data[10] + 1} WHERE id = ${this.id};`);
			this.currentPoints -= this.data[10];
			this.data[10]++;
			defenseText.setText(this.data[10] + ' Points');
			currentPointsText.setText('Current Points: ' + this.currentPoints);
			defNum.setText(Math.round(this.data[5] * 1.3 ** this.data[10]));
		});

		speedBuy.on('pointerdown', async (a) => {
			await this.tbl.query(`UPDATE ${this.tableName} SET currentpoints = ${this.currentPoints - this.data[11]}, speedlevel = ${this.data[11] + 1} WHERE id = ${this.id};`);
			this.currentPoints -= this.data[11];
			this.data[11]++;
			speedText.setText(this.data[11] + ' Points');
			currentPointsText.setText('Current Points: ' + this.currentPoints);
			spdNum.setText(Math.round(this.data[6] * 1.3 ** this.data[11]));
		});

		jumpBuy.on('pointerdown', async (a) => {
			await this.tbl.query(`UPDATE ${this.tableName} SET currentpoints = ${this.currentPoints - this.data[12]}, jumplevel = ${this.data[12] + 1} WHERE id = ${this.id};`);
			this.currentPoints -= this.data[12];
			this.data[12]++;
			jumpText.setText(this.data[12] + ' Points');
			currentPointsText.setText('Current Points: ' + this.currentPoints);
			jmpNum.setText(Math.round(this.data[7] * 1.3 ** this.data[1]));
		});
	};

	

	clickBack() {
    	this.scene.start('titleScene');
    };


};

export default UpgradeScene;