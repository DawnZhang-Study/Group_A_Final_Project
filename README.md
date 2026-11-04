# IDEA9103 Creative Coding Project

## 1. Inspiration

Our project reinterprets J. M. W. Turner’s *Rain, Steam and Speed – The Great Western Railway* (1844).

The painting’s blurred landscape and strong sense of movement inspired our question: “When the world moves faster, what do we stop noticing?”

We move the viewpoint inside the train, allowing viewers to look out the window at the scenery and control the train’s speed. Slowing down makes the scenery easier to observe. Stopping and staying gives viewers time to observe a small event: birds arriving, resting on branches, and flying away.

Through this experience, we explore the relationship between speed, time and attention.

## 2. Techniques

Our project combines p5.js drawing, animation, interaction and audio to create the experience of looking through a train window. A shared train speed connects these mechanisms, allowing viewers to explore how slowing down changes what they notice.

### 2.1 Time-Based Mechanic

We use JavaScript's `setInterval()` and state management to organise the birds' arrival, rest and departure. Staggered waiting times encourage viewers to stop and observe. In p5.js, `deltaTime` supports consistent horizontal movement, while `sin()` and `map()` create a flight path that becomes gentler near landing. Birds are drawn with `ellipse()`, `circle()` and `triangle()`, and their landing positions come from recorded tree-branch coordinates.

### 2.2 Perlin Noise and Scenery Mechanic

We use `noise()` to vary mountain heights, tree angles and cloud outlines, creating an organic landscape. Recursive trees use `translate()`, `rotate()`, `push()` and `pop()` to position branches independently. `beginShape()`, `vertex()` and `endShape()` draw the mountain and cloud silhouettes. Basic shapes and `random()` add variety to buildings, while `lerp()` keeps villages aligned with the mountain ridge. Different scrolling speeds create parallax depth, and replacing or repositioning objects beyond the window maintains a continuous journey.

### 2.3 User-Input and Speed-Blur Mechanic

`createSlider()`, `keyPressed()` and `keyIsDown()` let viewers adjust the speed or stop, while `constrain()` keeps the speed within its range. Faster movement increases blur, making scenery details harder to observe. We use `get()` to capture the window interior, image `resize()` to reduce processing size, and `filter(BLUR, ...)` with `image()` to display the effect. `random()` and `lerp()` create gentle blur variations. Processing only the interior keeps the frame and controls clear.

### 2.4 Audio Mechanic

We use p5.sound's `loadSound()` within `preload()` to load the train and bird recordings, then `loop()` for continuous playback. `map()` and `rate()` connect the train sound's playback speed to its movement, while `setVolume()` keeps volume consistent. Bird chirping follows the birds' active states when the train stops. `isPlaying()` and `stop()` manage these transitions, connecting the sound to what the viewer sees.

### 2.5 Shared Structure and Rendering

JavaScript classes organise the scenery, birds, controls and audio. p5.js `setup()` initialises the scene, while `draw()` updates it and `background()` clears each frame. Drawing order establishes visual layers, and `clip()` with a rounded `rect()` confines the scene to the train window. `windowResized()` and `resizeCanvas()` adjust the canvas to the browser window.

## 3. Mechanic Ownership

Our project consists of four main mechanics, each developed by a different team member.

### 3.1 Time-Based Mechanic

**Responsible Member:** [Doris Yu]
**Main file:** `time-based.js`

**Description:**
- Creates three TimeBird objects with different waiting times.
- Uses a timer and individual counters to control waiting and resting.
- Controls the sequence: waiting, flying in, perching, flying out and finished.
- Draws the birds using basic shapes and animates their wings during flight.
- Adds gentle vertical waves during arrival, with a randomly chosen wave height for each bird.
- Connects bird movement to saved landing positions provided by the scenery mechanic.
- Resets the bird events when the train starts moving again.

The tree-selection method `TimeBird.getBirdLandingTree()` and the branch landing-point method `Tree.getBirdLandPlacePoint()` were contributed by Dawn Zhang.

### 3.2 Perlin Noise Mechanic

**Responsible Member:** [Dawn Zhang-czha6349]
**Main File:** `perlin-layer.js`

**Description:**

Creates the scenery outside the train window, including trees, mountains, clouds, houses and distant villages. Perlin noise gives the natural elements varied shapes, while different movement speeds create a sense of depth.

**Classes and Main Functions:**

- **`Tree`** — Creates branching trees. `drawTree()` draws each tree, and `drawBranch()` recursively generates smaller branches with angles controlled by Perlin noise. Branch positions are recorded, and `getBirdLandPlacePoint()` selects landing points for the bird mechanic.

- **`Mountain`** — Creates a continuous mountain landscape. `addMountainVertex()` samples Perlin noise to generate ridge heights, while `drawMountain()` draws the mountain and records its ridge positions. `moveMountain()` scrolls the landscape and adds new points as it moves.

- **`Cloud`** — Creates clouds with varied sizes and outlines. The constructor uses Perlin noise to generate the outline points, and `drawCloud()` draws the resulting shape.

- **`House`** — Adds six different building styles using basic shapes. `drawHouse()` selects the appropriate style, while shared functions such as `drawWall()`, `drawWindow()` and `drawDoor()` draw reusable details.

- **`Village`** — Creates small groups of buildings and trees along the mountain ridge. `findFlatSpot()` finds relatively flat areas with enough spacing, `getMountainY()` calculates the ridge height at a given position, and `drawVillage()` places the objects along the terrain.

**Bird Landing Selection:**

I also implemented `TimeBird.getBirdLandingTree()` in `time-based.js`. This function uses the recorded branch positions to identify trees that are at least partially visible in the train window, sorts them horizontally, and selects a tree by counting from the right. The current setting selects the second tree from the right.

Together with `Tree.getBirdLandPlacePoint()` in `perlin-layer.js`, this connects the scenery to the bird mechanic: one function selects the tree, and the other selects branch positions for the birds to land on.

**Movement and Scene Continuity:**

`moveTrees()`, `moveMountain()`, `moveClouds()`, `moveHouses()` and `moveVillages()` update positions using the shared train speed and elapsed time (`dt`). Nearby objects move faster than distant objects, creating parallax scrolling. Objects leaving the scene are replaced or repositioned to maintain continuous scenery. When the train stops, the scenery stops moving.

### 3.3 User-Input Mechanic

**Responsible Member:** [Name]

**Description:**
- Allows users to control the train's speed through keyboard input.
- Handles interactions that affect the movement of the scene.

### 3.4 Audio Mechanic

**Responsible Member:**[Jiachen Sun]  
**Main file:** `audio-mechanic.js`

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
