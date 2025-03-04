// Variables

const majorsURL = "https://raw.githubusercontent.com/fivethirtyeight/data/refs/heads/master/college-majors/all-ages.csv"

let majorsTable
let selectedMajors = []
let selectedRates = []
let currentIndex = 0
let barWidth
let maxHeight = 300 // tentative, can be changed as needed
let dx
let c = 50
let xAxisPos = 350

// ____________________________________________________________
// Preload Function

function preload() {
  majorsTable = loadTable(majorsURL, 'csv', 'header')
}
// ____________________________________________________________
// Setup Function

function setup() {
  createCanvas(600, 500);
  textSize(12)
  textAlign( CENTER,CENTER)
  pickNextMajors()
  
}

// ____________________________________________________________
// Class Specifications

class BarGraph {
  constructor() {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.maxHeight = height * 0.8
    this.data = data // need this for the barWidth function
    this.barWidth = width / (data.length + 2)
  }
}

// ____________________________________________________________
// Draw Function

function draw() {
  background(220)
  
  drawTitle()
  drawAxes()
  YAxisLabel()
  drawBars(dx, barWidth)
  barHover(dx, barWidth)
  drawLegend()
}

// ____________________________________________________________
// All Other Functions Go Below
// ____________________________________________________________

// ____________________________________________________________
// Title Function

function drawTitle() {
  textSize(18)
  text("Employment Rate by Major (2010-2012)", width/2, 30)
}
// ____________________________________________________________
// Axes Lines

function drawAxes() {
  stroke(0)
  
  // X-axis line
  line(100, 350, width - 50, 350)
  
  // Y Axis Line
  line(100, 350, 100, 50)
}
// ____________________________________________________________
// Y-axis Label

function YAxisLabel() {
  push()
  textSize(14)
  translate(80, height / 2 - c)
  rotate(-PI/2)
  text("Employed Rate (%)", 0, 0)
  pop()
}

// ____________________________________________________________
// Function to Pick the Next 5 Majors (Goes in a sequence order)
function pickNextMajors() {
  selectedMajors = []
  selectedRates = []
  
  for (let i = currentIndex; i < currentIndex + 5; i++) {
    if (i < majorsTable.getRowCount()) {
      let totalGrads = int(majorsTable.getString(i, "Total"))
      let employedGrads = int(majorsTable.getString(i, "Employed"))

      let employmentRate = (employedGrads / totalGrads) * 100
      
      selectedMajors.push(majorsTable.getString(i, "Major"))
      selectedRates.push(employmentRate)
    }
  }
}

// ____________________________________________________________
// Draw Bar Function

function drawBars() {
  dx = width / (selectedMajors.length + 2)
  barWidth = dx * 0.5
  
  for(let i = 0; i < selectedMajors.length; i++) {
    let cx = dx * (i + 1)
    let barHeight = map(selectedRates[i], 0, 100, 0, maxHeight)
    
    // In this function, I'm controlling the bar color so that a higher % is more blue while red is a lower %
    let colorValue = map(selectedRates[i], 0, 100, 255, 0)
    fill(colorValue, 150, 255 - colorValue)
    
    // Draw bar as rectangle
    rect(cx - barWidth / 2 + c, xAxisPos - barHeight, barWidth, barHeight)
    
    // Draw employment rate
    fill(0)
    textSize(10)
    text(Math.round(selectedRates[i]) + "%", cx + c, xAxisPos - barHeight - 15)
    
    // Major name, wrapped function (is the last part of the text function)
    fill(0)
    textAlign(CENTER, TOP)
    let maxWidth = barWidth - 10
    text(selectedMajors[i], cx + 35, xAxisPos + 5, maxWidth)
  }
}


// ____________________________________________________________
// Bar Hover function
function barHover(dx, barWidth) {
   for (let i = 0; i < selectedMajors.length; i++) {
    let cx = dx * (i + 1) // Position of the bar
    let barHeight = map(selectedRates[i], 0, 100, 0, maxHeight)
    
    // Position Check
    if(mouseX > cx - barWidth / 2 + c && mouseX < cx + barWidth / 2 + c && mouseY > xAxisPos - barHeight && mouseY < xAxisPos) {
      
      let totalGrads = int(majorsTable.getString(i + currentIndex, "Total"))
      let totalEmployed = int(majorsTable.getString(i + currentIndex, "Employed"))
      
      fill(0)
      textSize(10)
      text(`Total Graduates: ${totalGrads}`, mouseX, mouseY - 20)
      text(`Employed Graduates: ${totalEmployed}`, mouseX, mouseY)
      
      }
    }
}

// ____________________________________________________________
// Switch along index (keypress, left and right button)

function keyPressed() {
  if(keyCode === RIGHT_ARROW) {
    currentIndex = (currentIndex + 5) % majorsTable.getRowCount()
    pickNextMajors()
  }
  
  else if(keyCode === LEFT_ARROW) {
    currentIndex = (currentIndex - 5 + majorsTable.getRowCount()) % majorsTable.getRowCount()
    pickNextMajors()
  }
  
  redraw()
}

// ____________________________________________________________
// Draw a Legend
// Legend contains: Tells Red to Blue, and Key Controls

function drawLegend() {
  let legendX = 100;
  let legendY = height - 50;

  // Draw legend box
  noFill()
  rect(legendX - 70, legendY - 40, legendX + 100, 80)
  
  // Draw Color Legend
  textSize(10)
  fill(0)
  text("Red = Low %", legendX - 30, legendY)
  text("Blue = High %", legendX - 30, legendY - 20)
  
  // Draw Control instructions
  text("Left and right arrows to control data", legendX + 15, legendY + 20)
  
  // Legend Title
  textSize(12)
  text("Legend", legendX - 40, legendY - 35)
}
