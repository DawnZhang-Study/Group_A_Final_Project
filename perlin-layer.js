class Tree{
    constructor(xPos,speedRatio = 0.9){

        // Position of the tree on the x-axis
        this.xPos = xPos;
        this.speedRatio = speedRatio; // Speed ratio for parallax effect

        // Initial position of the tree
        this.moveSpeed = 0;
    
        // noise offset for Perlin noise
        this.noiseOffset = random(10000);

        //record the branchpoint for the bird landing.
        this.branchPoints ={};
    }

    drawTree(x,y){

        this.branchPoints = {};

        push();
        // Set the stroke color for the tree
        stroke(70, 50, 30);
        translate(x, y);

        this.drawBranch(95,1,1,x,y,0);
        pop();
    }

    drawBranch(length, branchID,level, startX, startY, totalAngle){
        // Base case: if the branch length is too small, stop drawing
        if (length < 10) {
            return;
        }

        // Set the stroke weight based on the branch length
        strokeWeight(length / 12);
        line(0, 0, 0, -length);
        translate(0, -length);

        // Calculate the pisition
        const endX = startX + length * sin(totalAngle);
        const endY = startY - length * cos(totalAngle);

        //Record the branchpoints ID
        this.branchPoints[branchID] = {
            branchID: branchID,
            level: level,
            x: endX,
            y: endY
        }

        // Use Perlin noise to determine the angle of the branches
        let noiseValue = noise(this.noiseOffset + branchID * 0.1);
        let angle = map(noiseValue, 0, 1, PI / 10, PI / 4);
        let nextLength = length * 0.7;

        // Draw left branch
        push();
        rotate(-angle);
        this.drawBranch(
            nextLength,
            branchID * 2,
            level + 1,
            endX,
            endY,
            totalAngle - angle
        );
        pop();

        // Draw right branch
        push();
        rotate(angle);
        this.drawBranch(
            nextLength,
            branchID * 2 + 1,
            level + 1,
            endX,
            endY,
            totalAngle + angle
        );
        pop();
    }

    getBirdLandPlacePoint(count = 3){
        if (!Number.isInteger(count) || count <= 0) {
            return [];
        }

        const points = Object.values(this.branchPoints);
        
        if(points.length ==0){
            return [];
        }

        const maxLevel = Math.max(
            ...points.map(point => point.level));

        const availablePoints = points.filter(point => 
            point.level >= maxLevel - 3 && 
            point.level <= maxLevel - 1 )

        const selectedPoints = [];
        const actualCount = Math.min(count, availablePoints.length);

        for (let i = 0; i < actualCount; i++) {

            const randomIndex = floor(random(availablePoints.length));

            const selectedPoint = availablePoints.splice(randomIndex, 1)[0];

            selectedPoints.push(selectedPoint);
        }
        return selectedPoints;
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
    constructor(xPos,yPos,speedRatio = 0.01,minScale = 0.7,maxScale = 1.3) {
        this.cloudPoints = [];
        this.centerX = xPos;
        this.centerY = yPos;
        this.speedRatio = speedRatio;
        this.moveSpeed = 0;

        // Store size range for future clouds
        this.minScale = minScale;
        this.maxScale = maxScale;

        // Each cloud gets its own random size
        this.sizeScale = random(minScale, maxScale);

        this.noiseOffsetX = random(10000);
        this.noiseOffsetY = random(10000);


        for (let angle = 0; angle < TWO_PI; angle += 0.1) {
            let noiseValue = noise( this.noiseOffsetX + cos ( angle ) * 2, this.noiseOffsetY + sin ( angle ) * 2)

            let radius = (60 + 60 * noiseValue) * this.sizeScale;

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
            new Cloud(
                newXPos,
                lastCloud.centerY ,
                lastCloud.speedRatio,
                lastCloud.minScale,
                lastCloud.maxScale)
            );
        }

        // 3 Remove clouds that have moved off the right side of the screen
        while (clouds.length > 1 && clouds[0].centerX < -edgePadding) {
            clouds.shift();
        }
    }
}

class House {
    constructor(x, y, w = 140, h = 150, type = null) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        // Randomly select one of six house types
        // Or specify a type from 0 to 5
        this.houseType = type === null ? floor(random(6)) : type;
    }

    // Main drawing method
    drawHouse() {
        push();
        translate(this.x, this.y);
        noStroke();

        switch (this.houseType) {
        case 0: this.drawCottage(); break;
        case 1: this.drawNordicHouse(); break;
        case 2: this.drawModernHouse(); break;
        case 3: this.drawJapaneseHouse(); break;
        case 4: this.drawShop(); break;
        case 5: this.drawApartment(); break;
        }

        pop();
    }

    // Common drawing functions
    drawWall(r, g, b) {
        fill(r, g, b);
        rect(0, -this.h, this.w, this.h);

        fill(133, 130, 116);
        rect(0, -5, this.w, 5);
    }

    drawWindow(x, y, w = 25, h = 30) {
        // Outer frame
        fill(246, 237, 218);
        rect(x - 4, y - 4, w + 8, h + 8, 2);

        // Glass
        fill(130, 180, 190);
        rect(x, y, w, h);

        // Glass reflection
        fill(177, 211, 212);
        triangle(x, y, x + w * 0.45, y,
                x, y + h * 0.65);

        // Window dividers
        fill(247, 240, 221);
        rect(x + w / 2 - 1.5, y, 3, h);
        rect(x, y + h / 2 - 1.5, w, 3);

        // Window sill
        fill(195, 181, 159);
        rect(x - 6, y + h + 4, w + 12, 4);
    }

    drawDoor(x, w = 32, h = 50) {
        fill(90, 69, 61);
        rect(x - 3, -h - 3, w + 6, h + 3);

        fill(135, 97, 78);
        rect(x, -h, w, h);

        fill(153, 111, 87);
        rect(x + 5, -h + 6, w - 10, h - 12);

        fill(239, 210, 152);
        circle(x + w - 7, -h / 2, 4);
    }

    // 01 Classic cottage
    drawCottage() {
        const w = this.w;
        const h = this.h;

        this.drawWall(232, 199, 162);

        // Chimney
        fill(156, 98, 83);
        rect(w * 0.72, -h - 50, 18, 55);
        fill(116, 75, 66);
        rect(w * 0.72 - 3, -h - 52, 24, 6);

        // Main roof
        fill(164, 87, 80);
        triangle(-18, -h + 5, w / 2, -h - 63,
                w + 18, -h + 5);

        // Inner roof surface
        fill(197, 115, 101);
        triangle(-4, -h + 3, w / 2, -h - 49,
                w + 4, -h + 3);

        // Attic window
        fill(247, 220, 183);
        circle(w / 2, -h - 21, 21);
        fill(122, 175, 183);
        circle(w / 2, -h - 21, 14);

        // Ground floor
        this.drawWindow(w * 0.12, -h * 0.62, 27, 30);
        this.drawWindow(w * 0.69, -h * 0.62, 27, 30);
        this.drawDoor(w * 0.39, 31, 54);

        // Door step
        fill(171, 148, 126);
        rect(w * 0.36, 0, 42, 6);
    }

    // 02 Nordic house
    drawNordicHouse() {
        const w = this.w;
        const h = this.h;

        this.drawWall(180, 202, 214);

        // Vertical wooden siding
        stroke(155, 183, 195);
        strokeWeight(1);
        for (let x = 10; x < w; x += 13) {
        line(x, -h, x, -5);
        }
        noStroke();

        // Roof
        fill(78, 103, 130);
        triangle(-12, -h, w / 2, -h - 75,
                w + 12, -h);

        // Roof edge
        stroke(55, 79, 105);
        strokeWeight(5);
        line(-12, -h, w / 2, -h - 75);
        line(w / 2, -h - 75, w + 12, -h);
        noStroke();

        // Two floors of windows
        for (let row = 0; row < 2; row++) {
        this.drawWindow(17, -h + 23 + row * 49, 24, 27);
        this.drawWindow(w - 41, -h + 23 + row * 49, 24, 27);
        }

        // Front door
        fill(84, 110, 120);
        rect(w * 0.39 - 4, -59, 40, 59);
        this.drawDoor(w * 0.39, 32, 56);

        // Roof vent
        fill(224, 228, 218);
        rect(w / 2 - 6, -h - 29, 12, 17);
    }

    // 03 Modern flat-roof house
    drawModernHouse() {
        const w = this.w;
        const h = this.h;

        this.drawWall(225, 228, 218);

        // Side architectural panel
        fill(180, 198, 193);
        rect(0, -h, 26, h - 5);

        // Flat roof
        fill(76, 103, 114);
        rect(-10, -h - 14, w + 20, 16, 2);

        fill(110, 140, 146);
        rect(-10, -h - 3, w + 20, 5);

        // Large glass wall
        fill(241, 243, 234);
        rect(14, -h + 31, w * 0.61, h * 0.72);

        fill(120, 183, 190);
        rect(20, -h + 37, w * 0.61 - 12, h * 0.72 - 12);

        // Glass dividers
        fill(241, 243, 234);
        rect(w * 0.32, -h + 37, 4, h * 0.72 - 12);
        rect(20, -h + 83, w * 0.61 - 12, 4);

        // Entrance panel
        fill(191, 157, 128);
        rect(w * 0.72, -h + 40, w * 0.23, h - 40);

        this.drawDoor(w * 0.76, 27, 60);

        // Front steps
        fill(169, 182, 176);
        rect(w * 0.7, 0, w * 0.3, 5);
        fill(197, 207, 197);
        rect(w * 0.67, 5, w * 0.36, 5);
    }

    // 04 Japanese house
    drawJapaneseHouse() {
        const w = this.w;
        const h = this.h;

        this.drawWall(231, 213, 183);

        // Wooden posts
        fill(146, 116, 91);
        rect(8, -h, 9, h);
        rect(w - 17, -h, 9, h);

        // Wide traditional roof
        fill(66, 88, 89);
        quad(
        -17, -h + 6,
        17, -h - 38,
        w - 17, -h - 38,
        w + 17, -h + 6
        );

        // Roof eaves
        fill(47, 68, 72);
        rect(-20, -h + 2, w + 40, 10);

        // Left and right windows
        this.drawWindow(20, -h * 0.63, 25, 35);
        this.drawWindow(w - 45, -h * 0.63, 25, 35);

        // Sliding shoji doors
        fill(156, 129, 104);
        rect(w * 0.34, -h * 0.67, w * 0.32, h * 0.67);

        fill(231, 220, 195);
        rect(w * 0.36, -h * 0.65, w * 0.28, h * 0.65);

        stroke(139, 111, 88);
        strokeWeight(3);

        line(w * 0.5, -h * 0.65, w * 0.5, 0);

        for (let i = 1; i < 4; i++) {
        const yy = -h * 0.65 + i * h * 0.16;
        line(w * 0.36, yy, w * 0.64, yy);
        }

        noStroke();

        // Entrance platform
        fill(162, 147, 125);
        rect(w * 0.3, 0, w * 0.4, 7);
    }

    // 05 Street shop
    drawShop() {
        const w = this.w;
        const h = this.h;

        this.drawWall(239, 214, 183);

        // Roof edge
        fill(144, 91, 83);
        rect(-7, -h - 9, w + 14, 11);

        // Shop sign
        fill(102, 146, 142);
        rect(12, -h + 13, w - 24, 34, 4);

        fill(250, 242, 219);
        textAlign(CENTER, CENTER);
        textSize(17);
        textStyle(BOLD);
        text("CAFE", w / 2, -h + 30);
        textStyle(NORMAL);

        // Awning support
        fill(109, 75, 68);
        rect(0, -h + 63, w, 5);

        // Striped awning
        for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
            fill(189, 101, 91);
        } else {
            fill(248, 237, 220);
        }

        rect(i * w / 8, -h + 68, w / 8, 23);
        }

        // Shop display window
        fill(249, 241, 222);
        rect(9, -h + 99, w * 0.52, h - 99);

        fill(121, 182, 184);
        rect(14, -h + 104, w * 0.52 - 10, h - 109);

        // Window divider
        fill(249, 241, 222);
        rect(w * 0.27, -h + 104, 4, h - 109);

        // Shop entrance
        this.drawDoor(w * 0.72, 30, h - 99);

        // Storefront base
        fill(161, 112, 94);
        rect(0, -5, w, 5);
    }

    // 06 Apartment building
    drawApartment() {
        const w = this.w;
        const h = this.h;

        this.drawWall(171, 193, 181);

        // Side shadow
        fill(149, 173, 162);
        rect(w - 14, -h, 14, h);

        // Flat roof structure
        fill(90, 120, 119);
        rect(-8, -h - 14, w + 16, 16);

        fill(118, 148, 143);
        rect(-8, -h - 4, w + 16, 5);

        // Three rows and three columns of windows
        for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let wx = 15 + col * (w - 45) / 2;
            let wy = -h + 22 + row * 38;

            this.drawWindow(wx, wy, 23, 25);

            // Small balcony ledge
            fill(122, 145, 136);
            rect(wx - 5, wy + 30, 33, 4);
        }
        }

        // Main entrance
        fill(104, 126, 122);
        rect(w * 0.37 - 5, -52, 48, 52);

        this.drawDoor(w * 0.37, 38, 47);

        // Entrance steps
        fill(122, 144, 135);
        rect(w * 0.33, 0, 53, 6);
    }

    static moveHouses(houses, trainSpeed, dt, sceneWidth) {
        const speedRatio = 0.55;
        const edgePadding = 50;

        for (let i = 0; i < houses.length; i++) {
            const house = houses[i];

            // Move the house from right to left
            house.x -= trainSpeed * speedRatio * dt;

            // Check if the house has moved off the left side
            if (house.x + house.w < -edgePadding) {

                // Find the rightmost position of all other houses
                let rightmostX = sceneWidth;

                for (let j = 0; j < houses.length; j++) {
                    if (i !== j) {
                        rightmostX = max(
                            rightmostX,
                            houses[j].x + houses[j].w
                        );
                    }
                }

                // Reposition the house to the right
                house.x = rightmostX + random(50, 130);

                // Randomly select a new house type
                house.houseType = floor(random(6));
            }
        }
    }
}

class Village{
    drawBuilding(){
        
    }
    drawTree(){

    }
}