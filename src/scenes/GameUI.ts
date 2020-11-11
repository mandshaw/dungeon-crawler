import Phaser from "phaser";

import { sceneEvents } from "../events/EventCenter";

export default class GameUi extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;

  constructor() {
    super({ key: "game-ui" });
  }

  create() {
    this.hearts = this.add.group({ classType: Phaser.GameObjects.Image });

    this.hearts.createMultiple({
      key: "ui-heart-full",
      setXY: {
        x: 10,
        y: 10,
        stepX: 16,
      },
      quantity: 3,
    });

    // Listen for Events when the players health changes
    sceneEvents.on(
      "player-health-changed",
      this.handlePlayerHealthChange,
      this
    );

    // Cleanup events on Scene shutdown
    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      sceneEvents.off(
        "player-health-changed",
        this.handlePlayerHealthChange,
        this
      );
    });
  }

  private handlePlayerHealthChange(health: number) {
    this.hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image;
      if (idx < health) {
        heart.setTexture("ui-heart-full");
      } else {
        heart.setTexture("ui-heart-empty");
      }
    });
  }
}
