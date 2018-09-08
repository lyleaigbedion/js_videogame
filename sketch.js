//https://creative-coding.decontextualize.com/making-games-with-p5-play/
//http://freemusicarchive.org/genre/Chiptune/
//https://forum.processing.org/two/discussion/18320/making-something-run-only-once-in-draw-if-a-condition-is-satisfied
//http://p5play.molleindustria.org/docs/index.html

//Some global variables. For the game portion of the code
var gameOver;
var gameStarted;
var gameMusic = [];
var controls;

var player;
var player2;


var pX = 0;
var pY = 0;
var p2X = 0;

var p1health = 100.00;
var p1MAX_HEALTH = 100.00;
var p1rectWidth = 200.00;

var p2health = 100.00;
var p2MAX_HEALTH = 100.00;
var p2rectWidth = 200.00;

var p1within = false;
var p1done = false;

var p1hwithin = false;
var p1hdone = false;

var p2within = false;
var p2done = false;

var p2hwithin = false;
var p2hdone = false;


var projectiles;
var projectiles2;

var setupGame;

var catchProjectiles;

var wall1;
var wall2;
var wall3;
var wall4;

var square;
//var barrier1;
//var barrier2;
var barrierImage;
var plasma = [];
var lava = [];
var lavapit;
var plasmapit;
var healthPacks = [];
var soundEffects = [];
var playerscore = 0;
var player2score = 0;


var wallSounds = [];
var tankSound = [];
var shotSound = [];
var hitSound = [];

var tankImage;
var healthImage;
var moving;
var tankP1;
var ship;
var missle;
var roll;
var shot;
var backGnd;
var block;
//global variables for p5 serial port

var serial;          // variable to hold an instance of the serialport library
var portName = 'COM3';
var inData;




 //basic sprites and sounds
 function preload(){
 	
 	gameMusic = [loadSound("assets/azureflux.mp3"),loadSound("assets/starbox.mp3"), loadSound("assets/komiku.mp3")];
 	backGnd = loadImage("assets/sandbackground.png"); 
	tankP1 = loadImage("assets/tanksprite.png");
	ship = loadImage("assets/ship3.png");
	missile = loadImage("assets/missiles.png");
	shot = loadImage("assets/shot.png");
	roll = loadAnimation("assets/tank02.png","assets/tank08.png");
	block  = loadImage('assets/centerblock.png');
	lavapit = loadImage("assets/lavas.png");
	plasmapit = loadImage("assets/shipob.png");
	moving = loadAnimation("assets/barr1.png" ,"assets/barr2.png", "assets/barr4.png");
	healthImage = loadImage("assets/health.png");
	wallSounds = [ loadSound("assets/pop1.wav"), loadSound("assets/pop2.wav"), loadSound("assets/pop3.wav")];
	tankSound[0] = loadSound("assets/tankmove.wav");
	shotSound[0] = loadSound("assets/ChargeShot01.wav");
	hitSound[0] = loadSound("assets/ShotExplosionDirect00.wav");
	soundEffects = [loadSound("assets/lava.wav"), loadSound("assets/electric.wav"), loadSound("assets/health.wav")];
	controls = loadImage("assets/controls.png");
 }


function setup() {
	
    createCanvas(windowWidth, windowHeight);
    

    	


    //serialPort code
    serial = new p5.SerialPort();       // make a new instance of the serialport library
  //serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
 
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
    
     

	setupGame();

		lava = new Group();
		plasma = new Group();
		healthPacks = new Group();
	///hazzards for tank 

	 for (var i = 0; i < 8; i++) {
       var l = createSprite(
      random(100, width-100), random(100, height-100),
      50, 50);
			l.addImage('normal', lavapit);
			lava.add(l);
	}
/*
		///hazzards for ship...
			for (var i = 0; i < 5; i++) {
       var p = createSprite(
      random(100, width-100), random(100, height-100),
      50, 50);
			p.addImage('normal',plasmapit);
			plasma.add(p);
	}*/


		///health packs for both players...
				for (var i = 0; i < 8; i++) {
       var hp = createSprite(
      random(100, width-100), random(100, height-100),
      25, 25);
			hp.addImage('normal',healthImage);
			healthPacks.add(hp);
	}



// make it so Projectiles die at edges of screen
	// make them die when in contact with the terrain
	catchProjectiles1 = createSprite(width/2, -10, width, 20);
	wall1 = createSprite(width/2, -10, width, 20);
	
	catchProjectiles2 = createSprite(width/2, height+10, width, 20);
	wall2 = createSprite(width/2, height+10, width, 20);
	
	catchProjectiles3 = createSprite(-10, height/2 , 20, width);
	wall3 = createSprite(-10, height/2, 20, width);
	
	catchProjectiles4 = createSprite(width+10, height/2, 20, width);
	wall4 = createSprite(width+10, height/2, 20, width);
	
	
	catchProjectiles5 = createSprite(width/2, height/2, 100, 100);
	square = createSprite(width/2, height/2, 100, 100);
	square.addImage('normal', block);
	
	

	barrierImage = loadImage("assets/barr1.png");

	catchProjectiles6 = createSprite(width/4, height/2, 50, 50);
	//barrier1 = createSprite(width/4, height/2, 10, 60);
	catchProjectiles6.addAnimation('moving', moving);
	
	catchProjectiles7 = createSprite(width/1.33, height/2, 50, 50);
	//barrier2 = createSprite(width/1.33, height/2, 10, 60);
	catchProjectiles7.addAnimation('moving', moving);
	
	catchProjectiles8 = createSprite(width/2, height-200, 50, 50);
	catchProjectiles8.addAnimation('moving', moving);
    
	catchProjectiles9 = createSprite(width/2, 200, 50, 50);
	catchProjectiles9.addAnimation('moving', moving);
    tankImage = loadImage("assets/tank01.png");


	tankP1.rotation = -90;
	
	// set up player, start so facing up (-90 degrees)
	fill(150);
	player = createSprite(pX, pY, 40, 40);
    
	//adding sprite atributes
	
	player.addImage("normal", tankImage);
	player.addAnimation("rollf", "assets/tank02.png", "assets/tank08.png");
	player.addAnimation("rollb", "assets/tank08.png", "assets/tank02.png");
	player.addAnimation("rollr", "assets/tank02.png", "assets/tank08.png");
	player.addAnimation("rollL", "assets/tank02.png", "assets/tank08.png");
	player.rotation = -90;	// face player up
	
	
	
	
	player2 = createSprite(p2X, pY , 40, 40);
	player2.rotation = -90;	// face player up
	// adding sprite
	player2.addImage(ship);
 
	// a group of sprites is initialized like this
	projectiles = new Group();
	projectiles2 = new Group();
	
	
 // player physics
	player.maxSpeed = 10;
	player.friction = .02;
	
	player2.maxSpeed = 5;
	player2.friction = .0;

	
}


function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}


function serialEvent() {
  // read a string from the serial port:
  var inString = serial.readLine();
  // check to see that there's actually a string there:
  if (inString.length > 0 ) {
  // convert it to a number:
  inData = Number(inString);
  }

      
      
  }
function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  print('The serial port closed.');
}
//function still needs more work.
  function setupGame(){
	 gameStarted = false;
	 gameOver = false;
	 playerscore = 0;
	 player2score = 0;
     pX = 200;
     pY = height/2;
     p2X = width-200;       
  }
 
 
function draw() {
background(backGnd);
 console.log(inData);
	

	
	if(!gameOver) {
		if(!gameStarted) {
			// --- MENU ---
			textSize(25);
			/*fill(0);
			textAlign(CENTER, CENTER);
			text("  Press Enter to begin!", width/2, height/2);*/
			imageMode(CENTER);
			image(controls, width/2, height/2);
			gameMusic[2].stop();
 			if(gameMusic[0].isPlaying() == false){
 				gameMusic[0].loop();
 			}
			// if menu is active and player presses Enter
			if(keyWentDown("ENTER")) {
				gameStarted = true;
				gameMusic[0].stop();
				if(gameMusic[1].isPlaying() == false){
					gameMusic[1].loop();
				}
			}
		} else {
	
			
	
	
 
	
		// check for keys
		//firing weapon combo
		if(!keyDown("DOWN_ARROW") && !keyDown("UP_ARROW") && !keyDown("LEFT_ARROW") && !keyDown("RIGHT_ARROW") && keyDown("ENTER")) {
            player.rotation -= 0;
            
            if(keyWentDown(" ")){
                
		// create a new sprite on the fly
		var p = createSprite(player.position.x, (player.position.y), 10, 10);
		shotSound[0].play();
 
		// give projectile an upwards speed of 25 pixels,
		// and make it shoot in the same direction the player is facing
		p.setSpeed(25, player.rotation);
		p.addImage(missile);
		//p.debug = true;	//optional
 
		// add it to the group
		projectiles.add(p);
		p.rotation = player.rotation;
		}
	}
 
	
        //player2 firing
		if(mouseWentDown(LEFT)) {
			
		// create a new sprite on the fly
		var p = createSprite((player2.position.x), (player2.position.y), 10, 10);
		shotSound[0].play();
		
		// give projectile an upwards speed of 6 pixels,
		// and make it shoot in the same direction the player is facing
		p.setSpeed(6, player2.rotation);
		p.addImage(shot);
 
		
 
		// add it to the group
		projectiles2.add(p);
		

		
	}
	
 
 
		// rotate player when enter is held down--  moving left to right 
		if(keyDown("ENTER")){
            if(keyDown("a")) {
            player.rotation -= 5;

            }
        }
            
          if(keyDown("ENTER")){
            if(keyDown("d")) {
            player.rotation += 5;

            }
        }  
            
            

            
           //button combo, enter button prevents movement from the arrow keys
	
        if(!keyDown("ENTER")){    
            if(keyDown("UP_ARROW")) {
            
            player.changeAnimation("rollf");
            player.position.y -= 8;
            player.rotation = -90;
            
            }
            else{
            	player.changeAnimation("normal");
            }
        }
	
	    if(!keyDown("ENTER")){
            if(keyDown("DOWN_ARROW")) {
            player.position.y += 8;
            player.rotation = 90;
            player.changeAnimation("rollb");
            
            }
            
        }
	if(!keyDown("ENTER")){
            if(keyDown("RIGHT_ARROW") && !keyDown("DOWN_ARROW") &&  !keyDown("UP_ARROW")) {
            //player.position.x += 10;

            //player.rotation += .8;
            player.position.x += 8;
            player.rotation = 0;
            player.changeAnimation("rollr");
            }
        }
	
	if(!keyDown("ENTER")){
            if(keyDown("LEFT_ARROW") && !keyDown("DOWN_ARROW") &&  !keyDown("UP_ARROW")) {
            player.rotation = 180;
            player.position.x -= 8;
            player.changeAnimation("rollL");
           }
        }
	          

        		//electric barriers move around the square in the middle
				catchProjectiles6.attractionPoint(.1, square.position.x + 100, square.position.y - 200);
        		catchProjectiles7.attractionPoint(.1, square.position.x - 100, square.position.y + 200);
        		catchProjectiles8.attractionPoint(.1, square.position.x - 200, square.position.y + 100 );
        		catchProjectiles9.attractionPoint(.1, square.position.x + 200, square.position.y - 100)
	           	

        		//p2 movement follows the mouse
	           	player2.attractionPoint(.2, mouseX, mouseY);
	           

	           //ok super tricky, serial monitor polls data from arduino in order.
	           //because of this you cant take the data of the analog stick's x and y position separately 
	           // so in my arduino code I have the X-axis being read with analog values 0 - 1024 + an interger value of 2000
	           // I'd plan to implement the Y axis but I didn't find a compelling mechanic that wouldn't be too obtuse 
	           //(even though this is already bit obtuse....)
	           // the button on the analog stick is either 1 not pressed down or 0 pressed down
	           // I added that to the write function(similar to the print function) but with the caveat that when not pressed, 
	           // 1 would be 20000.
	           // with how the conditionals are setup, I have the button and X-axis mapped with no lag.

                if(inData >22600 && inData < 23100){
                	//testing player.position.x....
                	
                    player2.rotation +=9;
                }
	           if(inData <22400 && inData>19999){
                	//testing player.position.x....
                	
                    player2.rotation -=9;
                }

                //if (inData < 19999){
                //	cursor(CROSS);
					//down
                //}
                
				/*if (inData > 550 && inData<1100){
					player2.position.y += 10;
				}
					//up
				if (inData < 450){
					player2.position.y -= 10;
				}*/


	
	
	
	
	
	
	
	
	
	
	
	
 
		// check collisions, call playerHit functions if so
		// it fails sometimes...
	
		// if p2 hits p1
		if(player.overlap(projectiles2,playerHit)){
		player.overlap(projectiles2,playerHit);
		player2score++;
		p1health -= 10;
		
		
	}
		//p1 hits p2
		if(player2.overlap(projectiles,player2Hit)){
		player2.overlap(projectiles,player2Hit);
		playerscore++;
		p2health -=10;
	}

		//when player 1 comes in contact with lava
 		p1damage();
 		
 		
 		//when player 2 come in contact with electric barrier
 		p2damage();

 		//when both plays grab health...
 		p1heal();
 		p2heal();


 		//player2.collide(lava);
 		//player.collide(plasma);

		// catch Projectiles
		catchProjectiles1.overlap(projectiles, projectileCatch);
		catchProjectiles1.overlap(projectiles2, projectileCatch);
		
		catchProjectiles2.overlap(projectiles, projectileCatch);
		catchProjectiles2.overlap(projectiles2, projectileCatch);
		
		catchProjectiles3.overlap(projectiles, projectileCatch);
		catchProjectiles3.overlap(projectiles2, projectileCatch);
		
		catchProjectiles4.overlap(projectiles, projectileCatch);
		catchProjectiles4.overlap(projectiles2, projectileCatch);
		
		catchProjectiles5.overlap(projectiles, projectileCatch);
		catchProjectiles5.overlap(projectiles2, projectileCatch);
		
		catchProjectiles6.overlap(projectiles, projectileCatch);
		//catchProjectiles6.overlap(projectiles2, projectileCatch);
		
		catchProjectiles7.overlap(projectiles, projectileCatch);
		//catchProjectiles7.overlap(projectiles2, projectileCatch);

		catchProjectiles8.overlap(projectiles, projectileCatch);
		//catchProjectiles8.overlap(projectiles2, projectileCatch);

		catchProjectiles9.overlap(projectiles, projectileCatch);
		//catchProjectiles9.overlap(projectiles2, projectileCatch);
		
		 player.overlap(healthPacks, getHealth);
		 player2.overlap(healthPacks, getHealth);
		
		//collision detection
		// thing.displace(thing) will push (thing) away
		player.collide(wall1);
		player.collide(wall2);
		player.collide(wall3);
		player.collide(wall4);
		player.collide(square);
		//player.collide(barrier1);
		//player.collide(barrier2);
		player.displace(player2);
	
		player2.collide(wall1);
		player2.collide(wall2);
		player2.collide(wall3);
		player2.collide(wall4);
		player2.collide(square);
		//player2.collide(barrier1);
		//player2.collide(barrier2);
		player2.displace(player);
			
		//
		catchProjectiles6.displace(player2);
		catchProjectiles7.displace(player2);
		catchProjectiles8.displace(player2);
		catchProjectiles9.displace(player2);



		drawSprites();
	
		//healthbars
			//p1
		 if (p1health < 25)
		  {
		    fill(255, 0, 0);
		  }  
		  else if (p1health < 50)
		  {
		    fill(255, 200, 0);
		  }
		  else
		  {
		    fill(0, 255, 0);
		  }

			noStroke();
		  // Get fraction 0->1 and multiply it by width of bar
		  var p1drawWidth = (p1health / p1MAX_HEALTH) * p1rectWidth;
		  rect(25, 25, p1drawWidth, 20);
		  
		  // Outline
		  stroke(0);
		  noFill();
		  rect(25, 25, p1rectWidth, 20);

		  	//p2
		  	if (p2health < 25)
		  {
		    fill(255, 0, 0);
		  }  
		  else if (p2health < 50)
		  {
		    fill(255, 200, 0);
		  }
		  else
		  {
		    fill(0, 255, 0);
		  }

			noStroke();
		  // Get fraction 0->1 and multiply it by width of bar
		  var p2drawWidth = (p2health / p2MAX_HEALTH) * p2rectWidth;
		  rect(windowWidth - 225, 25, p2drawWidth, 20);
		  
		  // Outline
		  stroke(0);
		  noFill();
		  rect(windowWidth - 225, 25, p2rectWidth, 20);
		


		//Score keeping...
		
		textSize(30);
		fill(0,0,255);
		text("P2", windowWidth - 280, 45);
	
	
		//Player1 text
		fill(0,255,0);
		text("P1", 250, 45);

	
		if(playerscore == 10){
			
		gameOver = true;
		
		}

		//cursor disappears if tank is low on hp
		//player with arduino must hold down the analog stick button for it
		//to reappear but then they can't aim :p
		if(player2score > 5 && inData > 19999){
			noCursor();

		} else{
			cursor(CROSS);
		}
		if(player2score == 10){
		gameOver = true;
		
		
		}
		
		
	}
 
	} else {
		if(player2score == 10){
		// --- DISPLAY GAME OVER TEXT PLAY ENDGAME MUSIC ---
		
		gameMusic[1].stop();
		if(gameMusic[2].isPlaying() == false){
				gameMusic[2].loop();
		}	
		stroke(0);	
		textSize(50);
		textAlign(CENTER, CENTER);
		text("GAME OVER Team 2 Wins! \n Hey Team 1, you can hide behind the barriers to collect yourself.", width/2, height/2);
		}
		if(playerscore == 10){
		// --- DISPLAY GAME OVER TEXT  ---

		gameMusic[1].stop();
		if(gameMusic[2].isPlaying() == false){
				gameMusic[2].loop();
		}
		stroke(0);
		textSize(50);
		textAlign(CENTER, CENTER);
		text("GAME OVER Team 1 Wins! \n Hey Team 2, do you know that holding down the joystick will make the cursor reappear?", width/2, height/2);
		}
		if(keyWentDown("r")) {
			//still doesnt work needs more dev time 
			setupGame();
		}	
	}
	
}
 
 

 
// this is a little tricky--
// the incoming arguments are the objects in question, so since i said
// catchProjectiles.overlap(projectiles, functionName)
// that means that catchProjectiles is the first argument (catcher)
// and projectiles is the second (projectile)
function projectileCatch(catcher, projectile) {
	projectile.remove();
	//sound effect for hitting a wall
	var randWall = int(random(wallSounds.length));
	wallSounds[randWall].play();
}
 

function playerHit(player, projectile) {
	
	projectile.remove();

	hitSound[0].play();
	
	
}
function player2Hit(player2, projectile) {
	projectile.remove();
	
	hitSound[0].play();
	
}
//damage function for when the player crosses over 
//an obstacle.
function p1damage(){
	if(player.overlap(lava)){
 			p1within = true;
		
 		}else{
 			p1within = false;
 			p1done = false
 		}


 	if(p1within && !p1done){
 		if(soundEffects[0].isPlaying() == false){
				soundEffects[0].play();
		}

 		p1done = true;
 		player2score++;
		p1health -= 10;
 	}
}

//health functions similar to damage function 
//but they are "collected" and disappear. 

function p1heal(){
	if(player.overlap(healthPacks)){
 			p1hwithin = true;
		
 		}else{
 			p1hwithin = false;
 			p1hdone = false
 		}
 	if(p1hwithin && !p1hdone){
 		if(soundEffects[2].isPlaying() == false){
				soundEffects[2].play();
		}
		p1hdone = true;
 		if(player2score != 0 ){
 		player2score--;
		p1health += 10;
			}
 	}
}

function getHealth(player, healthPacks) {
  healthPacks.remove();
 
}

function getHealth(player2, healthPacks) {
  healthPacks.remove();
 
}


function p2damage(){
	if(player2.overlap(catchProjectiles6) || player2.overlap(catchProjectiles7) || player2.overlap(catchProjectiles8) || player2.overlap(catchProjectiles9)){
 			p2within = true;
		
 		}else{
 			p2within = false;
 			p2done = false
 		}
 	if(p2within && !p2done){
 		if(soundEffects[1].isPlaying() == false){
				soundEffects[1].play();
		}
 		p2done = true;	
 		playerscore++;
		p2health -= 10;
			
 	}
}

function p2heal(){
	if(player2.overlap(healthPacks)){
 			p2hwithin = true;
		
 		}else{
 			p2hwithin = false;
 			p2hdone = false
 		}
 	if(p2hwithin && !p2hdone){
 		if(soundEffects[2].isPlaying() == false){
				soundEffects[2].play();
		}
 		p2hdone = true;
 		if(playerscore != 0){
 		playerscore--;
		p2health += 10;
			}
 	}
}