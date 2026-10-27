// This class stores one bird's position and draws a simple placeholder.
class TimeBird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 18;
    this.speed = 120; // Flight speed in pixels per second
  } 
 
    update(dt, targetX) {
  // Move only if the bird has not reached the target.       
  if (this.x < targetX) {
    // Move based on speed and time passed.
    this.x += this.speed * dt;
    
    // Stop exactly at the target.
    if (this.x >= targetX) {
      this.x = targetX;
    }
  }
}

   display() {
    push();

    noStroke();
    fill(60);
    circle(this.x, this.y, this.size);

    pop();
  }
}