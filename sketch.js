var inc = 0.1;
var scl = 20;
var cols;
var rows;
var zoff = 0;
var particleObejct = 7000;
var particles = [];
var flowField;

var testVar = 0;

function setup() {
  createCanvas(windowWidth,windowHeight);
  cols = floor(width/scl);
  rows = floor(height/scl);
  flowField = new Array(cols*rows);
  for(var i=0; i<particleObejct;i++){
    particles[i] = new Particle();
  }
}

function draw() {
  beginShape();
  background(0, 50);
  var yoff =0;
  for(var y=0; y<rows;y++){
    xoff =0;
    for(var x=0; x<cols;x++){
      var index = x+y*cols;
      var angle = noise(xoff,yoff)* TWO_PI * 5;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      let pushX = (1 - x/(cols/2));
      let pushY = (1 - y/(rows/2));
      let pushVec = createVector(pushX, pushY);
      v.add(pushVec);
      if (v.x == 0 || v.y == 0){
        console.log("zervector");
      }
      //v.setMag(1);
      flowField[index] = v;//store all of the vectors calculated into flow field
      //push();
      //translate(x*scl,y*scl)
      //rotate(angle);
      //strokeWeight(1);
      //stroke(0,5);
      //line(0,0,scl,0);
      //pop();
      xoff +=inc;
    }
    yoff +=inc;
  }
  let test = true
  for(var i=0; i<particles.length;i++){
    particles[i].spawnpos = getPos();
    particles[i].follow(flowField);
    particles[i].show();
    particles[i].edges();
    particles[i].update();
  }
}

function Particle(){
  let xpos = 0;
  let ypos = 0;
  this.spawnpos = createVector(random(width), random(height));
  this.pos = this.spawnpos;
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  this.maxspeed = 10;
  this.prePos = this.pos.copy();
  this.red = 100;
  this.green = 100;
  this.blue = 100;
  
  this.update = function(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel); this.acc.mult(0);
  }

  this.applyForce = function(force){
    this.acc.add(force);
  }

  this.show = function(){
    this.updateColor();
    stroke(this.red, this.green, this.blue, 50);
    strokeWeight(1);
    line(this.pos.x,this.pos.y,this.prePos.x,this.prePos.y);
    this.updatePrev();
  }

  this.updateColor = function(){
    if(this.pos.x>width-10){
      this.red = 150;
      this.green = 10;
      this.blue = 10;
    }
    else if(this.pos.x<10){
      this.red = 10;
      this.green = 150;
      this.blue = 10;
    }
    else if(this.pos.y<10){
      this.red = 0;
      this.green = 100;
      this.blue = 150;
    }
    else if(this.pos.y>height-10){
      this.red = 250;
      this.green = 180;
      this.blue = 20;
    }
  }

  this.updatePrev = function(){
    this.prePos.x = this.pos.x; this.prePos.y = this.pos.y;
  }

  this.edges = function(){
    if(this.pos.x>width){
      this.pos = this.spawnpos;
      this.updatePrev();
    }
    if(this.pos.x<0){
      this.pos = this.spawnpos;
      this.updatePrev();
    }
    if(this.pos.y<0){
      this.pos = this.spawnpos;
      this.updatePrev();
    }
    if(this.pos.y>height){
      this.pos = this.spawnpos;
      this.updatePrev();
    }
  }

  this.follow = function(vectors){
    var x = floor(this.pos.x/scl);//position in relationship to scale "vector" unit or grid"
    var y = floor(this.pos.y/scl);
    var index = x+y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }
}

function getPos(){
  let xpos = random(width);
  let ypos = random(height);
  if (isShooting.bc == true) {
    xpos = random(width);
    ypos = height;
  }
  else if (isShooting.tc == true) {
    xpos = random(width);
    ypos = 0;
  }
  else if (isShooting.lc == true) {
    xpos = 0;
    ypos = random(height);
  }
  else if (isShooting.rc == true) {
    xpos = width;
    ypos = random(height);
  }
  return createVector(xpos, ypos);
}
