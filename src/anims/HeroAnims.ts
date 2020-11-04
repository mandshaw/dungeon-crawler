import Phaser from "phaser";

const createHeroAnims = (anims: Phaser.Animations.AnimationManager) => {
  // Hero animations
  anims.create({
    key: "faune-idle-down",
    frames: [{ key: "faune", frame: "walk-down-3.png" }],
  });

  anims.create({
    key: "faune-idle-up",
    frames: [{ key: "faune", frame: "walk-up-3.png" }],
  });

  anims.create({
    key: "faune-idle-side",
    frames: [
      {
        key: "faune",
        frame: "walk-side-3.png",
      },
    ],
  });

  anims.create({
    key: "faune-run-down",
    frames: anims.generateFrameNames("faune", {
      start: 1,
      end: 8,
      prefix: "run-down-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 15,
  });

  anims.create({
    key: "faune-run-side",
    frames: anims.generateFrameNames("faune", {
      start: 1,
      end: 2,
      prefix: "run-side-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 10,
  });

  anims.create({
    key: "faune-run-up",
    frames: anims.generateFrameNames("faune", {
      start: 1,
      end: 8,
      prefix: "run-up-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 15,
  });
};

export { createHeroAnims };
