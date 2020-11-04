import Phaser, { Physics } from "phaser";
import { debugDraw } from "../utils/debug";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createHeroAnims } from "../anims/HeroAnims";
import Lizard from "../enemies/Lizard";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Phaser.Physics.Arcade.Sprite;

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
    this.faune = this.physics.add.sprite(128, 128, "faune", "walk-down-3.png");
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);

    this.faune.anims.play("faune-idle-side");

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

    // Add Camera to Follow the Hero
    this.cameras.main.startFollow(this.faune, true);
  }

  update() {
    if (!this.cursors || !this.faune) {
      return;
    }

    // Set a const for speed
    const speed = 100;

    // Handle Keyboard Input
    if (this.cursors?.left.isDown) {
      // Move left
      this.faune.setVelocity(-speed, 0);
      this.faune.anims.play("faune-run-side", true);
      // Flip the Sprite as anim moves right
      this.faune.scaleX = -1;
      // As we flipped it the collision box is off, lets fix it
      this.faune.body.offset.x = 24;
    } else if (this.cursors?.right.isDown) {
      // Move Right
      this.faune.setVelocity(speed, 0);
      this.faune.anims.play("faune-run-side", true);
      this.faune.scaleX = 1;
      // Need to reset the collision box as it might be off from moving left
      this.faune.body.offset.x = 8;
    } else if (this.cursors?.up.isDown) {
      // Move up
      this.faune.setVelocity(0, -speed);
      this.faune.anims.play("faune-run-up", true);
    } else if (this.cursors?.down.isDown) {
      // Move down
      this.faune.setVelocity(0, speed);
      this.faune.anims.play("faune-run-down", true);
    } else {
      // Idle
      const parts = this.faune.anims.currentAnim.key.split("-");
      parts[1] = "idle";
      this.faune.setVelocity(0, 0);
      this.faune.anims.play(parts.join("-"));
    }
  }
}
