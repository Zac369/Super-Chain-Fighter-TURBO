import { ethers } from 'ethers';
import game from '../Game.json'
import { connect } from "@textile/tableland";

class CharacterSelect extends Phaser.Scene {

	constructor() {
		super({key:'characterSelect'});
	}

	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');
        this.load.spritesheet('rogue', 'assets/sprites/rogue/rogue.png', {frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('heavy', 'assets/sprites/heavy/heavy.png', {frameWidth: 100, frameHeight: 100 });

        const CONTRACT_ADDRESS = '0xA8e9A33dfDe40b28c690612390fDA9ee5045AEF6';
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        this.gameContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            game.abi,
            signer
        );

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
                    }
                    queryTable();

                }
            } catch (error) {
                console.warn('getNFTIDs Error:', error);
            }

        }

        const queryTable = async () => {
            const tbl = await connect({ network: "testnet" });
        
            const queryableName  = 'mytable_309';
            console.log(queryableName);
            
            for (let i = 0; i < NFTIDs.length; i++) {
                const id = NFTIDs[i];
                const { data: { rows, columns }} = await tbl.query(`SELECT * FROM ${queryableName } where id = ${id};`);

                for (const [rowId, row] of Object.entries(rows)) {
                    this.NFTs[i] = row;
                    const image = this.NFTs[i][3];
                    const imageNum = 'charImage' + i;
                    this.load.spritesheet(imageNum, image, {frameWidth: 100, frameHeight: 100 });
                }
            }
            this.displayCharacters();
        }

        getNFTIDs();
        
	}

	create() {
        this.displayCharacters = async () => {
            for (let i = 0; i < this.NFTs.length; i++) {
                const name = this.NFTs[i][0];
                const hp = this.NFTs[i][4];
                const attack = this.NFTs[i][5];

                this.add.text(150*i + 30, 490, name, {font: '18px'});
                this.add.text(150*i + 30, 520, 'Att: ' + attack, {font: '18px'});
                this.add.text(150*i + 30, 550, 'Def: ' + hp, {font: '18px'});
                const imageNum = 'charImage' + i;
                var charImage = this.add.sprite(150*i + 50, 400, imageNum, 4).setInteractive({ useHandCursor: true });
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
                }
            } catch (error) {
                console.warn('MintCharacterAction Error:', error);
            }
        };
        

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

        var press_enter_rogue = this.add.text(300, 500, "Press-Enter").setVisible(false);
        
        press_enter_rogue.on('pointerdown', () => {
            mintCharacterNFTAction(0);
            this.scene.start("gameScene", {character: "rogue"});
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

        var press_enter_heavy = this.add.text(300, 500, "Press-Enter").setVisible(false);
        
        press_enter_heavy.on('pointerdown', () => {
            mintCharacterNFTAction(1);
        });

        var enterGroup = this.add.group([press_enter_rogue, press_enter_heavy])

        var clear_choice = this.add.text(500, 500, "clear choice").setVisible(false);
        
        clear_choice.on('pointerdown', () => {
            charsGroup.setVisible(true);
            enterGroup.setVisible(false);
            clear_choice.setVisible(false);
        });
	}

}

export default CharacterSelect;