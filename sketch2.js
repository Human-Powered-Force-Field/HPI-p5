var inc = 0.1;
var scl = 10;
var cols;
var rows;
var zoff = 0;
var particleObejct = 6000;
var particles = [];
var flowField;
var play = true;
var paused = false;
var logged = false;
var particleAmount = 0;
var testVar = 0;
var aCannonShooting = false;


function setup() {
  createCanvas(windowWidth,windowHeight);
  //createCanvas(500,300);
  background(0);
  cols = floor(width/scl);
  rows = floor(height/scl);
  flowField = new Array(cols*rows);
  for(var i=0; i<particleObejct;i++){
    particles[i] = new Particle();
  }
}

function draw() {
  if(pause.val == false){
    beginShape();

    getVecField();
    aCannonShooting = (isShooting.bc == true || isShooting.tc == true ||
      isShooting.lc == true || isShooting.rc == true);

    if (aCannonShooting == true){
      if (particleAmount <= particleObejct){
        particleAmount += 2;
      }
    }

    for(var i=0; i<particleAmount;i++){
      particles[i].setAcc();
      if (particles[i].isRespawning == true && particles[i].initialShot == true){
        particles[i].follow(flowField);
        particles[i].show();
        particles[i].edges();
        particles[i].update();
      }
    }
  }
}

function getVecField(){
  var yoff =0;
  testVar += 1;
  var randomizer = 2 + shaker.val/2;
  var randomizer2 = 1 + shaker.val/2;
  for(var y=0; y<rows;y++){
    xoff =0;
    for(var x=0; x<cols;x++){
      var index = x+y*cols;
      var angle = noise(xoff,yoff)* TWO_PI * (random(1.2,randomizer));
      var v = p5.Vector.fromAngle(angle);
      var v2 = createVector(Math.sin(y * random(1,randomizer2)) * (random(1.5,randomizer)), Math.cos(x * random(1,randomizer2)) * random(1.5,randomizer));
      //var v = createVector(0, 0);
      var pushX = (-1 + (2 * x)/(cols-1))/2;
      var pushY = (-1 + (2 * y)/(rows-1))/2;
      var pushVec = createVector(pushX, pushY);
      v.add(pushVec);
      if (newField.generate)
        v.add(v2);
      v.setMag(0.6);

      flowField[index] = v;
      xoff +=inc;
    }
    yoff +=inc;
  }
}

function Particle(){
  this.isRespawning = false;
  this.spawnpos = createVector(floor(width/2), floor(height/2));
  this.pos = this.spawnpos.copy();
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  this.maxspeed = 1.75;
  this.prePos = this.pos.copy();
  this.red = 100;
  this.green = 100;
  this.blue = 100;
  this.initialShot = false;
  this.shotBy = 0;
  this.colored = false;
  this.spawnacc = createVector(0,0);

  this.update = function(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.applyForce = function(force){
    this.acc.x = this.spawnacc.x;
    this.acc.y = this.spawnacc.y;
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
    if (this.shotBy == 0) {
      this.red = 255;
      this.green = 170;
      this.blue = 0;
      this.colored = true;
    }
    else if (this.shotBy == 1) {
      this.red = 100;
      this.green = 0;
      this.blue = 255;
      this.colored = true;
    }
    else if (this.shotBy == 2) {
      this.red = 255;
      this.green = 20;
      this.blue = 255;
      this.colored = true;
    }
    else if (this.shotBy == 3) {
      this.red = 255;
      this.green = 0;
      this.blue = 0;
      this.colored = true;
    }
  }

  this.updatePrev = function(){
    this.prePos.x = this.pos.x; this.prePos.y = this.pos.y;
  }

  this.edges = function(){
    if(this.pos.x>width || this.pos.x<0 || this.pos.y<0 || this.pos.y>height){
      this.pos.x = this.spawnpos.x;
      this.pos.y = this.spawnpos.y;
      this.acc.mult(0);
      this.vel.mult(0);
      this.colored = false;
      this.updatePrev();
      particleAmount += -1;
      if (aCannonShooting == true){
        this.isRespawning = true;
      }
      else{
        this.isRespawning = false;
      }
    }
  }

  this.follow = function(vectors){
    var x = floor(this.pos.x/scl);//position in relationship to scale "vector" unit or grid"
    var y = floor(this.pos.y/scl);
    var index = x+y*cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.setAcc = function(){
    if (this.pos.x == floor(width/2) && this.pos.y == floor(height/2)){
      if (isShooting.bc == true) {
        if (this.colored == false){
          this.shotBy = 0;
        }
        this.spawnacc.x = random(-1,1);
        this.spawnacc.y = 0.5;
        this.acc.x = random(-1,1);
        this.acc.y = 0.5;
      }
      else if (isShooting.tc == true) {
        if (this.colored == false){
          this.shotBy = 1;
        }
        this.spawnacc.x = random(-1,1);
        this.spawnacc.y = -0.5;
        this.acc.x = random(-1,1);
        this.acc.y = -0.5;
      }
      else if (isShooting.lc == true) {
        if (this.colored == false){
          this.shotBy = 2;
        }
        this.spawnacc.x = -0.5;
        this.spawnacc.y = random(-1,1);
        this.acc.x = -0.5;
        this.acc.y = random(-1,1);
      }
      else if (isShooting.rc == true) {
        if (this.colored == false){
          this.shotBy = 3;
        }
        this.spawnacc.x = 0.5;
        this.spawnacc.y = random(-1,1);
        this.acc.x = 0.5;
        this.acc.y = random(-1,1);
      }
    }
    this.spawnacc.setMag(1);

    if (aCannonShooting == true){
      this.isRespawning = true;
      if (this.initialShot == false){
        this.initialShot = true;
      }
    }
    else {
      this.spawnacc.x = 0;
      this.spawnacc.y = 0;
    }
  }
}

function togglePlay(){
  play = !play;
}
