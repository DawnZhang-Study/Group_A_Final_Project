// This class stores one bird's position and draws a simple placeholder.
class TimeBird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 18;
    this.speed = 120; // Flight speed in pixels per second

    this.state = "waiting";
    this.stageTicks = 0;

    // Wing position and movement direction.
    this.wingY = -16;
    this.wingSpeed = 2;
  } 
  
  getBirdLandingTree(trees, sceneWidth, treeFromRight) {
    // Require a positive integer.
    if (!Number.isInteger(treeFromRight) || treeFromRight < 1) {
        return null;
    }

    const visibleTrees = trees.filter(tree => {
        // Read the branch positions recorded during drawing.
        const points = Object.values(tree.branchPoints);

        if (points.length === 0) {
            return false;
        }

        // Find the horizontal bounds of the whole tree.
        const xs = points.map(point => point.x);
        const left = Math.min(tree.xPos, ...xs);
        const right = Math.max(tree.xPos, ...xs);

        // Count trees that extend into the window.
        return right > 0 && left < sceneWidth;
    });

    // Sort from left to right.
    visibleTrees.sort((a, b) => a.xPos - b.xPos);

    if (visibleTrees.length < treeFromRight) {
        return null;
    }

    // Select the requested tree from the right.
    return visibleTrees[visibleTrees.length - treeFromRight];
  }
 
    update(dt, targetX, trainSpeed, sceneWidth) {
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

    // Rest for about three seconds after arrival.
     else if (this.state === "perching") {
      if (this.stageTicks >= 30) {
         this.state = "flyingOut";
         this.stageTicks = 0;
    }
  }

 // Fly out of the window.
     else if (this.state === "flyingOut") {
         this.x += this.speed * dt;

     if (this.x > sceneWidth + this.size) {
         this.state = "finished";
    }
  }
}

  display() {
    // Hide the bird before and after the event.
     if (this.state === "waiting" || this.state === "finished") {
     return;
}

    push();
    translate(this.x, this.y);
    noStroke();

    // Body.
  fill(60);
  ellipse(0, 0, 24, 16);

  // Flap the wing during flight.
  if (this.state === "flyingIn" || this.state === "flyingOut") {
    this.wingY += this.wingSpeed;

  // Change direction at the upper and lower limits.
  if (this.wingY >= 12 || this.wingY <= -16) {
    this.wingSpeed = -this.wingSpeed;
  }

  fill(90);
  triangle(-7, 0, 6, 0, -4, this.wingY);
} else {
  // Fold the wing while resting.
  fill(90);
  ellipse(-2, 0, 14, 8);
}

  // Head.
  circle(10, -7, 12);

  // Tail.
  triangle(-9, -2, -20, -8, -17, 5);

  // Beak.
  fill(190, 140, 65);
  triangle(15, -9, 22, -6, 15, -4);

  // Eye.
  fill(255);
  circle(12, -9, 3);

  pop();
  }

  reset() {
    // Restore the starting state, count and position.
    this.state = "waiting";
    this.stageTicks = 0;
    this.x = -this.size;
    this.wingY = -16;
    this.wingSpeed = 2;
  }
}

// Called about every 100 milliseconds.
function countEventTime() {
  if (trainSpeed === 0) {
    // Count during waiting or resting.
    if (bird.state === "waiting" || bird.state === "perching") {
      bird.stageTicks++;
    }
  }
}