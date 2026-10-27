// This class stores one bird's position and draws a simple placeholder.
class TimeBird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 18;
  }

   display() {
    push();

    noStroke();
    fill(60);
    circle(this.x, this.y, this.size);

    pop();
  }
}