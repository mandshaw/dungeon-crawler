import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {}

  create() {
    const map = this.make.tilemap({
      key: "dungeon",
    });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createStaticLayer("Ground", tileset);
    const wallLayer = map.createStaticLayer("Walls", tileset);

    wallLayer.setCollisionByProperty({ collide: true });

    // Debug Graphics checking Collision Detection
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    wallLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 30, 37, 255),
    });
  }
}
