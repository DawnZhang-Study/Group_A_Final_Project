let insideTrainSound;
let birdChirpingSound;

// Load both sound files before setup() runs.
function preload() {
  insideTrainSound = loadSound("audio/inside-old-train.mp3");
  birdChirpingSound = loadSound("audio/natural-bird-chirping.mp3");
}

class AudioMechanic {
  constructor(trainSound, birdSound, maximumTrainSpeed) {
    this.trainSound = trainSound;
    this.birdSound = birdSound;
    this.maximumTrainSpeed = maximumTrainSpeed;
    this.audioButton = null;
  }

  // The tutorial uses a button because browsers require user interaction
  // before sound can begin.
  setupButton() {
    this.audioButton = createButton("Start Audio");
    this.audioButton.mousePressed(toggleAudioButton);
    this.positionButton();
  }

  positionButton() {
    if (this.audioButton !== null) {
      this.audioButton.position(
        (width - this.audioButton.width) / 2,
        height + 88
      );
    }
  }

  toggleAudio() {
    if (this.trainSound.isPlaying()) {
      this.trainSound.stop();

      if (this.birdSound.isPlaying()) {
        this.birdSound.stop();
      }

      this.audioButton.html("Start Audio");
    } else {
      this.trainSound.loop();
      this.audioButton.html("Stop Audio");
    }
  }

  updateTrainAudio(currentTrainSpeed, currentBirds) {
    // Do not update or start other sounds before the audio button is pressed.
    if (!this.trainSound.isPlaying()) {
      return;
    }

    let speedRatio = currentTrainSpeed / this.maximumTrainSpeed;
    speedRatio = constrain(speedRatio, 0, 1);

    // Faster speed produces a louder and quicker train sound.
    let trainVolume = map(speedRatio, 0, 1, 0, 0.65);
    let trainRate = map(speedRatio, 0, 1, 0.78, 1.22);

    this.trainSound.setVolume(trainVolume);
    this.trainSound.rate(trainRate);

    this.updateBirdAudio(currentTrainSpeed, currentBirds);
  }

  updateBirdAudio(currentTrainSpeed, currentBirds) {
    let birdsAreVisible = false;

    for (let i = 0; i < currentBirds.length; i++) {
      if (
        currentBirds[i].state === "flyingIn" ||
        currentBirds[i].state === "perching" ||
        currentBirds[i].state === "flyingOut"
      ) {
        birdsAreVisible = true;
      }
    }

    if (currentTrainSpeed === 0 && birdsAreVisible) {
      if (!this.birdSound.isPlaying()) {
        this.birdSound.loop();
        this.birdSound.setVolume(0.32);
      }
    } else if (this.birdSound.isPlaying()) {
      this.birdSound.stop();
    }
  }
}

// This named function is used by mousePressed(), as in the tutorial examples.
function toggleAudioButton() {
  audioMechanic.toggleAudio();
}
