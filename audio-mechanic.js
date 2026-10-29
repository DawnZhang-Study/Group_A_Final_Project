// Audio assets are loaded before setup() so they are ready when the sketch begins.
let insideTrainSound;
let birdChirpingSound;

function preload() {
  insideTrainSound = loadSound("audio/inside-old-train.mp3");
  birdChirpingSound = loadSound("audio/natural-bird-chirping.mp3");
}

class AudioMechanic {
  constructor(trainSound, birdSound, maximumTrainSpeed = 1000) {
    this.trainSound = trainSound;
    this.birdSound = birdSound;
    this.maximumTrainSpeed = maximumTrainSpeed;
    this.audioStarted = false;
    this.birdEventActive = false;
    this.birdStopTimer = null;

    // Browsers only allow sound after a real user interaction.
    const unlockAudio = () => this.startTrainAudio();
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
  }

  startTrainAudio() {
    if (this.audioStarted) {
      return;
    }

    userStartAudio().then(() => {
      if (this.audioStarted || !this.trainSound.isLoaded()) {
        return;
      }

      this.trainSound.setLoop(true);
      this.trainSound.setVolume(0);
      this.trainSound.play();
      this.audioStarted = true;
    });
  }

  updateTrainAudio(currentTrainSpeed, currentBirds) {
    if (!this.audioStarted) {
      return;
    }

    const safeSpeed = constrain(
      Number(currentTrainSpeed) || 0,
      0,
      this.maximumTrainSpeed
    );
    const speedRatio = safeSpeed / this.maximumTrainSpeed;

    if (safeSpeed === 0) {
      this.fadeOutTrainAudio();
    } else {
      // Faster travel is louder and slightly more rapid.
      const targetVolume = map(speedRatio, 0, 1, 0.08, 0.65);
      const targetRate = map(speedRatio, 0, 1, 0.78, 1.22);

      this.trainSound.setVolume(targetVolume, 0.2);
      this.trainSound.rate(targetRate);
    }

    this.updateBirdAudio(safeSpeed, currentBirds);
  }

  fadeOutTrainAudio(fadeTime = 0.6) {
    this.trainSound.setVolume(0, fadeTime);
  }

  updateBirdAudio(currentTrainSpeed, currentBirds) {
    const birdsAreVisible = currentBirds.some((bird) =>
      bird.state === "flyingIn" ||
      bird.state === "perching" ||
      bird.state === "flyingOut"
    );
    const shouldPlayBirds = currentTrainSpeed === 0 && birdsAreVisible;

    if (shouldPlayBirds && !this.birdEventActive) {
      this.birdEventActive = true;
      clearTimeout(this.birdStopTimer);

      if (this.birdSound.isLoaded()) {
        this.birdSound.setLoop(true);
        this.birdSound.setVolume(0.32);

        if (!this.birdSound.isPlaying()) {
          this.birdSound.play();
        }
      }
    } else if (!shouldPlayBirds && this.birdEventActive) {
      this.birdEventActive = false;
      this.fadeOutBirdAudio();
    }
  }

  fadeOutBirdAudio(fadeTime = 0.35) {
    if (!this.birdSound.isPlaying()) {
      return;
    }

    this.birdSound.setVolume(0, fadeTime);
    clearTimeout(this.birdStopTimer);

    this.birdStopTimer = setTimeout(() => {
      if (!this.birdEventActive && this.birdSound.isPlaying()) {
        this.birdSound.stop();
      }
    }, fadeTime * 1000 + 50);
  }
}
