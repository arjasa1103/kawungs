// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

let lowestConstrain

const containerElement = document.getElementById('p5-container');

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(fxrand() * (max - min + 1)) + min
}

function getRandomArbitrary(min, max) {
  return fxrand() * (max - min) + min;
}

function getCircles() {
  const weight = fxrand()
  if (weight < 0.05) return 4
  if (weight < 0.18) return 5
  if (weight < 0.38) return 6
  if (weight < 0.62) return 7
  if (weight < 0.82) return 8
  if (weight < 0.95) return 9
  else return 10
}

function getHueDeviation() {
  const weight = fxrand()
  if (weight < 0.1) return 1
  if (weight < 0.35) return 2
  if (weight < 0.75) return 3
  if (weight < 0.9) return 4
  else return 5
}

function getDeviationDiv() {
  const weight = fxrand()
  if (weight < 0.1) return 3
  if (weight < 0.35) return 4
  if (weight < 0.75) return 5
  if (weight < 0.9) return 6
  else return 7
}

function getAlpha() {
  const weight = fxrand()
  if (weight < 0.4) return 0.4
  else return 0.6
}

let hue = getRandomIntInclusive(0, 36)
let saturation = getRandomIntInclusive(5, 10)
let brightness = getRandomIntInclusive(4, 6)
let circles = getCircles()
let hueDeviation = getHueDeviation()
let deviationDiv = getDeviationDiv()
let alpha = getAlpha()

let translation = 1
let background = (hue * 10 + 180) % 360

window.$fxhashFeatures = {
  // each token will have a different "Super" feature value between 0 and 1
  "Hue": hue * 10,
  "Hue Deviation": hueDeviation,
  "Deviation Division": deviationDiv,
  "Saturation": saturation * 10,
  "Brightness": brightness * 10,
  "Alpha": alpha,
  "Num. of circles": `${circles} x ${circles}`,
}

const sketch = (p) => {
  var frameSize
  var circleSize
  var startingPoint
  let circlesPos = []

  // setting up the frame & canvas
  p.setup = function () {
    // find the lowest length between height and with of the viewport / webpage
    if (window.innerHeight <= window.innerWidth) {
      lowestConstrain = window.innerHeight
    } else {
      lowestConstrain = window.innerWidth
    }

    // create and setup the canvas to be a square depending on the lowest length
    p.createCanvas(lowestConstrain, lowestConstrain);
    // make all objects to not use a stroke
    p.noStroke();
    // color mode will be HSL instead of RGB
    p.colorMode(p.HSB);

    // count the framesize to put the pattern in
    frameSize = Math.floor(.82 * lowestConstrain)
    // calculate the circles with the circles size
    circleSize = Math.floor(frameSize / (circles / 2 + .5))
    // starting point will be the left of the frame
    startingPoint = Math.floor((.09 * lowestConstrain) + (.5 * circleSize))

    // go to init function, to initialize some stuff up
    init()
  }

  // p5js run this function depending on your FPS
  p.draw = function () {

    // create the background
    p.background(background, 10, 100)

    // function to create new circle when starting
    if (circlesPos.length == 1) {
      circlesPos.push({
        x: startingPoint,
        y: startingPoint
      })
    }


    // this function will be used to draw the circle in every frame
    for (let i = 0; i < circlesPos.length; i++) {
      // circle color
      let hueVal = (hue * 10 + (i % 4 * (hueDeviation * 10))) % 360
      p.fill(hueVal, saturation * 10, brightness * 10, alpha)

      // drawing the circlee
      p.circle(circlesPos[i].x, circlesPos[i].y, circleSize)

      // check if the circle is at the place where it's supposed to be and draw accordingly
      if ((checkSamePositionX() || checkSamePositionY()) && (circlesPos.length < circles ** 2)) {
        addCircletoArray()
      } else if ((circlesPos.length < circles ** 2)) {
        updateArray()
      } else if (circlesPos.length == circles ** 2) {
        if (checkSamePositionX() || checkSamePositionY()) {
          // return nothing
        } else {
          updateArray()
        }
      }
    }

  }

  p.windowResized = function () {
    p.resizeCanvas(lowestConstrain, lowestConstrain)
  }

  p.keyPressed = function () {
    if (p.keyCode === 80) {
      p.saveCanvas("gradients", "jpeg");
    }
  }

  p.mouseClicked = function () {
  }

  // crate an array for the circles position, and when the program is run add 1 item in the array
  function init() {
    circlesPos.push({
      x: startingPoint,
      y: startingPoint
    })
  }

  // function to add another circle to the array
  function addCircletoArray() {
    if ((circlesPos.length % circles) != 0) {
      circlesPos.push({
        x: circlesPos[circlesPos.length - 1].x,
        y: circlesPos[circlesPos.length - 1].y,
      })
    } else {
      circlesPos.push({
        x: circlesPos[circlesPos.length - circles].x,
        y: circlesPos[circlesPos.length - 1].y
      })
    }
  }

  // update the circle position (to animate)
  function updateArray() {
    if ((circlesPos.length % circles) != 1) {
      circlesPos[circlesPos.length - 1].x += translation
    } else {
      circlesPos[circlesPos.length - 1].y += translation
    }
  }

  // check if the circle is where it should be vertically
  function checkSamePositionY() {
    var lastCircleY = circlesPos[circlesPos.length - 1].y
    var secondLastCircleY = circlesPos[circlesPos.length - 2].y

    return (Math.floor(lastCircleY) == Math.floor((secondLastCircleY + 0.5 * circleSize)))
  }

  // check if the circle is where it should be horizontally
  function checkSamePositionX() {
    var lastCircleX = circlesPos[circlesPos.length - 1].x
    var secondLastCircleX = circlesPos[circlesPos.length - 2].x

    return (Math.floor(lastCircleX) == Math.floor((secondLastCircleX + 0.5 * circleSize)))
  }
};

new p5(sketch, containerElement);
