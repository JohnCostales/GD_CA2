// Input Variables
let shapeSlider;
let densitySlider;
let textInput;
let textSize;
let fillOption;
let animate;

// Arrays
let startArray = [];
let endArray = [];

// Variables for the start and end value of lerping
let distCount = 0;
let randomVal = 200;

//Image loder
let img;
let load_image = "image.jpg";

// Variable to hold the text graphic
let textImg;

// Variables to change the text design
let pointDensity = 8;
let shapeFill = "Fill";
let shapeSize = 6;
let fontSize = 100;
let textTyped = "Costales";
let animation = "None";

// Set a fixed randomness
let actRandomSeed = 1;

// Move shape
let counter;
let counterDir = true;
let velocity;
let lerpAmount;

// Canvas Size.
let myWidth = $("#canvasHolder").width();

function preload() {
  font = loadFont("data/FreeSansBold.ttf");
  img = loadImage(load_image);
}

// This function is only called once. Everything within the function is executed once
function setup() {
  // Create Canvas
  let canvas = createCanvas(myWidth, myWidth);
  canvas.parent("canvasHolder");

  // Function called to create the graphic
  createTextGraphic();

  // Laoding the image pixels
  img.loadPixels();

  // Slider to change shape size
  shapeSlider = createSlider(1, 20, 6);
  shapeSlider.parent("radiusController");
  shapeSlider.class("shapeSlider");
  shapeSlider.changed(update);

  // Slider to change density of the image
  densitySlider = createSlider(1, 20, 6);
  densitySlider.class("densitySlider");
  densitySlider.changed(update);
  densitySlider.parent("densityController");

  // Slider to change font size
  fontSizeSlider = createSlider(100, 800, 100);
  fontSizeSlider.parent("fontSizeController");
  fontSizeSlider.class("fontSizeSlider");
  fontSizeSlider.changed(update);

  // Text input to display as a graphic
  inputBox = createInput(textTyped);
  inputBox.class("inputBox");
  inputBox.input(update);
  inputBox.parent("inputBoxController");

  // Drop down to change fill
  fillOption = createSelect();
  fillOption.parent("fillOption");
  fillOption.option("Fill");
  fillOption.option("None");
  fillOption.changed(update);

  // Drop down to change fill
  animate = createSelect();
  animate.parent("animateOption");
  animate.option("None");
  animate.option(" ");
  animate.option("Collapse");
  animate.changed(update);

  // Default styling on the sketch
  noStroke();
  noFill();
  textAlign(CENTER);
}

// draw() functin is called inside a loop and executed continiously
function draw() {
  background(255, 55);
  randomSeed(actRandomSeed);
  // Create new array of points for the graphic
  // and draw the set array of points
  createArrays();
  drawPoints();
}

// Create array start and end points.

function createArrays() {
  startArray = [];
  endArray = [];

  // Loop through the array of pixels
  for (let x = 0; x < textImg.width; x += pointDensity) {
    for (let y = 0; y < textImg.height; y += pointDensity) {
      // Calculate the index for the pixels array from x and y
      let index = (x + y * textImg.width) * 4;
      let imgIndex = (x + y * img.width) * 4;
      // Get the red value from image
      let r = textImg.pixels[index];
      if (r < 128) {
        // Assign pixel value intp fill colour
        var rValue = img.pixels[imgIndex];
        var gValue = img.pixels[imgIndex + 1];
        var bValue = img.pixels[imgIndex + 2];
        var fillColor = color(rValue, gValue, bValue);

        // Push to random starting point
        startArray.push({
          xPos: x + random(-randomVal, randomVal),
          yPos: y + random(-randomVal, randomVal)
        });
        // Push the destination point with assigned fill colour
        endArray.push({
          xPos: x,
          yPos: y,
          fill: fillColor
        });
      }
    }
  }
}

function drawPoints() {
  for (let i = 0; i < endArray.length; i++) {
    // Check which fill option is selected
    if (shapeFill === "Fill") {
      noStroke();
      fill(endArray[i].fill);
    } else if (shapeFill === "None") {
      noFill();
      stroke(endArray[i].fill);
    }

    disCount = (counter / endArray.length) * velocity;
    //Calculate the starting x and y positions
    let xPos = lerp(startArray[i].xPos, endArray[i].xPos, distCount);
    let yPos = lerp(startArray[i].yPos, endArray[i].yPos, distCount);

    if (lerpAmount > 1) {
      lerpAmount = 1;
    }

    // Draw the shape
    ellipse(xPos, yPos, shapeSize, shapeSize);
  }

  // Check for Animation
  if ((counterDir === true) & (animation === "Normal")) {
    if (counter * velocity < endArray.length) {
      counter++;
    } else {
      //console.log()
      counterDir = false;
      counter--;
    }
  } else {
    if (counter * velocity > 0) {
      counter--;
    } else {
      counterDir = true;
    }
    if (distCount < 1) {
      distCount = distCount + 0.02;
    } else {
      distCount = 1;
    }
  }
}

function createTextGraphic() {
  // create an offscreen graphics object to draw the text into
  //console.log("check")
  textImg = createGraphics(width, height);
  textImg.pixelDensity(1);
  textImg.background(255);
  textImg.fill(0);
  textImg.textFont(font);
  textImg.textSize(fontSize);
  textImg.textAlign(CENTER);
  textImg.text(textTyped, textImg.width / 2, textImg.height / 2 + fontSize);
  textImg.loadPixels();
}

// Create animation
function animateShape() {}

function update() {
  shapeSize = shapeSlider.value();
  pointDensity = densitySlider.value();
  fontSize = fontSizeSlider.value();
  shapeFill = fillOption.value();
  textTyped = inputBox.value();
  animation = animate.value();
  endArray = [];
  startArray = [];
  createTextGraphic();
  createArrays();
  counter = 0;
}

function keyReleased() {
  // export png
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), "png");
}
