// This class stores one bird's position and draws a simple placeholder.
class TimeBird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 18;
    this.speed = 120; // Flight speed in pixels per second

    this.state = "waiting";
    this.stageTicks = 0;
  } 
 
    update(dt, targetX, trainSpeed) {
  // Reset the bird while the train is moving.       
  if (trainSpeed > 0) {
      this.reset();
    }

    // Start flying after about two seconds.
    else if (this.state === "waiting") {
      if (this.stageTicks >= 20) {
        this.state = "flyingIn";
        this.stageTicks = 0;
      }
    }

    // Move towards the target.
    else if (this.state === "flyingIn") {
      this.x += this.speed * dt;

      // Stop at the target.
      if (this.x >= targetX) {
        this.x = targetX;
        this.state = "perching";
        this.stageTicks = 0;
      }
    }
  }

  display() {
    // Keep the bird hidden while waiting.
    if (this.state === "waiting") {
      return;
    }

    push();
    noStroke();
    fill(60);
    circle(this.x, this.y, this.size);
    pop();
  }

  reset() {
    // Restore the starting state, count and position.
    this.state = "waiting";
    this.stageTicks = 0;
    this.x = -this.size;
  }
}

// Called by the timer about every 100 milliseconds.
function countEventTime() {
  if (trainSpeed === 0 && bird.state === "waiting") {
    bird.stageTicks++;
  }
}