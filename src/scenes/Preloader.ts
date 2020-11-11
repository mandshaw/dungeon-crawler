import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    // Load Dungeon Tile map
    this.load.image("tiles", "tiles/dungeon_tiles_extruded.png");
    this.load.tilemapTiledJSON("dungeon", "tiles/dungeon-01.json");

    // Add Hero Character
    this.load.atlas("faune", "character/fauna.png", "character/fauna.json");

    // Add the UI Hears
    this.load.image("ui-heart-empty", "ui/ui_heart_empty.png");
    this.load.image("ui-heart-full", "ui/ui_heart_full.png");

    // Add the Lizard NPC
    this.load.atlas("lizard", "enemies/lizard.png", "enemies/lizard.json");
  }

  create() {
    this.scene.start("game");
  }
}
