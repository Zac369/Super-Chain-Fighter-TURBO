import { ethers } from 'ethers';
import game from '../Game.json'

class GameOver extends Phaser.Scene {

    constructor() {
		super({key : 'gameOver'});
	}

    init(data) {
        this.data = data.character;
        this.tbl = data.tbl;
        this.selectedCharacter = data.character[1];
        this.id = data.character[0];
        data.character[8] = data.character[8] + 1;
        this.wins = data.character[8];
        data.character[13] = data.character[13] + 1;
        this.currentPoints = data.character[13];
        this.tableName = 'chaingame_469'
        console.log(this.selectedCharacter);
        console.log(this.wins);
    }

    preload() {
        this.load.image('sky', 'assets/skies/sky1.png');

        this.updateDB = async () => {
            await this.tbl.query(`UPDATE ${this.tableName} SET wins = ${this.wins}, currentpoints = ${this.currentPoints} WHERE id = ${this.id};`);
        }

        const CONTRACT_ADDRESS = '0xbfFDB2158064aD6E37eB87A9B2efb7dcC64CA4B7';
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        this.gameContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            game.abi,
            signer
        );

        this.getCharacters = (characterIndex) => {
            if (characterIndex == 0) {
                // zero represents row, change during mint
                // row, name, image, attack, defense, speed, jump, wins, attackLevel, defenseLevel, speedLevel, jumpLevel, currentPoints
                return [0, "rogue", "Description for Rogue", "ipfs://QmNghJegenUfrEnzjHvR9eRh1rqNg3JV9atfYuvL1LmSvd", 20, 100, 10, 10, 0, 1, 1, 1, 1, 0];
            } else if (characterIndex == 1) {
                return [0, "heavy", "Description for Heavy", "ipfs://Qmf3Qas8LDQZAGdkJNudLZHoVG89WaggTwZ4Jay4Lj36WA", 10, 300, 8, 6, 0, 1, 1, 1, 1, 0];
            } else if (characterIndex == 2) {
                return [0, "ryu", "Description for Ryu", "ipfs://QmWLbdKtQ4tHRSJPmJ271dgN5UMmz1PFbrALKnNkL8UXwp", 15, 200, 9, 8, 0, 1, 1, 1, 1, 0];
            }
        }
    }

    async create() {
        const mintCharacterNFTAction = async (characterIndex) => {
            try {
                if (this.gameContract) {
                    console.log('Minting character in progress...');
                    const mintTxn = await this.gameContract.mintCharacterNFT(characterIndex);
                    await mintTxn.wait();
                    console.log('mintTxn:', mintTxn);
                    insertTable(characterIndex);
                    const character = this.getCharacters(characterIndex);
                    character[0] = this.NFTs.length;
                    this.scene.start("gameScene", {character: character, tbl: this.tbl});
                }
            } catch (error) {
                console.warn('MintCharacterAction Error:', error);
            }
        };

        const insertTable = async (characterIndex) => {
            const character = this.getCharacters(characterIndex);

            const name = character[1];
            const description = character[2];
            const image = character[3];
            const attack = character[4];
            const hp = character[5];
            const speed = character[6];
            const jump = character[7];
            const wins = character[8];

            let tokenCounter = await this.gameContract.getCounter();
            tokenCounter = tokenCounter.toNumber() - 1;
            console.log(tokenCounter);

            const insertRes = await this.tbl.query(`INSERT INTO ${this.tableName} (id, name, description, image, attack, hp, speed, jump, wins, attackLevel, defenseLevel, speedLevel, jumpLevel, currentPoints) VALUES (${tokenCounter}, '${name}', '${description}', '${image}', ${attack}, ${hp}, ${speed}, ${jump}, ${wins}, 1, 1, 1, 1, 0);`);
        }

        var bg = this.add.sprite(0,0,'sky');
		bg.setOrigin(0,0);

        this.gameOverText = this.add.text(345, 250, "GAME OVER");
        this.youWonText = this.add.text(350, 300, "YOU WON!");

        this.updateDB();
        this.youWonText = this.add.text(350, 350, "Total Wins: " + this.wins);

        var reset = this.add.text( 50, 550, '<-- Reset');

        var secret = this.add.text(50, 450, "25 wins for a secret character!");

        var ryu = this.add.text(50, 500, "Mint RYU").setVisible(false);
        ryu.setInteractive({ useHandCursor: true });

        if (this.wins >= 25) {
            ryu.setVisible(true);
            ryu.on('pointerdown', () => mintCharacterNFTAction(2));
        }

		reset.setInteractive({ useHandCursor: true });
        reset.on('pointerdown', () => this.clickReset());

        var upgrade = this.add.text( 650, 550, 'Upgrade -->');
		upgrade.setInteractive({ useHandCursor: true });
        upgrade.on('pointerdown', () => this.clickUpgrade());
    }

    clickReset() {
    	this.scene.start('titleScene');
    }

    clickUpgrade() {
        this.scene.start('upgradeScene', {character: this.data, tbl: this.tbl});
    }
}

export default GameOver;