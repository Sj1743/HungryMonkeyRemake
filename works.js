//Global Variables
var monkey, monkeyRunning, monkeyStanding;
var invisibleGround;
var banana, bananaImage;
var rock, rockImage;
var backdrop, backgroundImage;
var bananaGroup, rockGroup;
var survivalTime, score;
var gameState;
var PLAY;
var END;
var count;

function preload() {

  //images for background, banana and rock

  backgroundImage = loadImage("images/jungle2.jpg");
  bananaImage = loadImage("images/Banana.png");
  rockImage = loadImage("images/stone.png");
  monkeyStanding = loadImage("images/Monkey_01.png");

  //animation for running monkey
  monkeyRunning = loadAnimation("images/Monkey_01.png",
    "images/Monkey_02.png", "images/Monkey_03.png", "images/Monkey_04.png", "images/Monkey_05.png", "images/Monkey_06.png", "images/Monkey_07.png", "images/Monkey_08.png", "images/Monkey_09.png", "images/Monkey_10.png");

}


function setup() {

  //create canvas
  createCanvas(500, 300);

  //initialising variables, creating sprites, assigning properties
  score = 0;
  count = 0;
  survivalTime = 0;
  PLAY = 1;
  END = 0;

  invisibleGround = createSprite(300, 300, 600, 10);
  invisibleGround.visible = false;

  backdrop = createSprite(250, 150, 0, 0);
  backdrop.addImage("jungle background", backgroundImage);

  monkey = createSprite(70, 290, 0, 0);
  monkey.addAnimation("monkey", monkeyRunning);
  monkey.scale = 0.1;
  monkey.velocityX = 3;

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

  background(255);

  camera.position.x = monkey.x;
  camera.position.y = height / 2;
  invisibleGround.x = camera.position.x;


  //reset ground

  if (gameState === PLAY) {
    //make ground move
    backdrop.velocityX = -3;
    if (backdrop.x < camera.position.x - 250) {
      backdrop.x = camera.position.x;
    }
    //monkey jumps when space pressed
    if (keyDown("space") && monkey.isTouching(invisibleGround)) {
      monkey.velocityY = -20;
    } else {
      monkey.collide(invisibleGround);
    }
    //gravity for monkey
    monkey.velocityY = monkey.velocityY + 1;



    if (bananaGroup.isTouching(monkey)) {
      score = score + 1;
      bananaGroup.destroyEach();
    }

    if (rockGroup.isTouching(monkey)) {
      count = count + 1;
      rockGroup.destroyEach();
    }


    //increment survivalTime
    survivalTime = Math.ceil(frameCount / frameRate());

    //spawn bananas and rocks
    spawnBananas();
    spawnRocks();

    //increase size of monkey every 10 scores
    switch (score) {
      case 10:
        monkey.scale = 0.12;
        break;
      case 20:
        monkey.scale = 0.14;
        break;
      case 30:
        monkey.scale = 0.16;
        break;
      case 40:
        monkey.scale = 0.18;
        break;
      case 50:
        monkey.scale = 0.2;
        break;
      default:
        break;
    }

    switch (count) {
      case 1: monkey.scale = 0.05;
        break;
      case 2: gameState = END;
        break;
      default: break;
    }

  } else if (gameState === END) {

    //stop moving each game object
    backdrop.velocityX = 0;
    monkey.velocityY = 0;
    monkey.addImage("monkey", monkeyStanding);
    bananaGroup.setVelocityXEach(0);
    rockGroup.setVelocityXEach(0);

    //never destroy bananas and rocks
    bananaGroup.setLifetimeEach(-1);
    rockGroup.setLifetimeEach(-1);

  }

  //draw all sprites
  drawSprites();

  //display score and survivalTime
  text("Survival time : " + survivalTime, camera.position.x + 100, 25);
  text("Score : " + score, camera.position.x - 50, 25);
  text("Count : " + count, camera.position.x - 150, 25);

}


function spawnBananas() {

  if (frameCount % 80 === 0) {
    banana = createSprite(510, 150, 0, 0);
    banana.x = camera.position.x + 200;
    banana.y = Math.round(random(100, 200));
    banana.addImage("banana", bananaImage);
    banana.scale = 0.05;
    banana.velocityX = -3;
    bananaGroup.add(banana);
    banana.lifetime = 175;
  }
}


function spawnRocks() {

  if (frameCount > 100 && frameCount % 120 === 0) {
    rock = createSprite(510, 275, 0, 0);
    rock.x = camera.position.x + 200;
    rock.addImage("rock", rockImage);
    rock.scale = 0.2;
    rock.velocityX = -3;
    rockGroup.add(rock);
    rock.lifetime = 175;
    rock.setCollider("circle", 0, 0, 5);
  }
}