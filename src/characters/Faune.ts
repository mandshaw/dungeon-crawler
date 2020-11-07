import Phaser, { HEADLESS } from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      faune(
        x: number,
        y: number,
        texture: string,
        frame?: number | string
      ): Faune;
    }
  }
}

enum HealthState {
  STABLE,
  DAMAGE,
}

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.STABLE;
  private damageExposureTime = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: number | string
  ) {
    super(scene, x, y, texture, frame);
    this.anims.play("faune-idle-down");
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }
    this.setVelocity(dir.x, dir.y);
    this.setTint(0xff0000);
    this.healthState = HealthState.DAMAGE;
    this.damageExposureTime = 0;
  }

  preUpdate(t: number, dt: number) {
    switch (this.healthState) {
      case HealthState.STABLE:
        break;
      case HealthState.DAMAGE:
        // Add the time since this last ran to the damage exposure timer if the player is still being damaged
        this.damageExposureTime += dt;
        // After 1/4 of a second
        if (this.damageExposureTime >= 250) {
          // Reset the health to Stable
          this.healthState = HealthState.STABLE;
          //   Change the colour tint back to normal
          this.setTint(0xffffff);
          //   reset the damageExposureTimer
          this.damageExposureTime = 0;
        }
        break;
      default:
        return;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    if (!cursors) {
      return;
    }

    // Set a const for speed
    const speed = 100;

    // Handle Keyboard Input
    if (cursors.left?.isDown) {
      // Move left
      this.setVelocity(-speed, 0);
      this.anims.play("faune-run-side", true);
      // Flip the Sprite as anim moves right
      this.scaleX = -1;
      // As we flipped it the collision box is off, lets fix it
      this.body.offset.x = 24;
    } else if (cursors.right?.isDown) {
      // Move Right
      this.setVelocity(speed, 0);
      this.anims.play("faune-run-side", true);
      this.scaleX = 1;
      // Need to reset the collision box as it might be off from moving left
      this.body.offset.x = 8;
    } else if (cursors.up?.isDown) {
      // Move up
      this.setVelocity(0, -speed);
      this.anims.play("faune-run-up", true);
    } else if (cursors.down?.isDown) {
      // Move down
      this.setVelocity(0, speed);
      this.anims.play("faune-run-down", true);
    } else {
      // Idle
      const parts = this.anims.currentAnim.key.split("-");
      parts[1] = "idle";
      this.setVelocity(0, 0);
      this.anims.play(parts.join("-"));
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register("faune", function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  texture: string,
  frame?: string | number
) {
  var sprite = new Faune(this.scene, x, y, texture, frame);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  this.scene.physics.world.enableBody(
    sprite,
    Phaser.Physics.Arcade.DYNAMIC_BODY
  );

  sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);

  return sprite;
});
