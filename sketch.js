let trainWindow;

let bird;
let birdLandingTreeFromRight = 2; //from right to left
let birdLandingPointCount = 3;// set the landing count
let birdLandingTarget = null;

let trainSpeed = 500; // Speed of the train in pixels per second

let trees = [];
let treeSlotWidth;
const initialTreeCount = 4;

let mountain;

let clouds =[];
let cloudSlotWidth;
const initialCloudCount = 4;

const sceneScaleWindowWidth = 0.95; // Scale factor for the width of the scene relative to the window width
const sceneScaleWindowHeight = 0.9; // Scale factor for the height of the scene relative to the window height
const trainWindowCornorRadius = 30; // Corner radius for the train window

function setup() {
  createCanvas(
    windowWidth,
    max(180, windowHeight - INPUT_PANEL_HEIGHT)
  );

  setupInputControls();

  trainWindow = new TrainWindow(      // Create a new instance of the TrainWindow class
  sceneScaleWindowWidth,
  sceneScaleWindowHeight,
  trainWindowCornorRadius
  );

  const sceneWidth = width * sceneScaleWindowWidth;// Calculate the width of the scene based on the window width and scale factor
  
  // Run the counting function about every 100 milliseconds.
  setInterval(countEventTime, 100);
  // The starting point of the bird
  // Start from outside of the window; Hides while waiting, and only appears inside the window after flying in.
  bird = new TimeBird(
  -20,
  height * sceneScaleWindowHeight * 0.4
);

  // Create multiple tree instances
  for (let i = 0; i < initialTreeCount; i++) {
    const x = sceneWidth * (i + 0.5) / initialTreeCount;
    trees.push(new Tree(x, 0.8));// Add a new tree with a speed ratio of 0.5
  }
  treeSlotWidth = sceneWidth / trees.length; // Calculate the width of each tree slot based on the number of trees and scene width


  mountain = new Mountain(0.2);// Create a new instance of the Mountain class


  for(let i = 0; i<initialCloudCount; i++){
    const x = sceneWidth *(i + 0.5)/initialCloudCount
    clouds.push(new Cloud(x, height * sceneScaleWindowHeight * 0.15, 0.05))
  }
  cloudSlotWidth = sceneWidth/ clouds.length;
}

function draw() {
  background(138, 103, 103);

  const dt = Math.min(deltaTime / 1000, 0.05);

  // Draw the scene inside the train window
  trainWindow.drawTrainWindow((sceneWidth, sceneHeight) => {
    drawCloudScene(sceneWidth, sceneHeight,dt);
    drawFarScene(sceneWidth, sceneHeight,dt);
    drawMiddleScene(sceneWidth, sceneHeight,dt);
    drawNearScene(sceneWidth, sceneHeight);
  
    if (trainSpeed > 0) {
      // Reset the bird and clear the previous target.
      bird.reset();
      birdLandingTarget = null;
    } else {
      // Choose a target once for this stop.
      if (birdLandingTarget === null) {
        const landingTree = bird.getBirdLandingTree(
          trees,
          sceneWidth,
          birdLandingTreeFromRight
        );

        if (landingTree !== null) {
          const landingPoints = landingTree.getBirdLandPlacePoint(
            birdLandingPointCount
          );

          // Choose a point safely inside the window.
          for (let i = 0; i < landingPoints.length; i++) {
            const point = landingPoints[i];

            if (
              point.x > 25 &&
              point.x < sceneWidth - 25 &&
              point.y > 25 &&
              point.y < sceneHeight - 12
            ) {
              birdLandingTarget = point;
              break;
            }
          }
        }
      }

      // Use the saved target for the bird event.
      if (birdLandingTarget !== null) {
        bird.y = birdLandingTarget.y - 8;

        bird.update(
          dt,
          birdLandingTarget.x,
          trainSpeed,
          sceneWidth
        );

        bird.display();
      }
    }
  });
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

    fill(160, 202, 235);
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

function drawCloudScene(sceneWidth, sceneHeight,dt) {

  Cloud .moveClouds(clouds,trainSpeed,dt,sceneWidth,cloudSlotWidth);

  for(let i = 0; i<clouds.length; i++){
    clouds[i].drawCloud();
  }
}

function drawFarScene(sceneWidth, sceneHeight,dt) {

  // Draw distant mountains
  mountain.moveMountain(trainSpeed, dt, sceneWidth);
  mountain.drawMountain(sceneWidth, sceneHeight);

}

function drawMiddleScene(sceneWidth, sceneHeight, dt) {
  // Draw the middle ground (e.g., trees)

  // Move the trees based on the train speed and delta time
  Tree.moveTrees(
    trees,
    trainSpeed,
    dt,
    sceneWidth,
    treeSlotWidth
  );
  // Draw the trees
  for (let i = 0; i < trees.length; i++) {
    trees[i].drawTree(
    trees[i].xPos,
    sceneHeight * 1.01
    );
  }
}

function drawNearScene(sceneWidth, sceneHeight) {
  // Draw the near ground 
  
}

// Function to handle window resizing
function windowResized() {
  resizeCanvas(
    windowWidth, 
    max(180, windowHeight - INPUT_PANEL_HEIGHT)
  );
}


// User-input controls: Left/Right arrows adjust speed by 5
// Space sets the speed to 0 and stops the train
// Input handling and speed conversion are in user_input.js
function keyPressed() {
  return handleInputKey();
}