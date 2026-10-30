const INPUT_PANEL_HEIGHT = 120;
const SPEED_SCALE = 10;

let speedController;


// Manage the slider, speed display and keyboard input.
class SpeedController {
  constructor(initialValue = 50) {
    this.value = initialValue;
    this.panel = null;
    this.slider = null;
    this.label = null;

    this.keyRepeatDelay = 0.3;
    this.keyRepeatInterval = 0.08;
    this.keyRepeatTimer = this.keyRepeatDelay;
  }

  setup() {
    this.panel = createDiv();
    this.panel.class("speed-controls");

    this.label = createP();
    this.label.parent(this.panel);
    this.label.class("speed-label");

    this.slider = createSlider(0, 100, this.value, 1);
    this.slider.parent(this.panel);
    this.slider.attribute("aria-label", "Train speed");

    this.slider.input(() => this.handleSliderInput());

    const help = createP(
      "Drag the slider. Left: -1. Right: +1. Space: stop."
    );

    help.parent(this.panel);
    help.class("speed-help");

    this.setSpeed(this.value);
  }

  handleSliderInput() {
    const newSpeed = this.slider.value();

    this.setSpeed(newSpeed);

    audioMechanic.startAudio(trainSpeed);
  }

  setSpeed(value) {
    const nextValue = Number(value);

    if (!Number.isFinite(nextValue)) {
      return;
    }

    this.value = constrain(Math.round(nextValue), 0, 100);

    trainSpeed = this.value * SPEED_SCALE;

    this.slider.value(this.value);

    this.label.html("Speed: " + this.value + " / 100");
  }

  updateHeldKeys(dt) {
  const leftHeld = keyIsDown(LEFT_ARROW);
  const rightHeld = keyIsDown(RIGHT_ARROW);

  // Pause repeat if Space, neither arrow,
  // or both arrows are held.
  if (keyIsDown(32) || leftHeld === rightHeld) {
    this.keyRepeatTimer = this.keyRepeatDelay;
    return;
  }

  this.keyRepeatTimer -= dt;

  if (this.keyRepeatTimer > 0) {
    return;
  }

  if (leftHeld) {
    this.setSpeed(this.value - 1);
  } else {
    this.setSpeed(this.value + 1);
  }

  this.keyRepeatTimer += this.keyRepeatInterval;

  audioMechanic.startAudio(trainSpeed);
}
  
  handleKey() {
    let nextSpeed = this.value;

    if (keyCode === LEFT_ARROW) {
      nextSpeed -= 1;

    } else if (keyCode === RIGHT_ARROW) {
      nextSpeed += 1;

    } else if (keyCode === 32) {
      nextSpeed = 0;

    } else {
      return;
    }

    this.setSpeed(nextSpeed);

    this.keyRepeatTimer = this.keyRepeatDelay;

    audioMechanic.startAudio(trainSpeed);

    return false;
  }
}


// Connect the input controller to sketch.js.
function setupInputControls() {
  speedController = new SpeedController(50);
  speedController.setup();
}

function handleInputKey() {
  return speedController.handleKey();
}

function setTrainSpeed(value) {
  speedController.setSpeed(value);
}


// Manage speed-based blur inside the train window.
class SpeedBlur {
  constructor(maximumTrainSpeed = 1000) {
    this.maximumTrainSpeed = maximumTrainSpeed;

    this.maximumBlur = 6;
    this.randomAmount = 0.08;

    this.randomOffset = 0;
    this.randomTarget = 0;
    this.changeTimer = 0;

    this.strength = 0;
    this.renderScale = 0.5;
  }

  update(currentTrainSpeed, dt) {
    const speedRatio = constrain(
      currentTrainSpeed / this.maximumTrainSpeed,
      0,
      1
    );

    // Remove added blur when the train stops.
    if (speedRatio === 0) {
      this.strength = 0;
      this.randomOffset = 0;
      this.randomTarget = 0;
      this.changeTimer = 0;

      return;
    }

    // Occasionally choose a small random variation.
    this.changeTimer -= dt;

    if (this.changeTimer <= 0) {
      this.randomTarget = random(
        -this.randomAmount,
        this.randomAmount
      );

      this.changeTimer = random(0.35, 0.75);
    }

    // Gradually approach the random target.
    this.randomOffset = lerp(
      this.randomOffset,
      this.randomTarget,
      constrain(dt * 4, 0, 1)
    );

    const baseBlur = speedRatio * this.maximumBlur;

    this.strength = baseBlur * (1 + this.randomOffset);
  }

  apply(windowX, windowY, sceneWidth, sceneHeight) {
    if (this.strength <= 0.05) {
      return;
    }

    // Capture only the freshly drawn window interior.
    const sceneImage = get(
      windowX,
      windowY,
      sceneWidth,
      sceneHeight
    );

    // Reduce the working image size.
    sceneImage.resize(
      max(1, round(sceneWidth * this.renderScale)),
      max(1, round(sceneHeight * this.renderScale))
    );

    // Apply the blur to the captured image.
    sceneImage.filter(
      BLUR,
      this.strength * this.renderScale
    );

    // Draw the processed image inside the window.
    push();

    imageMode(CORNER);
    noTint();

    image(
      sceneImage,
      0,
      0,
      sceneWidth,
      sceneHeight
    );

    pop();
  }
}