let trainWindow;

const sceneScaleWindowWidth = 0.95; // Scale factor for the width of the scene relative to the window width
const sceneScaleWindowHeight = 0.9; // Scale factor for the height of the scene relative to the window height
const trainWindowCornorRadius = 30; // Corner radius for the train window

function setup() {
  createCanvas(windowWidth, windowHeight);

  trainWindow = new TrainWindow(      // Create a new instance of the TrainWindow class
  sceneScaleWindowWidth,
  sceneScaleWindowHeight,
  trainWindowCornorRadius
  );
}

function draw() {
  background(138, 103, 103);

  const dt = Math.min(deltaTime / 1000, 0.05);

  // Draw the scene inside the train window
  trainWindow.drawTrainWindow();
}

class TrainWindow {
  constructor(
    sceneScaleWindowWidth,
    sceneScaleWindowHeight,
    trainWindowCornorRadius
  ) {
    this.sceneScaleWindowWidth = sceneScaleWindowWidth;
    this.sceneScaleWindowHeight = sceneScaleWindowHeight;
    this.trainWindowCornorRadius = trainWindowCornorRadius;
  }

  // Method to draw the train window and the scene inside it
  drawTrainWindow(drawScene = () => {}) {// （）=> {} is a default empty fuction if no function is provided as an argument
    const sceneWidth = width * this.sceneScaleWindowWidth;
    const sceneHeight = height * this.sceneScaleWindowHeight;

    const trainWindowX = (width - sceneWidth) / 2;
    const trainWindowY = (height - sceneHeight) / 2;

    // Draw the train window with clipping
    push();

    rectMode(CORNER);
    noStroke();
    fill(255);

    // Create a clipping region for the train window
    clip(() => {
      rect(
        trainWindowX,
        trainWindowY,
        sceneWidth,
        sceneHeight,
        this.trainWindowCornorRadius
      );
    });

    translate(trainWindowX, trainWindowY);

    fill(210, 225, 235);
    rect(0, 0, sceneWidth, sceneHeight);

    // Draw the scene inside the train window
    drawScene(sceneWidth, sceneHeight);

    pop();

    // Draw the border of the train window
    push();

    rectMode(CORNER);
    noFill();
    stroke(163, 144, 144);
    strokeWeight(10);

    rect(
      trainWindowX,
      trainWindowY,
      sceneWidth,
      sceneHeight,
      this.trainWindowCornorRadius
    );

    pop();
  }
}
