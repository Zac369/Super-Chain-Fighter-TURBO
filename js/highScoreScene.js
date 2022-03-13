import { connect } from "@textile/tableland";
import { ethers } from 'ethers';
import game from '../Game.json';

class HighScoreScene extends Phaser.Scene {

	constructor() {
		super({key:'highScoreScene'});

	}


	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');
        this.load.spritesheet('rogue', 'https://ipfs.infura.io/ipfs/QmdG2hytvmwLrk3dpqU4uEKDJHkCJDgtbZSmGSRGX2jx2D', {frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('heavy', 'https://ipfs.infura.io/ipfs/Qmf3Qas8LDQZAGdkJNudLZHoVG89WaggTwZ4Jay4Lj36WA', {frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('ryu', 'https://ipfs.infura.io/ipfs/QmWLbdKtQ4tHRSJPmJ271dgN5UMmz1PFbrALKnNkL8UXwp', {frameWidth: 100, frameHeight: 100 });

        const CONTRACT_ADDRESS = '0xbfFDB2158064aD6E37eB87A9B2efb7dcC64CA4B7';
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        this.gameContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            game.abi,
            signer
        );

        this.connectToDB = async () => {
            this.tbl = await connect({ network: "testnet" });
            this.tableName = "placeholder";
            
            const tables = await this.tbl.list();
            for (let i = 0; i < tables.length; i++) {
                if (tables[i].name.startsWith("chaingame")) {
                    this.tableName = tables[i].name;
                    console.log(this.tableName);
                }
            }

            if (this.tableName == "placeholder") {
                const createRes = await this.tbl.create(
                    `CREATE TABLE chaingame (id int, name text, description text, image text, attack int, hp int, speed int, jump int, wins int, attackLevel int, defenseLevel int, speedLevel int, jumpLevel int, currentPoints int, primary key (id));`
                );
                this.tableName = createRes.name;
            }
            getNFTIDs();
        };

        this.connectToDB();

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
        };

        // nft/tableland functions

        const NFTIDs = [];
        this.NFTs = [];
        
        const getNFTIDs = async () => {
            try {
                if (this.gameContract) {
                    console.log('Getting NFTs...');
                    const mintTxn = await this.gameContract.getUsersNFTs();
                    console.log('mintTxn:', mintTxn);

                    const numNFTs = mintTxn.length;

                    if(numNFTs == 0) {
                        return;
                    }

                    for (let i =0; i < mintTxn.length; i++) {
                        NFTIDs[i] = mintTxn[i].toNumber();
                        console.log(NFTIDs[i]);
                    }
                    queryTable();

                }
            } catch (error) {
                console.warn('getNFTIDs Error:', error);
            }

        };

        const queryTable = async () => {
            for (let i = 0; i < NFTIDs.length; i++) {
                const id = NFTIDs[i];
                const { data: { rows, columns }} = await this.tbl.query(`SELECT * FROM ${this.tableName} where id = ${id};`);

                for (const [rowId, row] of Object.entries(rows)) {
                    this.NFTs[i] = row;
                    const image = this.NFTs[i][3];
                    const imageNum = 'charImage' + i;
                    this.load.spritesheet(imageNum, image, {frameWidth: 100, frameHeight: 100 });
                }
            }
            this.displayCharacters();
        };

	};


	create() {
		this.displayCharacters = async () => {
            this.NFTs.sort(function(a, b) {
				return b[8] - a[8];
			});

			if (this.NFTs.length > 5) {
				this.NFTs = this.NFTs.slice(0, 5);
			}

			for (let i = 0; i < this.NFTs.length; i++) {
				this.add.text(320, 150 + i*80, this.NFTs[i][1] + ' Wins: ' + this.NFTs[i][8], {font: '20px'});
			}
        }

		var bg = this.add.sprite(0, 0, 'sky');
		bg.setOrigin(0,0);

		this.add.text(300, 50, 'High scores!', {font: '32px'});

		var back = this.add.text(50, 550, '<-- Back');

		back.setInteractive({ useHandCursor: true });
        back.on('pointerdown', () => this.clickBack());

	};

	clickBack() {
    	this.scene.start('titleScene');
    };


};

export default HighScoreScene;