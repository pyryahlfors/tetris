(function(){
	// Tetris
	var tetris = function(){
		this.gameFieldWidth = 9;		// Width of the game field (original tetris has 20x10, so lets use those)
		this.gameFieldHeight = 19;		// Height of the game field
		this.blockArrayWidth = 3;		// Size of block container
		this.blockArrayHeight = 3;		// Size of block container
		this.line = 0;					// Top position of dropping piece
		this.leftPos = 3;				// Left position of dropping piece
		this.score = 0;					// Score
		this.totalLines	 = 0;			// Lines cleared
		this.dropRowPossible = 0;
		this.rotation = 0;				// Rotation of dropping piece
		this.gamespeed = 500;			// Game speed in milliseconds
		this.speedLevel = 500;
		this.defaults = {
			speed: 500,
			score: 0,
			totalLines: 0,
			line : 0
		}
		this.nextBlock = false;			// not implemented yet
		this.paused = false;
// Themes
		this.colors = {
			/* black and white. And red! */
			'blackAndWhite' : [
				[255,40,55,1],
				[255,255,255,0.10],
				[255,255,255,0.15],
				[255,255,255,0.20],
				[255,255,255,0.25],
				[255,255,255,0.30],
				[255,255,255,0.35]
			],
			'vauhtiVille' : [
				[46,204,113,1],
				[52,152,219,1],
				[26,188,156,1],
				[241,196,15,1],
				[30,126,34,1],
				[231,76,60,1],
				[155,89,182,1]
			]
		};
		this.theme = 'blackAndWhite';

// Test touch support
		this.touchEvent = (function(){
					var testTouch = document.createElement("DIV");
					testTouch.setAttribute('ontouchstart', 'return;');
					var isTouchDevice = (typeof testTouch.ontouchstart == 'function' && window.screenX === 0) ? true : false;
					return (isTouchDevice) ? 'touchstart' : 'mousedown';
					})();
		if(this.touchEvent === 'touchstart'){document.body.addEventListener('touchmove', function(e){e.preventDefault();}, false);}

// Check resolution and add eventlistener for orientation change
		var testY;
		var thisGameContainer = document.querySelector('.page.tetris .gamefield-container').getBoundingClientRect();
		var isMobile = (function() {
			var check = false;
			(function(a){
				if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;
			})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
		})();
		// Make sure always use portrait ratio for game field
		if(isMobile){
			var maxHeight = (thisGameContainer.height > thisGameContainer.width) ? thisGameContainer.height : thisGameContainer.width;
			testY = Math.floor(maxHeight/(this.gameFieldHeight+1));
		}

		else {
			testY = Math.floor(thisGameContainer.height/(this.gameFieldHeight+1));
		}

		this.blockHeight = testY;
		this.blockWidth = testY;

		this.blocks = [
		// ████
			[[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
			[0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0]],

		// ██
		// ██
			[[0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0]],

		//  ██
		// ██
			[[0,0,0,0,0,3,3,0,3,3,0,0,0,0,0,0],
			[0,3,0,0,0,3,3,0,0,0,3,0,0,0,0,0]],

		// ██
		//  ██
			[[0,0,0,0,0,4,4,0,0,0,4,4,0,0,0,0],
			[0,0,4,0,0,4,4,0,0,4,0,0,0,0,0,0]],

		// ███
		//   █
			[[0,5,5,0,0,5,0,0,0,5,0,0,0,0,0,0],
			[0,5,5,5,0,0,0,5,0,0,0,0,0,0,0,0],
			[0,0,5,0,0,0,5,0,0,5,5,0,0,0,0,0],
			[0,5,0,0,0,5,5,5,0,0,0,0,0,0,0,0]],

		//   █
		// ███
			[[0,6,6,0,0,0,6,0,0,0,6,0,0,0,0,0],
			[0,0,0,6,0,6,6,6,0,0,0,0,0,0,0,0],
			[0,6,0,0,0,6,0,0,0,6,6,0,0,0,0,0],
			[0,6,6,6,0,6,0,0,0,0,0,0,0,0,0,0]],

		//  █
		// ███
			[[0,7,0,0,7,7,7,0,0,0,0,0,0,0,0,0],
			[0,7,0,0,0,7,7,0,0,7,0,0,0,0,0,0],
			[7,7,7,0,0,7,0,0,0,0,0,0,0,0,0,0],
			[0,7,0,0,7,7,0,0,0,7,0,0,0,0,0,0]]];

		// Create container
		this.container = document.querySelector('.tetris');
		this.scoreContainer = document.querySelector('.tetris-score-container SPAN');
		this.linesContainer = document.querySelector('.tetris-lines-container SPAN');
		this.levelContainer = document.querySelector('.tetris-level-container SPAN');

		// Create touch points container
		this.touchPointsContainer = document.querySelector('.tetris-touch-point-container');
		this.touchCTRLRight = document.querySelector('.tetris-touch-control-right');
		this.touchCTRLLeft = document.querySelector('.tetris-touch-control-left');
		this.touchCTRLDrop = document.querySelector('.tetris-touch-control-drop');
		this.touchCTRLRotate = document.querySelector('.tetris-touch-control-rotate');

// Set up canvas
		this.levelWidth = this.blockWidth*(this.gameFieldWidth+1);		// level width in pixels
		this.levelHeight = this.blockHeight*(this.gameFieldHeight+1);	// level height in pixels
		this.canvasContainer = document.querySelector('CANVAS');
		this.canvasContainerCTX = this.canvasContainer.getContext('2d');
		this.canvasContainer.setAttribute("WIDTH", this.levelWidth);
		this.canvasContainer.setAttribute("HEIGHT", this.levelHeight);
		};

	tetris.prototype.resetGamefield = function(){
		var i = 0;
		// Create arrays for game state and set everything to 0
		this.combinedField	= [];	// Combined [blockfield + gamefield] (for 'collision detect')
		this.blockfield	= [];		// Contains single block (current falling block)
		this.gameField	= [];		// Contains all dropped blocks

		this.gamespeed = this.defaults.speed;
		this.score = 0;
		this.totalLines = 0;
		this.leftPos = 3;
		this.dropRowPossible = 0;
		this.line = -2*(this.gameFieldWidth+1); // Start from below the gamefield

		for(var y=0;y<=this.gameFieldHeight;y++) {
			for(var x=0; x<=this.gameFieldWidth;x++) {
				this.gameField[i] = 0;
				this.blockfield[i] = 0;
				this.combinedField[i] = 0;
				i++;
				}
			}
		this.drawGameField();
		this.clearTempArray();
		};

	tetris.prototype.init = function() {
		document.body.className=this.theme;
		this.resetGamefield();
		this.paused = false;
		// Add event listener for keyboard
		/*
			Since we want to remove event listener after window is closed make it variable
		*/
		if(!this.hasInputsBound){
			var self = this;
			var z = this.keyInput.bind(this);
			this.keyboardListener = z;

			document.addEventListener('keydown', z, false);

			this.touchCTRLRight.addEventListener(this.touchEvent, function(){
				if(this.paused) {return;}
				this.moveRight();
			}.bind(self), false);
			this.touchCTRLLeft.addEventListener(this.touchEvent, function(){
				if(this.paused) {return;}
				this.moveLeft();
			}.bind(self), false);
			this.touchCTRLRotate.addEventListener(this.touchEvent, function(){
				if(this.paused) {return;}
				this.rotate();
			}.bind(self), false);
			this.touchCTRLDrop.addEventListener(this.touchEvent, function(){
				if(this.paused) {return;}
				this.dropBlock();
			}.bind(self), false);

			this.hasInputsBound = true;
			}

		// Randomize block
		this.randomizeBlock();

		// Start timer
		this.timer = setInterval(function(){this.dropBlock();}.bind(this), this.gamespeed);
		};

	tetris.prototype.moveLeft = function(){
		if(this.leftPos + this.blockSpacingLeft <= 0) {return;}
		var tryMe = this.leftPos-1;
		var hitTest = this.tryNextMove(tryMe, this.rotation);
		if(hitTest.move) {this.leftPos--;}
		this.mergeBlock();
		};

	tetris.prototype.moveRight = function(){
		if(this.leftPos + this.blockSpacingRight >= this.gameFieldWidth) {return;}
		var tryMe = this.leftPos+1;
		var hitTest = this.tryNextMove(tryMe, this.rotation);
		if(hitTest.move) {this.leftPos++;}
		this.mergeBlock();
		};

	tetris.prototype.rotate = function(){
		var tryMe = this.rotation-1;
		if(tryMe < 0) {tryMe = this.currentblock.length-1;}
		if(tryMe > this.currentblock.length-1) {tryMe = 0;}

		var hitTest = this.tryNextMove(this.leftPos, tryMe);
		if(hitTest.rotate) {
			this.rotation = tryMe;
			var spacing = this.getBlockSpacing({'rotation': tryMe});
			this.blockSpacingLeft = spacing.spacingLeft;
			this.blockSpacingRight = spacing.spacingRight;
			this.blockSpacingBottom = spacing.spacingBottom;
			}
		this.mergeBlock();
		};

	tetris.prototype.keyInput = function(e){
		if(this.paused) {return;}
		e.preventDefault();
		var keydown = e.which;
		if (keydown === 37) {this.moveLeft();}	// Left;
		if (keydown === 39) {this.moveRight();}	// Right
		if (keydown === 38) {this.rotate();}		// Up = rotate
		if (keydown === 40){ this.dropBlock();}	// Down = drop
	};

// Check empty space between blocks right and left side. Used for collision detect with wall
	tetris.prototype.getBlockSpacing = function(params){
		// Pass tryRorate param when doing hit collision with walls
		var spacingLeft = 999,
			spacingRight = 0,
			spacingBottom = 999;

		for(var y=0, w=this.blockArrayHeight+1; y<w; y++){
			for(var x=0, z=this.blockArrayWidth+1; x<z; x++){
				var blockSpacingLeft = ((y*(this.blockArrayWidth+1)) + x);
				if(this.currentblock[params.rotation][blockSpacingLeft] > 0){
					spacingLeft = (x < spacingLeft) ? x : spacingLeft;
					spacingRight = (x > spacingRight) ? x : spacingRight;
					spacingBottom = (y < spacingBottom) ? y : spacingBottom;
					}
				}
			}
		return {
			'spacingLeft': spacingLeft,
			'spacingRight': spacingRight,
			'spacingBottom': spacingBottom
			};
		};

	// Randomize new block
	tetris.prototype.randomizeBlock = function(){
		this.leftPos = 3;
		this.currentblock = this.blocks[Math.round(Math.random()*(this.blocks.length-1))];
		this.rotation = Math.round(Math.random()*(this.currentblock.length-1));
		var spacing = this.getBlockSpacing({'rotation': this.rotation});
		this.blockSpacingLeft = spacing.spacingLeft;
		this.blockSpacingRight = spacing.spacingRight;
		this.blockSpacingBottom = spacing.spacingBottom;
		};

	// Check if user can move left or right, or rotate block
	// Todo: Add drop block collision detect here, too
	tetris.prototype.tryNextMove = function(blockPosition, rotation){
		var spacing = this.getBlockSpacing({'rotation': rotation});
		// Set can rotate to true as default and then run collision detect
		var canRotate = true;
		if(this.leftPos + spacing.spacingLeft < 0 || this.leftPos + spacing.spacingRight > this.gameFieldWidth) {canRotate = false;}
		var i = 0,
		    j = 0;
		for(var y=0; y<=this.blockArrayHeight; y++) {
			for(var x=0; x<=this.blockArrayWidth; x++) {
				this.blockfield[i] = this.currentblock[rotation][i];
				if (this.blockfield[i] >= 1) {
					// Left, right or rotate collision detected
					if(this.gameField[j+this.line+i+blockPosition] >= 1) {return {'move': false, 'rotate': false};}
					if(((this.line/10) + this.blockSpacingBottom + 1) >= this.gameFieldHeight) {canRotate = false;}
					}
				i++;
				}
			j = j + this.gameFieldWidth-this.blockArrayWidth;
			}

		return {'move': true, 'rotate': canRotate};
		};

	// Merge arrays (collision detect)
	tetris.prototype.mergeBlock = function() {
		this.clearTempArray();
		this.dropRowPossible = 0; // Collision detect downwards
		var i = 0,
			j = 0;
		for(var y=0; y<=this.blockArrayHeight; y++) {
			for(var x=0; x<=this.blockArrayWidth; x++) {
				this.blockfield[i] = this.currentblock[this.rotation][i];
				if (this.blockfield[i] >= 1) {
					combined = this.currentblock[this.rotation][i];
					this.combinedField[this.line+i+j+this.leftPos] = combined;
					this.combinedNext = this.gameField[j+this.line+(this.gameFieldWidth+1)+i+this.leftPos];
					if (this.combinedNext >= 1) {this.dropRowPossible++;}
					}
				i++;
				}
			j = j + this.gameFieldWidth-this.blockArrayWidth;
			}
		this.drawGameField();
		};

	tetris.prototype.clearTempArray = function() {
		// clear collision detection array
		var len = this.combinedField.length;
		this.combinedField = new Array(len);
		for (var j = 0, i =len; j < i; j++) {
			this.combinedField[j] = 0;
			}
		};

	// Update combind array and draw gamefield
	tetris.prototype.drawGameField = function() {
		var i = 0;
		this.canvasContainerCTX.clearRect(0,0, this.levelWidth, this.levelHeight); // Clear temporary canvas, enable for UNDO

		for(var y=0; y<=this.gameFieldHeight;y++){
			for(var x=0; x<=this.gameFieldWidth;x++){
				var drawBlock = this.combinedField[i] + this.gameField[i];
				if (drawBlock > 0){
					var yy = y*this.blockHeight;
					var xx = x*this.blockWidth;
					this.canvasContainerCTX.beginPath();
					this.canvasContainerCTX.moveTo(xx, yy);
					this.canvasContainerCTX.fillStyle = "rgba("+this.colors[this.theme][drawBlock-1]+")";
					this.canvasContainerCTX.fillRect(xx, yy, this.blockWidth, this.blockHeight);
					}
				i++;
				}
			}
		};

	// Update game field
	tetris.prototype.updateGame = function(){
		i = 0;
		for(var y=0; y<=this.gameFieldHeight;y++){
			for(var x=0; x<=this.gameFieldWidth;x++){
				var combine = this.gameField[i] + this.combinedField[i];
				this.gameField[i] = combine;
				i++;
				}
			}
		};

	// Drop block
		tetris.prototype.dropBlock = function() {
			if(this.paused){
				return;
			}
			window.requestAnimationFrame(function() {
				if(this.line < 0 && this.dropRowPossible > 0) {
					clearInterval(this.timer);
					delete(tetris.timer);
					document.querySelector('.game-over').classList.add('visible');
					return;
					}
				else if(this.dropRowPossible >= 1 || this.combinedNext === undefined){
					// Clear timer also when user clicks down
					clearInterval(this.timer);
					delete(this.timer);
					this.timer = setInterval(function(){this.dropBlock();}.bind(this), this.speedLevel);
					this.line = -2*(this.gameFieldWidth+1); // Start from below the gamefield
					this.rotation = 1;
					this.updateGame();
					this.randomizeBlock();
					}
				else {
					this.line = this.line+(this.gameFieldWidth+1);
					}
				this.checkFullLines();
				this.mergeBlock();
				}.bind(this));
			};

	// Check for full lines
	tetris.prototype.checkFullLines = function(){
		var i= 0;
		var count = 0;
		var lines = 0;
		for(var y=0; y<=this.gameFieldHeight;y++){
			count = 0;
			for(var x=0; x<=this.gameFieldWidth;x++){
				if (this.gameField[i] >= 1) {count++;}
				if (count === this.gameFieldWidth+1){
					this.gameField.splice(i-this.gameFieldWidth,this.gameFieldWidth+1);
					this.gameField.unshift(0,0,0,0,0,0,0,0,0,0);
					this.combinedField.splice(i-this.gameFieldWidth,this.gameFieldWidth+1);
					this.combinedField.unshift(0,0,0,0,0,0,0,0,0,0);
					lines++;
					}
				i++;
				}
			}
		if(lines > 0){
			this.score+= Math.pow(lines, 2)* 10;
			this.totalLines+= lines;
			this.level = 1 + Math.floor(this.totalLines/10);
			this.speedLevel = this.gamespeed-Math.floor(this.totalLines/10)*20;
			clearInterval(this.timer);
			delete(this.timer);
			this.timer = setInterval(function(){this.dropBlock();}.bind(this), this.speedLevel);

			this.scoreContainer.innerHTML = this.score;
			this.linesContainer.innerHTML = this.totalLines;
			this.levelContainer.innerHTML = this.level;
//			if(totalLines/)

			}
		};

	tetris.prototype.pauseGame = function(){
		this.paused = !this.paused;
		if(this.paused) {
			document.querySelector('.pause-screen').classList.remove('hidden');
			}
		else{
			document.querySelector('.pause-screen').classList.add('hidden');
			}
		};

	(function() {
		var lastTime = 0;
		var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.requestAnimationFrame = requestAnimationFrame;

		if (!window.requestAnimationFrame){
			window.requestAnimationFrame = function(callback) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function(){callback(currTime + timeToCall);},  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
				};
			}
		if (!window.cancelAnimationFrame){
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}

	}());

	window.tetris = new tetris();
})();


/* move this somewhere else later */
var btnStart = document.querySelectorAll('.btn-start');
var btnHome = document.querySelectorAll('.btn-home');
var btnRestart = document.querySelectorAll('.btn-restart');
var btnPause = document.querySelectorAll('.btn-pause');

[].forEach.call(btnStart, function(btn){
	btn.addEventListener('click', function(){
		document.querySelector('.page.home').classList.add('hidden');
		tetris.init();
		}, false)
	});

[].forEach.call(btnPause, function(btn){
	btn.addEventListener('click', function(){
		tetris.pauseGame();
		}, false)
	});

[].forEach.call(btnRestart, function(btn){
	btn.addEventListener('click', function(){
		tetris.resetGamefield();
		}, false)
	});

[].forEach.call(btnHome, function(btn){
	btn.addEventListener('click', function(){
		clearInterval(tetris.timer);
		delete(tetris.timer);
		document.querySelector('.pause-screen').classList.add('hidden');
		document.querySelector('.page.home').classList.remove('hidden');
		document.querySelector('.game-over').classList.remove('visible');
		}, false)
	});
