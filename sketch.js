// Input Variables
let shapeSlider;
let densitySlider;
let textInput;
let textSize = 200;
let fillOption;

// Arrays
let startArray = [];
let endArray = [];

// Variables for the start and end value of lerping
let startLerp = 0;
let endLerp = 200;

//Image loder
let img;
let load_image = 'image.jpg';

// Variable to hold the text graphic
let textImg;

// Variables to change the text design
let pointDensity = 8;
let shapeFill = 'Fill';
let shapeSize = 6;
let fontSize = 100;
let textTyped = "Costales";

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
  canvas.parent('canvasHolder');

  // Function called to create the graphic
  createTextGraphic();

  // Laoding the image pixels
  img.loadPixels();

  // Slider to change shape size
  shapeSlider = createSlider(1, 20, 6);
  shapeSlider.parent('radiusController');
  shapeSlider.class("shapeSlider");
  shapeSlider.changed(update);


  // Slider to change density of the image
  densitySlider = createSlider(1, 20, 6);
  densitySlider.class("densitySlider");
  densitySlider.changed(update);
  densitySlider.parent('densityController');

  // Slider to change font size
  fontSizeSlider = createSlider(100, 800, 100);
  fontSizeSlider.parent('fontSizeController');
  fontSizeSlider.class("fontSizeSlider");
  fontSizeSlider.changed(update);


  // Text input to display as a graphic
  inputBox = createInput(textTyped);
  inputBox.class("inputBox");
  inputBox.input(update);
  inputBox.parent('inputBoxController');

  // Drop down to change fill
  fillOption = createSelect();
  fillOption.parent('fillOption');
  fillOption.option('Fill');
  fillOption.option('No Fill');
  fillOption.changed(update);

  // Default styling on the sketch
  noStroke();
  noFill();
  textAlign(CENTER);
  rectMode(CENTER);
}

// draw() functin is called inside a loop and executed continiously
function draw() {
  background(255, 55);
  randomSeed(1);

  // Create new array of points for the graphic
  createArrays();

  // Draw the set array of points
  drawPoints();


  if (startLerp < 1) {
    startLerp = startLerp + 0.02;
  } else {
    startLerp = 1;
  }

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
          xPos: x + random(-endLerp, endLerp),
          yPos: y + random(-endLerp, endLerp),
          fill: fillColor
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

    //Calculate the starting x and y positions
    var xPos = lerp(startArray[i].xPos, endArray[i].xPos, startLerp);
    var yPos = lerp(startArray[i].yPos, endArray[i].yPos, startLerp);

    // Check which fill option is selected
    if (shapeFill === 'Fill') {
      noStroke;
      fill(endArray[i].fill);
    } else if (shapeFill === 'No Fill') {
      noFill();
      stroke(endArray[i].fill);
    }

    // Draw the shape
    ellipse(xPos, yPos, shapeSize, shapeSize);

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
  textImg.text(textTyped, width / 2, fontSize);
  textImg.loadPixels();
}

function update() {
  shapeSize = shapeSlider.value();
  pointDensity = densitySlider.value();
  fontSize = fontSizeSlider.value();
  textTyped = inputBox.value();

  if (checkBox.checked() == true) {
    shapeFill = true;
  } else {
    shapeFill = false;
  }


  endArray = [];
  startArray = [];
  createTextGraphic();
  createArrays();
  counter = 0;
}

function keyReleased() {
  // export png
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');
}