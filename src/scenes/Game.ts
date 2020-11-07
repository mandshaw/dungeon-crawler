import Phaser, { Physics } from "phaser";
import { debugDraw } from "../utils/debug";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createHeroAnims } from "../anims/HeroAnims";
import Lizard from "../enemies/Lizard";

// Load Character Types
import "../characters/Faune";
import Faune from "../characters/Faune";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    // Start by creating all our Animations
    createHeroAnims(this.anims);
    createLizardAnims(this.anims);

    const map = this.make.tilemap({
      key: "dungeon",
    });
    const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16, 1, 2);

    map.createStaticLayer("Ground", tileset);
    const wallLayer = map.createStaticLayer("Walls", tileset);

    wallLayer.setCollisionByProperty({ collide: true });

    // debug
    // debugDraw(wallLayer, this);

    // Add the Hero Character to the Game
    this.faune = this.add.faune(128, 128, "faune, walk-down-3.png");

    // Add the Lizard NPCs to the game
    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (gameObject) => {
        const lizardGameObject = gameObject as Lizard;
        lizardGameObject.body.onCollide = true;
      },
    });
    lizards.get(256, 128, "lizard");

    // Add Collider
    this.physics.add.collider(this.faune, wallLayer);
    this.physics.add.collider(lizards, wallLayer);
    this.physics.add.collider(
      lizards,
      this.faune,
      this.handlePlayerLizard,
      undefined,
      this
    );

    // Add Camera to Follow the Hero
    this.cameras.main.startFollow(this.faune, true);
  }

  private handlePlayerLizard(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const lizard = obj2 as Lizard;

    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir);
  }

  update() {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}
