import { connect } from "@textile/tableland";
import { ethers } from 'ethers';


class HighScoreScene extends Phaser.Scene {

	constructor() {
		super({key:'highScoreScene'});

	}


	preload() {
		this.load.image('sky', 'assets/skies/sky1.png');
		const CONTRACT_ADDRESS = '0xC6Ee86f954f6e0F60cb32ee3d5709220FE20b0d9';
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const queryTable = async () => {
        	//get the high scores logic here

        }

	}


	create() {
		var bg = this.add.sprite(0,0,'sky');
		bg.setOrigin(0,0);

		this.add.text( 350, 50, 'High scores!');

		var back = this.add.text( 50, 550, '<-- Back');

		back.setInteractive({ useHandCursor: true });
        back.on('pointerdown', () => this.clickBack());

	}

	clickBack() {
    	this.scene.start('titleScene');
    }


}

export default HighScoreScene;