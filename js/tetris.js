(function(){
	// Tetris
	var tetris = function(){
		this.gameFieldWidth = 9;		// Width of the game field (original tetris has 20x10, so lets use those)
		this.gameFieldHeight = 15;		// Height of the game field
		this.blockHeight = 16;			// Single block piece height in pixels
		this.blockWidth = 16;			// Single block piece width in pixels
		this.blockArrayWidth = 3;		// Size of block container
		this.blockArrayHeight = 3;		// Size of block container
		this.line = 0;					// Top position of dropping piece
		this.leftPos = 3;				// Left position of dropping piece
		this.colors = [
			[46,204,113],
			[52,152,219],
			[26,188,156],
			[241,196,15],
			[30,126,34],
			[231,76,60],
			[155,89,182]];
		this.score = 0;					// Score
		this.totalLines	 = 0;			// Lines cleared
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

		this.touchEvent = (function(){
					var testTouch = document.createElement("DIV");
					testTouch.setAttribute('ontouchstart', 'return;');
					var isTouchDevice = (typeof testTouch.ontouchstart == 'function' && window.screenX === 0) ? true : false;
					return (isTouchDevice) ? 'touchstart' : 'mousedown';
					})();

		if(this.touchEvent === 'touchstart'){
			document.body.addEventListener('touchmove', function(e){e.preventDefault();}, false);
		}

		var thisGameContainer = document.querySelector('.page.tetris .gamefield-container').getBoundingClientRect();
		var testY = Math.floor(thisGameContainer.height/(this.gameFieldHeight+1));

		this.blockHeight = testY;
		this.blockWidth = testY;

		this.blocks = [
		// Ã¢â€“Ë†Ã¢â€“Ë†Ã¢â€“Ë†Ã¢â€“Ë†
			[[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
			[0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0]],

		// Ã¢â€“Ë†Ã¢â€“Ë†
		// Ã¢â€“Ë†Ã¢â€“Ë†
			[[0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0]],

		//  Ã¢â€“Ë†Ã¢â€“Ë†
		// Ã¢â€“Ë†Ã¢â€“Ë†
			[[0,0,0,0,0,3,3,0,3,3,0,0,0,0,0,0],
			[0,3,0,0,0,3,3,0,0,0,3,0,0,0,0,0]],

		// Ã¢â€“Ë†Ã¢â€“Ë†
		//  Ã¢â€“Ë†Ã¢â€“Ë†
			[[0,0,0,0,0,4,4,0,0,0,4,4,0,0,0,0],
			[0,0,4,0,0,4,4,0,0,4,0,0,0,0,0,0]],

		// Ã¢â€“Ë†Ã¢â€“Ë†Ã¢â€“Ë†
		//   Ã¢â€“Ë†
			[[0,5,5,0,0,5,0,0,0,5,0,0,0,0,0,0],
			[0,5,5,5,0,0,0,5,0,0,0,0,0,0,0,0],
			[0,0,5,0,0,0,5,0,0,5,5,0,0,0,0,0],
			[0,5,0,0,0,5,5,5,0,0,0,0,0,0,0,0]],

		//   Ã¢â€“Ë†
		// Ã¢â€“Ë†Ã¢â€“Ë†Ã¢â€“Ë†
			[[0,6,6,0,0,0,6,0,0,0,6,0,0,0,0,0],
			[0,0,0,6,0,6,6,6,0,0,0,0,0,0,0,0],
			[0,6,0,0,0,6,0,0,0,6,6,0,0,0,0,0],
			[0,6,6,6,0,6,0,0,0,0,0,0,0,0,0,0]],

		//  Ã¢â€“Ë†
		// Ã¢â€“Ë†Ã¢â€“Ë†Ã¢â€“Ë†
			[[0,7,0,0,7,7,7,0,0,0,0,0,0,0,0,0],
			[0,7,0,0,0,7,7,0,0,7,0,0,0,0,0,0],
			[7,7,7,0,0,7,0,0,0,0,0,0,0,0,0,0],
			[0,7,0,0,7,7,0,0,0,7,0,0,0,0,0,0]]];

		this.widgetContainer = document.body;

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



		this.levelWidth = this.blockWidth*(this.gameFieldWidth+1);
		this.levelHeight = this.blockHeight*(this.gameFieldHeight+1);
		this.canvasContainer = document.querySelector('CANVAS');
		this.canvasContainerCTX = this.canvasContainer.getContext('2d');
		this.canvasContainer.setAttribute("WIDTH", this.levelWidth);
		this.canvasContainer.setAttribute("HEIGHT", this.levelHeight);
		this.dropRowPossible = 0;
		};

	tetris.prototype.resetGamefield = function(){
		var i = 0;
		// Create arrays for game state and set everything to 0
		this.combinedField	= [];	// Combined [blockfield + gamefield] (for 'collision detect')
		this.blockfield	= [];		// Contains single block (current falling block)
		this.gameField	= [];		// Contains all dropped blocks

		this.gamespeed = this.defaults.speed;
		this.score = this.defaults.score;
		this.totalLines = 0;
		this.line = -2*(this.gameFieldWidth+1); // Start from below the gamefield

		for(var y=0;y<=this.gameFieldHeight;y++) {
			for(var x=0; x<=this.gameFieldWidth;x++) {
				this.gameField[i] = 0;
				this.blockfield[i] = 0;
				this.combinedField[i] = 0;
				i++;
				}
			}
		};

	tetris.prototype.init = function() {
		this.resetGamefield();

		// Add event listener for keyboard
		/*
			Since we want to remove event listener after window is closed make it variable
		*/
		if(!this.hasInputsBound){
			var self = this;
			var z = this.keyInput.bind(this);
			this.keyboardListener = z;

			document.addEventListener('keydown', z, false);

			this.touchCTRLRight.addEventListener(this.touchEvent, function(){this.moveRight();}.bind(self), false);
			this.touchCTRLLeft.addEventListener(this.touchEvent, function(){this.moveLeft();}.bind(self), false);
			this.touchCTRLRotate.addEventListener(this.touchEvent, function(){this.rotate();}.bind(self), false);
			this.touchCTRLDrop.addEventListener(this.touchEvent, function(){this.dropBlock();}.bind(self), false);

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
		e.preventDefault();
		if(this.paused) {return;}
		var keydown = e.which;
		// Left;
		if (keydown === 37) {this.moveLeft();}

		// Right
		if (keydown === 39) {this.moveRight();}

		// Up = rotate
		if (keydown === 38) {this.rotate();}

		// Down = drop
		if (keydown === 40){ this.dropBlock();}
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
					this.canvasContainerCTX.fillStyle = "rgb("+this.colors[drawBlock-1]+")";
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
			window.requestAnimationFrame(function() {
				if(this.line < 0 && this.dropRowPossible > 0) {
						clearInterval(this.timer);
						document.querySelector('.game-over').classList.add('visible');
					}
				if (this.dropRowPossible >= 1 || this.combinedNext === undefined){
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
			this.timer = setInterval(function(){this.dropBlock();}.bind(this), this.speedLevel);

			this.scoreContainer.innerHTML = this.score;
			this.linesContainer.innerHTML = this.totalLines;
			this.levelContainer.innerHTML = this.level;
//			if(totalLines/)

			}
		};

	tetris.prototype.pauseGame = function(){
		if(!this.paused) {
			clearInterval(this.timer);
			this.paused = true;
			}
		else{
			clearInterval(this.timer);
			this.timer = setInterval(function(){this.dropBlock();}.bind(this), this.speedLevel);
			this.paused = false;
			}
		};

	// Clear timeout when dashboard window is closed
	tetris.prototype.kill = function(){
		var x = this.keyboardListener;
		document.removeEventListener('keydown', x);
		clearInterval(this.timer);
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
var btnStart = document.querySelector('.btn-start');
var btnHome = document.querySelector('.btn-home');
var btnRestart = document.querySelector('.btn-restart');
var btnPause = document.querySelector('.btn-pause');

btnStart.addEventListener('click', function(){
	document.querySelector('.page.home').classList.add('hidden');
	tetris.init();
//	tetris.pauseGame();
}, false);

btnPause.addEventListener('click', function(){
	tetris.pauseGame();
}, false);

btnRestart.addEventListener('click', function(){
	tetris.resetGamefield();
}, false);

btnHome.addEventListener('click', function(){
	clearInterval(tetris.timer);
	delete(tetris.timer);
	tetris.resetGamefield();
	document.querySelector('.page.home').classList.remove('hidden');
}, false);
