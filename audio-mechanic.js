let insideTrainSound;
let birdChirpingSound;

function preload() {
  insideTrainSound = loadSound("audio/inside-old-train.mp3");
  birdChirpingSound = loadSound("audio/natural-bird-chirping.mp3");
}

class AudioMechanic {
  constructor(trainSound, birdSound, maximumTrainSpeed) {
    this.trainSound = trainSound;
    this.birdSound = birdSound;
    this.maximumTrainSpeed = maximumTrainSpeed;
    this.audioEnabled = false;
  }

  startAudio(currentTrainSpeed) {
    this.audioEnabled = true;

    if (currentTrainSpeed > 0 && !this.trainSound.isPlaying()) {
      this.trainSound.loop();
      this.trainSound.setVolume(0.5);
    }
  }

  updateTrainAudio(currentTrainSpeed, currentBirds) {
    if (!this.audioEnabled) {
      return;
    }

    let speedRatio = currentTrainSpeed / this.maximumTrainSpeed;
    speedRatio = constrain(speedRatio, 0, 1);

    if (currentTrainSpeed > 0) {
      if (!this.trainSound.isPlaying()) {
        this.trainSound.loop();
        this.trainSound.setVolume(0.5);
      }

      let trainRate = map(speedRatio, 0, 1, 0.6, 1.8);
      this.trainSound.rate(trainRate);
    } else if (this.trainSound.isPlaying()) {
      this.trainSound.stop();
    }

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
