import { connect } from "@textile/tableland";

class GameOver extends Phaser.Scene {

    constructor() {
		super({key : 'gameOver'});
	}

    init(data) {
        this.data = data.character;
        this.tbl = data.tbl;
        this.selectedCharacter = data.character[1];
        this.id = data.character[0];
        this.wins = data.character[8] + 1;
        console.log(this.selectedCharacter);
        console.log(this.wins);
    }

    preload() {
        this.load.image('sky', 'assets/skies/sky1.png');

        this.updateDB = async () => {
            this.tableName = "placeholder";
            
            const tables = await this.tbl.list();
            for (let i = 0; i < tables.length; i++) {
                if (tables[i].name.startsWith("scftgame")) {
                    this.tableName = tables[i].name;
                    console.log(this.tableName);
                }
            }

            await this.tbl.query(`UPDATE ${this.tableName} SET wins = ${this.wins} WHERE id = ${this.id};`);
        }
    }

    async create() {
        var bg = this.add.sprite(0,0,'sky');
		bg.setOrigin(0,0);

        this.gameOverText = this.add.text(345, 250, "GAME OVER");
        this.youWonText = this.add.text(350, 300, "YOU WON!");

        this.updateDB();
        this.youWonText = this.add.text(350, 350, "Total Wins: " + this.wins);
    }
}

export default GameOver;