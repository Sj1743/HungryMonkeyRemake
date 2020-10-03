//Global Variables
var monkey, monkeyRunning, monkeyStanding;
var invisibleGround;
var banana, bananaImage;
var rock, rockImage;
var backdrop, backgroundImage;
var bananaGroup, rockGroup;
var survivalTime, bananasEaten, score;
var gameState;
var PLAY;
var END;
var HIT;

function preload() {

  //images for background, banana and rock
  backgroundImage = loadImage("images/jungle2.jpg");
  bananaImage = loadImage("images/Banana.png");
  rockImage = loadImage("images/stone.png");
  monkeyStanding = loadImage("images/Monkey_01.png");

  //animation for running monkey
  monkeyRunning = loadAnimation("images/Monkey_01.png", "images/Monkey_02.png", "images/Monkey_03.png", "images/Monkey_04.png",
   "images/Monkey_05.png", "images/Monkey_06.png", "images/Monkey_07.png", "images/Monkey_08.png", "images/Monkey_09.png", "images/Monkey_10.png");

}


function setup() {

  //create canvas
  createCanvas(500, 300);

  //initialising variables, creating sprites, assigning properties
  score = 0;
  bananasEaten = 0;
  survivalTime = 0;
  PLAY = 1;
  HIT = 2;
  END = 0;

  //ground
  invisibleGround = createSprite(300, 300, 600, 10);
  invisibleGround.visible = false;
  invisibleGround.velocityX = 3;

  //background image
  backdrop = createSprite(250, 150, 0, 0);
  backdrop.addImage("jungle background", backgroundImage);

  //monkey
  monkey = createSprite(70, 290, 0, 0);
  monkey.addAnimation("monkey", monkeyRunning);
  monkey.scale = 0.1;

  //create groups
  bananaGroup = createGroup();
  rockGroup = createGroup();

  //text preferences
  textAlign(CENTER, CENTER);
  textSize(15);
  stroke("white");
  fill("white");

  //initialise gameState to PLAY
  gameState = PLAY;

}


function draw() {

  //background
  background(255);

  //camera
  camera.position.x = monkey.x;
  camera.position.y = displayHeight/6;

  //prevent monkey from falling off screen
  monkey.collide(invisibleGround);

  if (gameState === PLAY) {

    //make monkey move forward
    monkey.velocityX = 3;

    //make backdrop move 
    backdrop.velocityX = -3;
    if (backdrop.x < camera.position.x - 250) {
      backdrop.x = camera.position.x;
    }

    //monkey jumps when space pressed
    if (keyDown("space") && monkey.isTouching(invisibleGround)) {
      monkey.velocityY = -20;
    }
    //gravity for monkey
    monkey.velocityY = monkey.velocityY + 1;

    //make backdrop move
    backdrop.velocityX = 3;

    //if monkey touches banana, destroy and add to bananasEaten
    for (var i = 0; i < bananaGroup.length; i++) {
      if (monkey.isTouching(bananaGroup[i])) {
        bananaGroup[i].destroy();
        bananasEaten++;
        score += 2;
      }
    }

    //first time monkey touches rock, reset score and size
    for (var a = 0; a < rockGroup.length; a++) {
      if (monkey.isTouching(rockGroup[a])) {
        score = 0;
        monkey.scale = 0.1;
        gameState = HIT;
        rockGroup.destroyEach();
      }
    }

    //increment survivalTime
    survivalTime = Math.ceil(frameCount / frameRate());

    //spawn bananas and rocks
    spawnBananas();
    spawnRocks();

    //increase size of monkey every 10 scores
    switch (score) {
      case (10):
        monkey.scale = 0.12;
        break;
      case (20):
        monkey.scale = 0.14;
        break;
      case (30):
        monkey.scale = 0.16;
        break;
      case (40):
        monkey.scale = 0.18;
        break;
      case (50):
        monkey.scale = 0.2;
        break;
      default:
        break;
    }

  }else if (gameState === HIT) {

    //monkey jumps when space pressed
    if (keyDown("space") && monkey.isTouching(invisibleGround)) {
      monkey.velocityY = -20;
    }
    //gravity for monkey
    monkey.velocityY = monkey.velocityY + 1;

    //make ground move
    backdrop.velocityX = 3;
    
    //if monkey touches banana, destroy and add to bananasEaten
    for (var k = 0; k < bananaGroup.length; k++) {
      if (monkey.isTouching(bananaGroup[k])) {
        bananaGroup[k].destroy();
        bananasEaten++;
        score = score + 2;
      }
    }

    // second time monkey hits rock, end game
    if (monkey.isTouching(rockGroup)) {
      gameState = END;
    }
    //increment survivalTime
    survivalTime = Math.ceil(frameCount / frameRate());

    //spawn bananas and rocks
    spawnBananas();
    spawnRocks();

    //increase size of monkey every 10 scores
    switch (score) {
      case (10):
        monkey.scale = 0.12;
        break;
      case (20):
        monkey.scale = 0.14;
        break;
      case (30):
        monkey.scale = 0.16;
        break;
      case (40):
        monkey.scale = 0.18;
        break;
      case (50):
        monkey.scale = 0.2;
        break;
      default:
        break;
    }

  } else if (gameState === END) {

    //change backdrop, display game over message
    background("black");
    text("GAME OVER!", monkey.x, 150);

    monkey.addImage("monkey", monkeyStanding);

    //never destroy bananas and rocks
    bananaGroup.setLifetimeEach(-1);
    rockGroup.setLifetimeEach(-1);

    //stop moving game objects
    backdrop.velocityX = 0;
    monkey.velocityY = 0;
    bananaGroup.setVelocityXEach(0);
    rockGroup.setVelocityXEach(0);
  }

  //draw all sprites
  drawSprites();

  //display bananasEaten and survivalTime
  text("Bananas eaten : " + bananasEaten, monkey.x-170, 25);
  text("Survival time : " + survivalTime, monkey.x+100, 25);
  text("Score : " + score, monkey.x+200, 25);

}


//spawn bananas every 80 frames
function spawnBananas() {

  //if(gameState =! END){
      if (frameCount % 80 === 0) {
        banana = createSprite(510, 150, 0, 0);
        banana.x = camera.position.x + 200;
        banana.y = Math.round(random(100, 200));
        banana.addImage("banana", bananaImage);
        banana.scale = 0.05;
        bananaGroup.add(banana);
        banana.lifetime = 200;
      }
  //}
}


//spawn rocks every 120 frames
function spawnRocks() {

  //if(gameState =! END){
    //for(var j = 500; j >= 0; j+= 500){
      if (frameCount > 100 && frameCount % 120 === 0) {
        rock = createSprite(510, 275, 0, 0);
        rock.x = camera.position.x + 200;
        rock.addImage("rock", rockImage);
        rock.scale = 0.2;
        rockGroup.add(rock);
        rock.lifetime = 200;
        rock.setCollider("circle", 0, 0, 5);
      }
    //}
  //}
}

