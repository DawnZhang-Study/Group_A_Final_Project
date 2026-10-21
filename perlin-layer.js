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
    constructor(speedRatio = 0.15){
        this.mountainVertexArray = [];

        this.mountainVertexCount = 120; // Number of vertices for the mountain shape
        this.mountainPerlinNoiseStep = 0.04; // Step size for Perlin noise sampling

        this.noiseOffset = random(10000); // Random offset for Perlin noise
        this.noiseIndex = 0; // Index for Perlin noise sampling

        this.speedRatio = speedRatio; // Speed ratio for parallax effect
        this.moveSpeed = 0; // Speed at which the mountain moves

        this.mountainOffset = 0; //mountain left offset position

        for (let i = 0; i <= this.mountainVertexCount; i++) {
            this.addMountainVertex();
        }
    }

    addMountainVertex() {
        // Sample Perlin noise to get a value between 0 and 1
        const noiseValue = noise(this.noiseOffset + this.noiseIndex * this.mountainPerlinNoiseStep);
        this.mountainVertexArray.push(noiseValue);// Add the noise value to the mountain vertex array
        this.noiseIndex++;
    }

    drawMountain(sceneWidth, sceneHeight) {
        const mountainSlotWidth = sceneWidth / (this.mountainVertexCount - 1);
        
        push();

        fill(90,130,100);
        noStroke();

        beginShape();
        vertex(0, sceneHeight * 0.7); // Start from the bottom left corner

        for (let i = 0;i <this.mountainVertexArray.length; i++) {
            const x = i * mountainSlotWidth - this.mountainOffset;
            const y = map(this.mountainVertexArray[i], 0, 1, sceneHeight * 0.15, sceneHeight * 0.5);
            vertex(x, y);
        }

        vertex(sceneWidth, sceneHeight * 0.7);
        endShape(CLOSE);
        
        pop();
    }

    moveMountain(trainSpeed, dt, sceneWidth){ 
        if(sceneWidth <= 0){
            return;
        }
        const mountainSlotWidth = sceneWidth / ( this.mountainVertexCount-1 );

        this.moveSpeed = trainSpeed * this.speedRatio;
        this.mountainOffset += this.moveSpeed * dt;

        while (this.mountainOffset >= mountainSlotWidth) {
            this.mountainOffset -= mountainSlotWidth;

            this.mountainVertexArray.shift();
            this.addMountainVertex();
        }
    }

}

class Cloud{
    constructor(xPos,yPos,speedRatio = 0.01) {
        this.cloudPoints = [];
        this.centerX = xPos;
        this.centerY = yPos;
        this.speedRatio = speedRatio;
        this.moveSpeed = 0;

        this.noiseOffsetX = random(10000);
        this.noiseOffsetY = random(10000);


        for (let angle = 0; angle < TWO_PI; angle += 0.1) {
            let noiseValue = noise( this.noiseOffsetX + cos ( angle ) * 2, this.noiseOffsetY + sin ( angle ) * 2)

            let radius = 60 + 60 * noiseValue;

            let x = cos(angle) * radius * 1.5;
            let y = sin(angle) * radius * 0.45;

            this.cloudPoints.push({ x, y }); // Add the center point of the cloud
        }
    }

    drawCloud() {
        push();

        translate(this.centerX,this.centerY);

        fill(229, 240, 255);
        noStroke();

        beginShape();

        for(let point of this.cloudPoints){
            vertex(point.x,point.y);
        }

        endShape(CLOSE);
        pop();
    }

    static moveClouds(clouds,trainSpeed, dt, sceneWidth,cloudSlotWidth) {
        if (clouds.length == 0 || cloudSlotWidth <= 0) {
            return;
        }

        const edgePadding = 300;

        // 1 Move each cloud based on the train speed and delta time
        for (let i = 0; i < clouds.length; i++) {
        const cloud = clouds[i];

        cloud.moveSpeed = trainSpeed * cloud.speedRatio;
        cloud.centerX -= cloud.moveSpeed * dt;
        } 

        // 2 Remove clouds that have moved off the left side of the screen
        while ( clouds[clouds.length - 1].centerX < sceneWidth + edgePadding ) {
            const lastCloud = clouds[clouds.length - 1];
            const newXPos = lastCloud.centerX + cloudSlotWidth;

            clouds.push(
            new Cloud(newXPos,lastCloud.centerY ,lastCloud.speedRatio)
            );
        }

        // 3 Remove clouds that have moved off the right side of the screen
        while (clouds.length > 1 && clouds[0].centerX < -edgePadding) {
            clouds.shift();
        }
    }
}

class House{

}

class Bird{

}