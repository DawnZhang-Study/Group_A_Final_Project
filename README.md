# 9103_Creative_Coding_Project
Rain, Steam, and Speed

# Creative Coding Project

## 1. Inspiration
//What inspired our team's project? Explain how artworks, games, websites, or other concepts influenced our design.

Our project reinterprets J. M. W. Turner’s *Rain, Steam and Speed – The Great Western Railway* (1844).

The painting’s blurred landscape and strong sense of movement inspired our question: “When the world moves faster, what do we stop noticing?”

We move the viewpoint inside the train, allowing viewers to look out the window at the scenery and control the train’s speed. Slowing down makes the scenery easier to observe. Stopping and staying gives viewers time to observe a small event: birds arriving, resting on branches, and flying away.

Through this experience, we explore the relationship between speed, time and attention.


## 2. Techniques

**Description:**

//Explain the p5.js techniques implemented in our project and the reasons behind our technical decisions.

**Key Techniques:**
- Perlin Noise
- Object-Oriented Programming (OOP)
- Parallax Scrolling
- Time-Based Events
- Keyboard Interaction
- Audio Control

## 3. Mechanic Ownership

Our project consists of four main mechanics, each developed by a different team member.

### 3.1 Time-Based Mechanic

Responsible Member: [Doris Yu]
Main file: time-based.js

**Description:**
- Creates three TimeBird objects with different waiting times.
- Uses a timer and individual counters to control waiting and resting.
- Controls the sequence: waiting, flying in, perching, flying out and finished.
- Draws the birds using basic shapes and animates their wings during flight.
- Adds gentle vertical waves during arrival, with a randomly chosen wave height for each bird.
- Connects bird movement to saved landing positions provided by the scenery mechanic.
- Resets the bird events when the train starts moving again.

The tree and branch-selection functions were contributed by [teammate’s name].

### 3.2 Perlin Noise Mechanic

**Responsible Member:** [Dawn Zhang-czha6349]

**Description:**

Creates the scenery outside the train window, including trees, mountains, clouds, houses and distant villages. Perlin noise gives the natural elements varied shapes, while different movement speeds create a sense of depth.

**Classes and Main Functions:**

- **`Tree`** — Creates branching trees. `drawTree()` draws each tree, and `drawBranch()` recursively generates smaller branches with angles controlled by Perlin noise. Branch positions are recorded, and `getBirdLandPlacePoint()` selects landing points for the bird mechanic.

- **`Mountain`** — Creates a continuous mountain landscape. `addMountainVertex()` samples Perlin noise to generate ridge heights, while `drawMountain()` draws the mountain and records its ridge positions. `moveMountain()` scrolls the landscape and adds new points as it moves.

- **`Cloud`** — Creates clouds with varied sizes and outlines. The constructor uses Perlin noise to generate the outline points, and `drawCloud()` draws the resulting shape.

- **`House`** — Adds six different building styles using basic shapes. `drawHouse()` selects the appropriate style, while shared functions such as `drawWall()`, `drawWindow()` and `drawDoor()` draw reusable details.

- **`Village`** — Creates small groups of buildings and trees along the mountain ridge. `findFlatSpot()` finds relatively flat areas with enough spacing, `getMountainY()` calculates the ridge height at a given position, and `drawVillage()` places the objects along the terrain.

**Movement and Scene Continuity:**

`moveTrees()`, `moveMountain()`, `moveClouds()`, `moveHouses()` and `moveVillages()` update positions using the shared train speed and elapsed time (`dt`). Nearby objects move faster than distant objects, creating parallax scrolling. Objects leaving the scene are replaced or repositioned to maintain continuous scenery. When the train stops, the scenery stops moving.

### 3.3 User-Input Mechanic

**Responsible Member:** [Name]

**Description:**
- Allows users to control the train's speed through keyboard input.
- Handles interactions that affect the movement of the scene.

### 3.4 Audio Mechanic

**Responsible Member: [Jiachen Sun]  
Main file: audio-mechanic.js

**Description:**
- Loads and manages the train ambience and bird-chirping sound using p5.sound.
- Keeps the train sound at a consistent volume.
- Uses `rate()` to connect the train sound rhythm to the shared train speed.
- Maps the train speed to a playback rate from 0.6 to 1.8, making the train rhythm faster as the speed increases.
- Stops the train sound when the speed reaches 0 and restarts it when the train moves again.
- Plays the bird-chirping sound while the train is stopped and the birds are flying in, perching or flying out.
- Stops the bird sound when the train restarts or when the bird event finishes.
- Enables audio after the viewer first uses the speed slider or keyboard controls, following browser audio-playback restrictions without requiring a separate audio button.

    
16:41

## 4. AI Acknowledgement

**AI Tools Used:** [ChatGPT / Other AI Tools]

**Purpose:**

Explain how AI tools assisted with code development, debugging, or understanding programming concepts.

**Code Acknowledgement:**

Include comments in the relevant JavaScript files to identify AI-assisted code.

## 5. External References

**References:**

List any external resources, tutorials, documentation, or code examples used in the project.

**Format:**
- [Source Name](URL) — Brief explanation of how it influenced the project.

**Code Acknowledgement:**

Add source references as comments in the relevant JavaScript files.

## 6. Interaction Instructions
1. Drag the slider to change the train speed from 0 to 100.
2. Press the left or right arrow key to decrease or increase the speed by 1.  Hold an arrow key to keep adjusting it.
3. Press the spacebar or drag the slider to 0 to stop the train.
4. Stay stopped to watch the birds begin flying in after approximately 2, 3 and 4 seconds.
5. Each bird rests for approximately 3 seconds after reaching its branch, then flies away.
6. Increase the speed to restart the train and reset the bird events.
7. Observe how the landscape, blur and sounds respond to the train's movement.

Audio is enabled when you first use the slider or the keyboard controls listed above.

//
1. Open the project in a browser.
2. Use the left and right arrow keys to adjust the train speed.
3. Press the spacebar to stop the train.
4. Observe how the landscape, birds, and audio respond to the train's movement.
