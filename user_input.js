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
        "Drag slider | Left/Right: -5/+5 | Space: stop"
    );

    controlsHelp.parent(inputPanel);
    controlsHelp.class("speed-help");

    setTrainSpeed(speedValue);
}