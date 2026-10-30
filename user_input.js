// Interface objects
let speedSlider;
let speedLabel

// Speed shown to the viewer: 0-100
let speedValue = 50;

// Space reserved below the canvas for the controls
const INPUT_PANEL_HEIGHT = 120;

// Convert the interface value to pixels per second
const SPEED_SCALE = 10;


// Create the controls once
function setupInputControls(){
    const inputPanel = createDiv();
    inputPanel.class("speed-controls");

    speedLabel = createP();
    speedLabel.parent(inputPanel);
    speedLabel.class("speed-label");

    speedSlider = createSlider(0, 100, speedValue, 1);
    speedSlider.parent(inputPanel);
    speedSlider.attribute("aria-label", "Train speed");

    speedSlider.input(handleSliderInput);

    const controlsHelp = createP(
        "Drag slider | Left/Right: -1/+1 | Space: stop"
    );

    controlsHelp.parent(inputPanel);
    controlsHelp.class("speed-help");

    setTrainSpeed(speedValue);
}

// Handle mouse input from the slider
function handleSliderInput(){
    const newSpeed = speedSlider.value();
    setTrainSpeed(newSpeed);
    audioMechanic.startAudio(trainSpeed);
}


// Handle keyboard input
function handleInputKey(){
    let nextSpeed = speedValue;

    if (keyCode === LEFT_ARROW) {
        nextSpeed -= 1;

    } else if (keyCode === RIGHT_ARROW) {
        nextSpeed += 1;

    } else if (keyCode === 32) {
        nextSpeed = 0;

    } else {
        return;
    }

    setTrainSpeed(nextSpeed);
    audioMechanic.startAudio(trainSpeed);

    return false;
}


// Update the shared speed and the interface together
// value means the interface value: 0-100
function setTrainSpeed(value) {
    speedValue = constrain(Number(value), 0, 100);

    trainSpeed = speedValue * SPEED_SCALE;

    speedSlider.value(speedValue);

    speedLabel.html("Speed: " + speedValue + " / 100");
}
