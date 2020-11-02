import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    // Load Dungeon Tile map
    this.load.image("tiles", "tiles/dungeon_tiles.png");
    this.load.tilemapTiledJSON("dungeon", "tiles/dungeon-01.json");

    // Add Hero Character
    this.load.atlas("faune", "character/fauna.png", "character/fauna.json");
  }

  create() {
    this.scene.start("game");
  }
}
