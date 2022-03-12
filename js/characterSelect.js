import { ethers } from 'ethers';
import game from '../Game.json'
import { connect } from "@textile/tableland";

class CharacterSelect extends Phaser.Scene {

	constructor() {
		super({key:'characterSelect'});
	}

	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');
        this.load.spritesheet('rogue', 'https://ipfs.infura.io/ipfs/QmdG2hytvmwLrk3dpqU4uEKDJHkCJDgtbZSmGSRGX2jx2D', {frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('heavy', 'https://ipfs.infura.io/ipfs/Qmf3Qas8LDQZAGdkJNudLZHoVG89WaggTwZ4Jay4Lj36WA', {frameWidth: 100, frameHeight: 100 });

        const CONTRACT_ADDRESS = '0xBe326839068012aaDCDFD8acEBA411dE7C31398E';
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
                if (tables[i].name.startsWith("scftgame")) {
                    this.tableName = tables[i].name;
                    console.log(this.tableName);
                }
            }

            if (this.tableName == "placeholder") {
                const createRes = await this.tbl.create(
                    `CREATE TABLE scftgame (id int, name text, description text, image text, attack int, hp int, speed int, jump int, wins int, primary key (id));`
                );
                this.tableName = createRes.name;
            }
            getNFTIDs();
        } 

        this.connectToDB();

        this.getCharacters = (characterIndex) => {
            if (characterIndex == 0) {
                // zero represents row, change during mint
                return [0, "rogue", "Description for Rogue", "ipfs://QmNghJegenUfrEnzjHvR9eRh1rqNg3JV9atfYuvL1LmSvd", 100, 20, 10, 10, 0];
            } else if (characterIndex == 1) {
                return [0, "heavy", "Description for Heavy", "ipfs://Qmf3Qas8LDQZAGdkJNudLZHoVG89WaggTwZ4Jay4Lj36WA", 300, 10, 8, 6, 0];
            }
        }

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

        }

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
        }
        
	}

	create() {
        this.displayCharacters = async () => {
            for (let i = 0; i < this.NFTs.length; i++) {
                const name = this.NFTs[i][1];
                const hp = this.NFTs[i][4];
                const attack = this.NFTs[i][5];
                const speed = this.NFTs[i][6];
                const jump = this.NFTs[i][7];

                this.add.text(150*i + 30, 430, name, {font: '18px'});
                this.add.text(150*i + 30, 460, 'Att: ' + attack, {font: '18px'});
                this.add.text(150*i + 30, 490, 'Def: ' + hp, {font: '18px'});
                this.add.text(150*i + 30, 520, 'Spd: ' + speed, {font: '18px'});
                this.add.text(150*i + 30, 550, 'Jmp: ' + jump, {font: '18px'});

                var charImage = this.add.sprite(150*i + 60, 350, name, 4).setInteractive({ useHandCursor: true });
                charImage.on('pointerdown', () => {
                    this.scene.start("gameScene", {character: this.NFTs[i], tbl: this.tbl});
                });
            }
        }

        // Actions
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

            const insertRes = await this.tbl.query(`INSERT INTO ${this.tableName} (id, name, description, image, attack, hp, speed, jump, wins) VALUES (${tokenCounter}, '${name}', '${description}', '${image}', ${attack}, ${hp}, ${speed}, ${jump}, ${wins});`);
        }
        

        this.input.setDefaultCursor("default");
	    var bg = this.add.sprite(0,0,'sky');
        bg.setOrigin(0,0);

        this.add.text(170, 20, 'Mint Your Character', {font: '36px'});

        var rogue = this.add.sprite(200, 120, 'rogue', 4).setInteractive({ useHandCursor: true });

        var heavy = this.add.sprite(580, 120, 'heavy', 4).setInteractive({ useHandCursor: true });

        this.add.text(280, 250, 'You own', {font: '36px'});

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

        var press_enter_rogue = this.add.text(300, 200, "Press-Enter").setVisible(false);
        
        press_enter_rogue.on('pointerdown', () => {
            mintCharacterNFTAction(0);
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

        var press_enter_heavy = this.add.text(300, 200, "Press-Enter").setVisible(false);
        
        press_enter_heavy.on('pointerdown', () => {
            mintCharacterNFTAction(1);
        });

        var enterGroup = this.add.group([press_enter_rogue, press_enter_heavy])

        var clear_choice = this.add.text(500, 200, "clear choice").setVisible(false);
        
        clear_choice.on('pointerdown', () => {
            charsGroup.setVisible(true);
            enterGroup.setVisible(false);
            clear_choice.setVisible(false);
        });
	}

}

export default CharacterSelect;