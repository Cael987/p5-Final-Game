let hiro;
let badGuys = [];
let badGuyColors = ["red", "blue", "green", "yellow",]; 
let score = 0;
let bullets = [];
let timer = 0;
let spawnInterval = 180
let lastSpawn = 0
let timer1 =0;
let PowerUps= [];
let powerUpInterval = 400;
let lastPowerUp = 0;
let timer2= 0;
let iceActive = false;
let fullAutoActive = false;
let doubleShotActive = false;
let iceLevel = 0;         
let fullAutoLevel = 0;    
let doubleShotLevel = 0;
let gameState = "title"; 
let scene;
let music;
let musicPlayed = false;


function preload() {
  scene = loadImage("5376788.jpg");
  music = loadSound("1 minute dance music.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  hiro = new Hero();

  for (let i = 0; i < 4; i++) {
    badGuys.push(new BadGuy());
  }
}


function draw() {
  Music();
if (gameState === "title") {
    background(50)
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(100);
    text("Block Buster", width/2, height/4);

    textSize(20);
    text("Instructions:", width /2, height /2-60);
    text("1. Move the cannon with your mouse.", width/2, height/2 -30);
    text("2. Collect rectangle shaped power ups.", width/ 2, height/2);
    text("3. Dont let circles touch the cannon.", width / 2, height / 2 + 30);
    text("4. Survive for 30 seconds.", width / 2, height / 2 + 60);
    text("Click to start!", width / 2, height / 2 + 100);
    return;
  }
  
  if (gameState === "gameover") {
    fill("red");
    textAlign(CENTER, CENTER);
    textSize(100);
    text("Game Over", width / 2, height / 4);

    textSize(20);
    text("Click to play again!", width / 2, height / 2 + 50);

    return;
  }
  
   if (gameState === "win") {
    fill("red");
    textAlign(CENTER, CENTER);
    textSize(100);
    text("You Win", width / 2, height / 4);

    textSize(20);
    text("Click to play again!", width / 2, height / 2 + 50);

    return;
  }
  
  if (gameState === "playing") {
  image(scene, 0, 0,width,height);
  
  console.log (powerUpInterval)
  fill("white");
  text(score,width/50,height/40);
  
  timer2 ++
  
  if (timer2 - lastPowerUp >= powerUpInterval) {
  PowerUps.push(new PowerUp()); 
  lastPowerUpTime = timer2; 
  timer2 = 0
  }
    
  for (let i = PowerUps.length - 1; i >= 0; i--) {
  PowerUps[i].display();
  PowerUps[i].fall();
    
  if (PowerUps[i] != null){
    if (dist(hiro.x, hiro.y, PowerUps[i].x, PowerUps[i].y) < (hiro.diameter + PowerUps[i].diameter) / 2) {
    let powerUpType = PowerUps[i].type;
    PowerUps.splice(i, 1); 
    
      if (powerUpType === "ice"){
    iceActive = true;
    iceLevel++;
    }
      if (powerUpType === "fullAuto"){
    fullAutoActive = true;
    fullAutoLevel++;
    }
      if (powerUpType === "doubleShot"){
    doubleShotActive = true;
    doubleShotLevel++;
    }
    console.log("Power-up collected!");
  }

  if (PowerUps[i] != null && PowerUps[i].y > height) {
    PowerUps.splice(i, 1);
    }
  }
}
  
  
  for (let i = bullets.length - 1; i >= 0; i--) {
  bullets[i].display(); 
  bullets[i].move(); 

  if (bullets[i].y < 0) {
    bullets.splice(i, 1); 
  }
}
  
  //Spawn Interval
timer1 ++
  if(timer1-lastSpawn >= spawnInterval){
    badGuys.push(new BadGuy());
    lastSpawn = timer1
    if(spawnInterval > 120){
      spawnInterval -= 10  
    }
    if(spawnInterval > 30){
      spawnInterval -= 5
    }
     if(spawnInterval <= 30){
     gameState = "win"
      spawnInterval -= 1
    }
  }
  console.log(spawnInterval)

timer ++
  
  
  //SHOOTING AND POWERUPS
 
  let fireInterval = 6 - (2 * fullAutoLevel)
    if (timer/2 >= fireInterval) {
  bullets.push(new Bullet(hiro.x, hiro.y));
  
      for (let i = 1; i <= doubleShotLevel; i++) {
    bullets.push(new Bullet(hiro.x - 10 * i, hiro.y));
    bullets.push(new Bullet(hiro.x + 10 * i, hiro.y));
  }

  timer = 0;
}

  hiro.display();
  hiro.move();

  
for (let i = badGuys.length - 1; i >= 0; i--) {
  badGuys[i].display();
  badGuys[i].fall();
  
  
  //ICE POWER UP
  if (iceActive === true){
    let slowFactor = 1 - (0.1 * iceLevel);
    badGuys[i].ySpeed = badGuys[i].originalYSpeed * slowFactor;
    badGuys[i].origionalYSpeed = badGuys[i].ySpeed
  }
  
  
    if (dist(hiro.x, hiro.y, badGuys[i].x, badGuys[i].y) <     (hiro.diameter + badGuys[i].diameter) / 2) {
    gameState = "gameover";
}
  
  for (let b = bullets.length - 1; b >= 0; b--) {  
  if (badGuys[i] != null){
    if (dist(bullets[b].x, bullets[b].y, badGuys[i].x, badGuys[i].y) <   badGuys[i].diameter / 2) {
      let damage = spawnInterval/25
      badGuys[i].diameter -= damage;
      bullets.splice(b, 1);
    if (badGuys[i].diameter<=40) {
  badGuys.splice(i,1);
  score++
            }
          } 
        }
      } 
    }
  }
}


class BadGuy {
  constructor() {
    this.x = random(width);
    this.y = random(-200, -50); 
    this.diameter = random(50, 100);
    this.ySpeed = random(2, 6);
    this.originalYSpeed = this.ySpeed;
    this.colors = int(random(badGuyColors.length)); 
  }

  display() {
    fill(badGuyColors[this.colors]);
    ellipse(this.x, this.y, this.diameter);
  }

  fall() {
    this.y += this.ySpeed;

    if (this.y > height) {
      this.y = 0
      this.x = this.x + random(-100,100);
    } 
  } 
}


class Hero {
  constructor() {
    this.x = mouseX;
    this.y = windowHeight;
    this.diameter = 75;
  }

  display() {
    fill("white");
    ellipse(this.x, this.y, this.diameter);
  }

  move() {
    this.x = mouseX;
    this.y = windowHeight;
  }
}

class Bullet {
constructor(x,y) {
  this.x = x
  this.y = y
  this.speed = 10
}
display(){
  fill("yellow");
  ellipse(this.x,this.y,10);
}
move() {
    this.y -= this.speed;
  } 
}

class PowerUp {
  constructor() {
    this.x = random(width);
    this.y = 0 
    this.diameter = 50
    this.ySpeed = random(2, 6);
    this.type = random(["ice", "fullAuto", "doubleShot"]);
  }

  display() {
    if (this.type === "ice") fill("cyan");
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, this.diameter, this.diameter / 2);
    if (this.type === "fullAuto") fill("purple");
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, this.diameter, this.diameter / 2);
    if (this.type === "doubleShot") fill("#F39C12");
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, this.diameter, this.diameter / 2);
  }

  fall() {
    this.y += this.ySpeed;
  } 
}

function mousePressed() {
  if (gameState === "title") {
    gameState = "playing"; 
  } else if (gameState === "gameover") {
    resetGame();
    gameState = "title";
   } else if (gameState === "win") {
    resetGame();
    gameState = "title";
  }
}
  


function resetGame() {
  score = 0;
  badGuys = [];
  bullets = [];
  PowerUps = [];
  spawnInterval = 200; 
  lastSpawn = 0;
  iceLevel = 0;         
  fullAutoLevel = 0;    
  doubleShotLevel = 0;

  for (let i = 0; i < 5; i++) {
    badGuys.push(new BadGuy());
  }
}


function Music(){
 if (musicPlayed === false){
  music.play();
  musicPlayed = true;
 }
}






