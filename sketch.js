var inc = 0.1;
var scl = 10;
var cols;
var rows;
var zoff = 0;
var particleObejct = 2000;
var particles = [];
var flowField;
var play = true;
var paused = false;

var testVar = 0;

function setup() {
  //createCanvas(windowWidth,windowHeight);
  createCanvas(800,600);
  background(0);
  cols = floor(width/scl);
  rows = floor(height/scl);
  flowField = new Array(cols*rows);
  for(var i=0; i<particleObejct;i++){
    particles[i] = new Particle();
  }
}

function draw() {
  if(play){
    paused = false;
    beginShape();
    //background(0,1);

    getVecField();

    for(var i=0; i<particles.length;i++){
      particles[i].getPos();
      if (particles[i].isRespawning == true && particles[i].initialShot == true){
        particles[i].follow(flowField);
        particles[i].standingStill();
        particles[i].show();
        particles[i].edges();
        particles[i].update();
      }
    }
  }
  else {
    if(paused== false){
      console.log("Paused");
      paused = true;
    }
  }
}

function getVecField(){
  var yoff =0;
  testVar += 1;
  for(var y=0; y<rows;y++){
    xoff =0;
    for(var x=0; x<cols;x++){
      var index = x+y*cols;
      var angle = noise(xoff,yoff)* TWO_PI * 2;
      var v = p5.Vector.fromAngle(angle);
      //var v = createVector(0, 0);
      //var pushX = (1 - (2 * x)/(cols-1))/5;
      //var pushY = (1 - (2 * y)/(rows-1))/5;
      var pushX = 0;
      var pushY = 0;

      var pushVec = createVector(pushX, pushY);

      if (isShooting.bc == true) {
        pushVec.y = - (y/rows)*2;
      }
      else if (isShooting.tc == true) {
        pushVec.y = (1 - y/rows) * 2;
      }
      else if (isShooting.lc == true) {
        pushVec.x = (1 - x/cols) * 2;
      }
      else if (isShooting.rc == true) {
        pushVec.x = - (x/cols) * 2;
      }
      v.add(pushVec);
      v.setMag(1);

      flowField[index] = v;
      xoff +=inc;
    }
    yoff +=inc;
  }
}

function Particle(){
  this.isRespawning = false;
  this.spawnpos = createVector(1, 1);
  this.pos = this.spawnpos.copy();
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  this.maxspeed = 4;
  this.prePos = this.pos.copy();
  this.red = 100;
  this.green = 100;
  this.blue = 100;
  this.initialShot = false;
  this.shotBy = 0;
  this.colored = false;

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
    stroke(this.red, this.green, this.blue, 8);
    strokeWeight(1);
    line(this.pos.x,this.pos.y,this.prePos.x,this.prePos.y);
    this.updatePrev();
  }

  this.updateColor = function(){
    if (this.shotBy == 0) {
      this.red = 250;
      this.green = 180;
      this.blue = 20;
      this.colored = true;
    }
    else if (this.shotBy == 1) {
      this.red = 0;
      this.green = 100;
      this.blue = 150;
      this.colored = true;
    }
    else if (this.shotBy == 2) {
      this.red = 10;
      this.green = 150;
      this.blue = 10;
      this.colored = true;
    }
    else if (this.shotBy == 3) {
      this.red = 150;
      this.green = 10;
      this.blue = 10;
      this.colored = true;
    }
  }

  this.updatePrev = function(){
    this.prePos.x = this.pos.x; this.prePos.y = this.pos.y;
  }

  this.edges = function(){
    if(this.pos.x>width || this.pos.x<0 || this.pos.y<0 || this.pos.y>height){
      var aCannonShooting = (isShooting.bc == true || isShooting.tc == true || isShooting.lc == true || isShooting.rc == true);
      this.pos.x = this.spawnpos.x;
      this.pos.y = this.spawnpos.y;
      this.colored = false;
      this.updatePrev();
      if (aCannonShooting == true){
        this.isRespawning = true;
      }
      else{
        this.isRespawning = false;
      }
    }
  }

  this.standingStill = function(){
    /*
    if (this.initialShot == true){
      if (Math.sqrt((this.pos.x - this.prePos.x) ** 2 + (this.pos.x - this.prePos.x) ** 2) < 0.0001) {
        console.log("same pos");
        this.pos = this.spawnpos;
      }
    }
    */
  }

  this.follow = function(vectors){
    var x = floor(this.pos.x/scl);//position in relationship to scale "vector" unit or grid"
    var y = floor(this.pos.y/scl);
    var index = x+y*cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.getPos = function(){
    let xpos = -10;
    let ypos = -10;
    var aCannonShooting = (isShooting.bc == true || isShooting.tc == true || isShooting.lc == true || isShooting.rc == true);
    if (isShooting.bc == true) {
      if (this.colored == false){
        this.shotBy = 0;
      }
      xpos = random(width);
      ypos = height-2;
    }
    else if (isShooting.tc == true) {
      if (this.colored == false){
        this.shotBy = 1;
      }
      xpos = random(width-2);
      ypos = 2;
    }
    else if (isShooting.lc == true) {
      if (this.colored == false){
        this.shotBy = 2;
      }
      xpos = 2;
      ypos = random(height-2);
    }
    else if (isShooting.rc == true) {
      if (this.colored == false){
        this.shotBy = 3;
        this.colored = true;
      }
      xpos = width-2;
      ypos = random(height-2);
    }
    this.spawnpos.x = xpos;
    this.spawnpos.y = ypos;
    if (aCannonShooting == true){
      this.isRespawning = true;

      if (this.initialShot == false){
        this.pos.x = xpos;
        this.pos.y = ypos;
        this.initialShot = true;
        this.updatePrev();
      }
    }
  }
}

function togglePlay(){
  play = !play;
}
