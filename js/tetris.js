(function(){
	'use strict';

	// Tetris
	var tetris = {
		gameFieldWidth : 9,		// Width of the game field (original tetris has 20x10, so lets use those)
		gameFieldHeight : 19,	// Height of the game field
		blockArrayWidth : 3,	// Width of block container (4x4)
		blockArrayHeight : 3,	// Height of block container
		line : 0,				// Top position of dropping piece
		leftPos : 3,			// Left position of dropping piece
		rotation : 0,			// Rotation of dropping piece
		score : 0,				// Score
		totalLines: 0,			// Lines cleared
		dropRowPossible : 0,
		gamespeed : 500,		// Game speed in milliseconds
		speedLevel : 500,
		gameOver : false,
		defaults : {
			speed: 500,
			score: 0,
			totalLines: 0,
			line : 0
		},
		nextBlock : false,		// not implemented yet
		paused : false,
// Themes
		colors : {
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
		},
		theme : 'vauhtiVille',

		// blocks
		blocks : [
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
			[0,7,0,0,7,7,0,0,0,7,0,0,0,0,0,0]]]
	};

// Test touch support, screen size etc.
	tetris.initialize = function(){
		// Test touch support
		this.touchEvent = (function(){
			var testTouch = document.createElement("DIV");
			testTouch.setAttribute('ontouchstart', 'return;');
			var isTouchDevice = (typeof testTouch.ontouchstart == 'function' && window.screenX === 0) ? true : false;
			return (isTouchDevice) ? 'touchstart' : 'mousedown';
			})();
		if(this.touchEvent === 'touchstart'){
			document.body.addEventListener('touchstart', function(e){e.preventDefault();}, false);
		}

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

		var checkWindowOrientation = function(){
			if(Math.abs(window.orientation) === 90) {
				if(tetris.timer) {
					tetris.pauseGame();
					}
				document.body.classList.add('landscape');
			}
			else {
				document.body.classList.remove('landscape');
			}
		};

		window.addEventListener("orientationchange", checkWindowOrientation, false);

		this.blockHeight = testY; // Scale block size to match screen resolution
		this.blockWidth = testY;

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

	tetris.resetGamefield = function(){
		var i = 0;
		// Create arrays for game state and set everything to 0
		this.combinedField	= [];	// Combined [blockfield + gamefield] (for 'collision detect')
		this.blockfield	= [];		// Contains single block (current falling block)
		this.gameField	= [];		// Contains all dropped blocks
		this.gameOver = false;
		this.gamespeed = this.defaults.speed;
		this.score = 0;
		this.totalLines = 0;
		this.leftPos = 3;
		this.dropRowPossible = 0;
		this.line = -2*(this.gameFieldWidth+1);
		this.level = 0; // Start from below the gamefield

		for(var y=0;y<=this.gameFieldHeight;y++) {
			for(var x=0; x<=this.gameFieldWidth;x++) {
				this.gameField[i] = 0;
				this.blockfield[i] = 0;
				this.combinedField[i] = 0;
				i++;
				}
			}

		this.scoreContainer.innerHTML = this.score;
		this.linesContainer.innerHTML = this.totalLines;
		this.levelContainer.innerHTML = this.level;

		this.drawGameField();
		this.clearTempArray();
		};

	tetris.init = function() {
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
				this.touchCTRLRight.classList.add('pressed');
				fpAnimate.watch({el: this.touchCTRLRight,execute: function() {this.el.classList.remove('pressed');},unwatch: true});
			}.bind(self), false);
			this.touchCTRLLeft.addEventListener(this.touchEvent, function(){
				if(this.paused) {return;}
				this.touchCTRLLeft.classList.add('pressed');
				fpAnimate.watch({el: this.touchCTRLLeft,execute: function() {this.el.classList.remove('pressed');},unwatch: true});
				this.moveLeft();
			}.bind(self), false);
			this.touchCTRLRotate.addEventListener(this.touchEvent, function(){
				if(this.paused) {return;}
				this.touchCTRLRotate.classList.add('pressed');
				fpAnimate.watch({el: this.touchCTRLRotate,execute: function() {this.el.classList.remove('pressed');},unwatch: true});
				this.rotate();
			}.bind(self), false);
			this.touchCTRLDrop.addEventListener(this.touchEvent, function(){
				if(this.paused || this.gameOver) {return;}
				this.touchCTRLDrop.classList.add('pressed');
				fpAnimate.watch({el: this.touchCTRLDrop,execute: function() {this.el.classList.remove('pressed');},unwatch: true});
				this.dropBlock();
			}.bind(self), false);

			this.hasInputsBound = true;
			}

		// Randomize block
		this.randomizeBlock();

		// Start timer
		this.timer = setInterval(function(){this.dropBlock();}.bind(this), this.gamespeed);
		};

	tetris.moveLeft = function(){
		if(this.leftPos + this.blockSpacingLeft <= 0) {return;}
		var tryMe = this.leftPos-1;
		var hitTest = this.tryNextMove(tryMe, this.rotation);
		if(hitTest.move) {this.leftPos--;}
		this.mergeBlock();
		};

	tetris.moveRight = function(){
		if(this.leftPos + this.blockSpacingRight >= this.gameFieldWidth) {return;}
		var tryMe = this.leftPos+1;
		var hitTest = this.tryNextMove(tryMe, this.rotation);
		if(hitTest.move) {this.leftPos++;}
		this.mergeBlock();
		};

	tetris.rotate = function(){
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

	tetris.keyInput = function(e){
		if(this.paused || this.gameOver) {return;}
		e.preventDefault();
		var keydown = e.which;
		if (keydown === 37) {this.moveLeft();}	// Left;
		if (keydown === 39) {this.moveRight();}	// Right
		if (keydown === 38) {this.rotate();}		// Up = rotate
		if (keydown === 40){ this.dropBlock();}	// Down = drop
	};

// Check empty space between blocks right and left side. Used for collision detect with wall
	tetris.getBlockSpacing = function(params){
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
	tetris.randomizeBlock = function(){
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
	tetris.tryNextMove = function(blockPosition, rotation){
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
	tetris.mergeBlock = function() {
		this.clearTempArray();
		this.dropRowPossible = 0; // Collision detect downwards
		var i = 0,
			j = 0;
		for(var y=0; y<=this.blockArrayHeight; y++) {
			for(var x=0; x<=this.blockArrayWidth; x++) {
				this.blockfield[i] = this.currentblock[this.rotation][i];
				if (this.blockfield[i] >= 1) {
					var combined = this.currentblock[this.rotation][i];
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

	tetris.clearTempArray = function() {
		// clear collision detection array
		var lngth = this.combinedField.length;
		this.combinedField = new Array(lngth);
		for (var j = 0, i =lngth; j < i; j++) {
			this.combinedField[j] = 0;
			}
		};

	// Update combind array and draw gamefield
	tetris.drawGameField = function() {
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
	tetris.updateGame = function(){
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
	tetris.dropBlock = function() {
		window.requestAnimationFrame(function() {
			if(this.line < 0 && this.dropRowPossible > 0) {
				clearInterval(this.timer);
				this.gameOver = true;
				document.querySelector('.game-over-container').classList.add('visible');

				// Update highscore data ->
				var topScoreData = [];
				this.setTopScores({'scores' : [this.score, this.totalLines, '---', new Date().getTime(), this.level]});
				// <- Update highscore data

				return;
				}
			else if(this.dropRowPossible >= 1 || this.combinedNext === undefined){
				// Clear timer also when user clicks down
				clearInterval(this.timer);
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
	tetris.checkFullLines = function(){
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
			}
		};

	tetris.pauseGame = function(){
		this.paused = !this.paused;
		clearInterval(this.timer);
		if(this.paused) {
			document.querySelector('.pause-screen-container').classList.add('visible');
			}
		else{
			this.timer = setInterval(function(){this.dropBlock();}.bind(this), this.speedLevel);
			document.querySelector('.pause-screen-container').classList.remove('visible');
			}
		};

	tetris.getTopScores = function(){
		var scores = JSON.parse(localStorage.getItem('scores')) || Array(10).fill([0,0,'---',-1]);
		var docFrag = document.createDocumentFragment();
		for(var i=0, j=scores.length; i<j;i++){
			var newLine = document.createElement("DIV");
			newLine.className = "score-line";

			var res = document.createElement("DIV");
			var score = document.createElement("DIV");
			var lines = document.createElement("DIV");
			var name = document.createElement("DIV");

			res.appendChild(document.createTextNode((i+1)+'.'));
			name.appendChild(document.createTextNode(scores[i][2]));
			score.appendChild(document.createTextNode(scores[i][0]));
			lines.appendChild(document.createTextNode(scores[i][1]));

			newLine.appendChild(res);
			newLine.appendChild(name);
			newLine.appendChild(score);
			newLine.appendChild(lines);

			docFrag.appendChild(newLine)
		}
		var container = document.querySelector('.highscore-container');
		// clear top score container, except the the title row
		while(container.querySelectorAll('.score-line').length > 1){container.removeChild(container.lastChild);}
		container.appendChild(docFrag);
	};

	// Home button action
	tetris.home = function(){
		clearInterval(this.timer);
		this.getTopScores();
		document.querySelector('.page.home').classList.remove('hidden');
		document.querySelector('.game-over-container').classList.remove('visible');
		document.querySelector('.pause-screen-container').classList.remove('visible');
	};

	tetris.setTopScores = function(scoreData){
		document.querySelector('.game-over').classList.remove('highscores-visible');
		var scores = JSON.parse(localStorage.getItem('scores')) || Array(10).fill([0,0,'---',-1]);
		scores.push(scoreData.scores);
		scores = scores.sort(function(a,b) {return b[0] - a[0];});
		scores = scores.slice(0,10);

		// Check if you made into top 10
		var rank = 9999;
		for(var i=0, j= scores.length; i<j;i++){if(scores[i][3] === scoreData.scores[3]) {rank = i;}}
		// You did! good for you mate
		if(rank < 9999){
			var vent = new CustomEvent("newTopScore", {detail: {
				'rank' : rank,
				'score' : scoreData.scores[0],
				'lines' : scoreData.scores[1],
				'level' : scoreData.scores[4]
			}});
			document.dispatchEvent(vent);
		}
		localStorage.setItem('scores', JSON.stringify(scores));
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
	tetris.initialize();
	tetris.getTopScores();

	/* move this somewhere else later */
	var btnStart = document.querySelectorAll('.btn-start');
	var btnHome = document.querySelectorAll('.btn-home');
	var btnRestart = document.querySelectorAll('.btn-restart');
	var btnPause = document.querySelectorAll('.btn-pause');

	[].forEach.call(btnStart, function(btn){
		btn.addEventListener(tetris.touchEvent, function(){
			document.querySelector('.page.home').classList.add('hidden');
			tetris.init();
			}, false)
		});

	[].forEach.call(btnPause, function(btn){
		btn.addEventListener(tetris.touchEvent, function(){
			tetris.pauseGame();
			}, false)
		});

	[].forEach.call(btnRestart, function(btn){
		btn.addEventListener(tetris.touchEvent, function(){
			tetris.resetGamefield();
			tetris.pauseGame();
			}, false)
		});

	[].forEach.call(btnHome, function(btn){
		btn.addEventListener(tetris.touchEvent, function(){
			tetris.home();
			}, false)
		});

	// Change the initials for top score
	var submitNewHighScore = document.querySelector('.initials-submit');
	submitNewHighScore.addEventListener(tetris.touchEvent, function(){
		if(!tetris.submitData){return;}

		var scores = JSON.parse(localStorage.getItem('scores')) || Array(10).fill([0,0,'---',-1]);
		scores[tetris.submitData.rank][2] = document.querySelector('INPUT.initials').value;
		localStorage.setItem('scores', JSON.stringify(scores));
		document.querySelector('.game-over').classList.remove('highscores-visible');
		document.querySelector('.game-over .btn-home').classList.remove('hidden');
		tetris.home();
		delete tetris.submitData;
	}, false);

	// Create virtual keyboard
	var keyboardContainer = document.querySelector('.virtual-keyboard');
	// These characters are cool. Other characters suck :(
	var keys = '0123456789qwertyuiopåasdfghjklöäzxcvbnm@-# !?';

	var docFrag = document.createDocumentFragment();
	for(var i=0, j=keys.length; i<j;i++){
		var virtualKeyContainer = document.createElement("div");
		virtualKeyContainer.className = "key-container";
		virtualKeyContainer.setAttribute('data-character', keys[i]);

		var virtualKey = document.createElement("div");
		virtualKey.appendChild(document.createTextNode(keys[i]));

		virtualKeyContainer.appendChild(virtualKey);
		virtualKeyContainer.addEventListener(tetris.touchEvent, function(){
			// Emit event containing pressed character
			var vent = new CustomEvent("virtualKeyboardKeyUp", {detail: {character: this.getAttribute('data-character').toUpperCase()}});
			document.dispatchEvent(vent);
		}, false);

		docFrag.appendChild(virtualKeyContainer);
	}
	keyboardContainer.appendChild(docFrag);

	// Listener for virtual keyboard
	document.addEventListener('virtualKeyboardKeyUp', function(evt){
		var el = document.querySelector('.virtual-keyboard-input');
		// Max three characters
		if(el.innerHTML.length <3){el.innerHTML+= evt.detail.character;}
		else{el.innerHTML= evt.detail.character;}
		document.querySelector('INPUT.initials').value = el.innerHTML;
	}, false);

	document.addEventListener('newTopScore', function(evt){
		document.querySelector('.highscore-lines').innerHTML = evt.detail.lines;
		document.querySelector('.highscore-level').innerHTML = evt.detail.level;
		document.querySelector('.highscore-score').innerHTML = evt.detail.score;
		// Show initials input and hide home button (submit button will do the same thing)
		document.querySelector('.game-over').classList.add('highscores-visible');
		document.querySelector('.game-over .btn-home').classList.add('hidden');
		tetris.submitData = evt.detail;
	}, false);

})();

var fpAnimate = {
	init: function(){
	},

	watch: function( params ){
		if (!params.el) {return;};
		if (!params.execute) {params.execute = function(){}};
		if (!params.listen) {params.listen = function(){}};
		if( !params.iterate ) {params.iterate = function(){};};

// Animation start - listen
		var listen = function(){
			params.listen();
			}

		if(params.unwatch) {
			listen = function(){
				params.listen();
				params.el.removeEventListener("animationstart", listen);
				params.el.removeEventListener("webkitAnimationStart", listen);
				}
			}

// Animation iterate
		var iterate = function(){
			params.iterate();
			}

		if(params.unwatch) {
			iterate = function(){
				params.iterate();
				params.el.removeEventListener("animationiteration", iterate);
				params.el.removeEventListener("webkitAnimationIteration", iterate);
				}
			}

// Execute
		var execute = function(){
			params.execute();
			}

		if(params.unwatch) {
			execute = function(){
				params.execute();
				params.el.removeEventListener("animationend", execute);
				params.el.removeEventListener("webkitAnimationEnd", execute);
				}
			}


		params.el.addEventListener("animationstart", listen, false);
		params.el.addEventListener("animationend", execute, false);
		params.el.addEventListener("animationiteration", iterate, false);

		params.el.addEventListener("webkitAnimationStart", listen, false);
		params.el.addEventListener("webkitAnimationEnd", execute, false);
		params.el.addEventListener("webkitAnimationIteration", iterate, false);
	}
};




if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./tetris_sw.js', {scope: './'})
		.then(function(reg) {
			// registration worked
			console.log('Registration succeeded. Scope is ' + reg.scope);
		}).catch(function(error) {
			// registration failed
			console.log('Registration failed with ' + error);
		});
	}
