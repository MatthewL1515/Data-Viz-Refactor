// Variables

const majorsURL = "https://raw.githubusercontent.com/fivethirtyeight/data/refs/heads/master/college-majors/all-ages.csv"

let allData = []
let currentIndex = 0
let graph

// ____________________________________________________________
// Class Specifications

class BarGraph {
  constructor(x, y, width, height, data) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.maxHeight = height * 0.8
    this.data = []
  }

  updateData(newData) {
    this.data = newData
    redraw()
  }
  
  // ____________________________________________________________
  // Draw Function
    draw() {
      background(220)
    
      this.drawTitle()
      this.drawAxes()
      this.drawBars()
      this.barHover()
      this.drawLegend()
    }
    
  // ____________________________________________________________
  // Draw Title
  drawTitle() {
    textAlign(CENTER, CENTER)
    textSize(18)
    text("Employment Rate by Major (2010-2012)", this.x + this. width / 2, this.y - 30)
  }
  
  // ____________________________________________________________
  // Axes Lines

  drawAxes() {
    stroke(0)
    // X-axis line
    line(this.x + 50, this.y + this.height - 50, this.x + this.width - 10, this.y + this.height - 50)
  
    // Y Axis Line
    line(this.x + 50, this.y + 50, this.x + 50, this.y + this.height - 50)
    
    // Y Axis Label
    push()
    textSize(14)
    translate(this.x + 20, this.y + this.height / 2)
    rotate(-PI/2)
    text("Employed Rate (%)", 0, 0)
    pop()
  }
  
  // ____________________________________________________________
  // Draw Bar Function

  drawBars() {
    
    let xAxisPos = this.y + this.height - 50
    let dx = (this.width / (this.data.length + 2)) + 20
    let barWidth = dx * 0.5
    
    for (let i = 0; i < this.data.length; i++) {
      let cx = this.x + 85 + dx * i
      let barHeight = map(this.data[i].rate, 0, 100, 0, this.maxHeight)
      
      // In this function, I'm controlling the bar color so that a higher % is more blue while red is a lower %
      let colorValue = map(this.data[i].rate, 0, 100, 255, 0)
      fill(colorValue, 150, 255 - colorValue)
    
      // Draw bar as rectangle
      rect(cx - barWidth / 2, xAxisPos - barHeight, barWidth, barHeight)
    
      // Draw employment rate
      fill(0)
      textSize(10)
      text(Math.round(this.data[i].rate) + "%", cx, xAxisPos - barHeight - 15)
    
      // Major name, wrapped function (is the last part of the text function)
      fill(0)
      textAlign(CENTER, TOP)
      text(this.data[i].major, cx - 5, xAxisPos + 10, barWidth - 30)
    }
 }
  
  // ____________________________________________________________
  // Bar Hover Function
  barHover() {
    let xAxisPos = this.y + this.height - 50
    let dx = this.width / (this.data.length + 2)
    let barWidth = dx * 0.6
    
    for (let i = 0; i < this.data.length; i++) {
      let cx = this.x + 85 + dx * i
      let barHeight = map(this.data[i].rate, 0, 100, 0, this.maxHeight)
      
      let totalGrads = this.data[i].total
      let totalEmployed = Math.round((this.data[i].rate / 100) * totalGrads)
      
      if (mouseX > (cx - (barWidth / 2)) && mouseX < (cx + (barWidth / 2)) && mouseY > xAxisPos- barHeight && mouseY < xAxisPos) {
        fill(0)
        textSize(10)
        text(`Total Graduates: ${totalGrads}`, mouseX + 10, mouseY - 20)
        text(`Employed Graduates: ${totalEmployed}`, mouseX + 10, mouseY)
      }
    }
    
  }
  
   // Draw Legend
  drawLegend() {
    let legendX = this.x + 20
    let legendY = this.y + this.height - 40
    
    textAlign(LEFT, TOP)
    noFill()
    rect(legendX - 10, legendY + 50, 160, 80)
    textSize(10)
    text("Red = Low %, Blue = High %", legendX, legendY + 80)
    text("Use ← → to switch majors", legendX, legendY + 100)
    textSize(12)
    text("Legend", legendX, legendY + 55)
  }
}

// ____________________________________________________________
// Preload Function

function preload() {
  table = loadTable(majorsURL, 'csv', 'header', processData)
}

function processData(table) {
  for (let i = 0; i < table.getRowCount(); i++) {
    let totalGrads = int(table.getString(i,"Total"))
    let employedGrads = int(table.getString(i,"Employed"))
    let employmentRate = (employedGrads / totalGrads) * 100
    let major = table.getString(i, "Major")
    
    allData.push({major, rate: employmentRate, total: totalGrads})
  }
}

// ____________________________________________________________
// Setup Function

function setup() {
  createCanvas(600, 500)
  textSize(12)
  textAlign( CENTER,CENTER)
  
  let initialData = allData.slice(0,5)
  graph = new BarGraph(50, 50, 500, 350, initialData)
  
  if (allData.length >= 5) {
    graph.updateData(allData.slice(0,5))
  }
  
}

// ____________________________________________________________
// Draw Function

function draw() {
  background(220)
  
  if (graph) {
    graph.draw()
  }
}

// ____________________________________________________________
// All Other Functions Go Below
// ____________________________________________________________

// ____________________________________________________________
// Switch along index (keypress, left and right button)

function keyPressed() {
  if(allData.length >= 5) {
    if (keyCode === RIGHT_ARROW) {
      currentIndex = (currentIndex + 5) % allData.length
    }
    else if (keyCode === LEFT_ARROW) {
      currentIndex = (currentIndex - 5 + allData.length) % allData.length
    }
    graph.updateData(allData.slice(currentIndex,currentIndex + 5))
  }
}
