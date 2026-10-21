class Tree{
    constructor(xPos,speedRatio = 0.9){

        // Position of the tree on the x-axis
        this.xPos = xPos;
        this.speedRatio = speedRatio; // Speed ratio for parallax effect

        // Initial position of the tree
        this.moveSpeed = 0;
    
        // noise offset for Perlin noise
        this.noiseOffset = random(10000);
    }


    drawTree(x,y){

        push();
        // Set the stroke color for the tree
        stroke(70, 50, 30);
        translate(x, y);

        this.drawBranch(95,1);
        pop();
    }

    drawBranch(length, branchID){
        // Base case: if the branch length is too small, stop drawing
        if (length < 10) {
            return;
        }

        // Set the stroke weight based on the branch length
        strokeWeight(length / 12);
        line(0, 0, 0, -length);
        translate(0, -length);

        // Use Perlin noise to determine the angle of the branches
        let noiseValue = noise(this.noiseOffset + branchID * 0.1);
        let angle = map(noiseValue, 0, 1, PI / 10, PI / 4);
        let nextLength = length * 0.7;

        // Draw left branch
        push();
        rotate(-angle);
        this.drawBranch(nextLength, branchID * 2);
        pop();

        // Draw right branch
        push();
        rotate(angle);
        this.drawBranch(nextLength, branchID * 2 + 1);
        pop();
    }

    static moveTrees(trees,trainSpeed, dt, sceneWidth,treeSlotWidth){
        if (trees.length == 0 || treeSlotWidth <= 0) {
            return;
        }

        const edgePadding = 300;

        // 1 Move each tree based on the train speed and delta time
        for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];

        tree.moveSpeed = trainSpeed * tree.speedRatio;
        tree.xPos -= tree.moveSpeed * dt;
        } 

        // 2 Remove trees that have moved off the left side of the screen
        while ( trees[trees.length - 1].xPos < sceneWidth + edgePadding ) {
            const lastTree = trees[trees.length - 1];
            const newXPos = lastTree.xPos + treeSlotWidth;

            trees.push(
            new Tree(newXPos, lastTree.speedRatio)
            );
        }

        // 3 Remove trees that have moved off the right side of the screen
        while (trees.length > 1 && trees[0].xPos < -edgePadding) {
            trees.shift();
        }
    }

}
class Mountain{

}
class CLoud{

}
class House{

}
class Bird{

}