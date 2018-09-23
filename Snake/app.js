let boardWidth;
let boardHeight;
let unit;
let bwu;
let bhu;
let grid;
let snake;
let length;
let currentDirection;
let interval;
let speedup;
let firstMove;


window.onload = startGame();
document.onkeydown = checkKey;


function makeArray(d1, d2) {
    var arr = new Array(d1), i, l;
    for(i = 0, l = d2; i < l; i++) {
        arr[i] = new Array(d1);
    }
    return arr;
}
 

function initGlobalVariables() {
  boardWidth = 1000;
  boardHeight = 500;
  unit = 25;
  bwu = boardWidth / unit;
  bhu = boardHeight / unit;
  snake = new Array(1000);
  length = 0;
  interval = 200;
  speedup = 0.95;
  currentDirection = null;
  firstMove = false;
  grid = makeArray(bhu, bwu);
  for(i = 0; i < bwu; i++) {
    for(j = 0; j < bhu; j++) {
      grid[i][j] = 0;
    }
  } 
}


function placeFoddAtRandomPosition() {
  let x;
  let y;
  while(true) {
    x = Math.floor(Math.random() * bwu);
    y = Math.floor(Math.random() * bhu);
    if(grid[y][x] == 0) {
      break;
    }
  }
  document.getElementById("board").innerHTML += ('<div id="food"></div>');
  let food = document.getElementById("food");
  food.style.left = (x * unit) + 'px';
  food.style.top = (y * unit) + 'px';
  grid[y][x] = 2; // 2 means food
}

  
function startGame() {
  initGlobalVariables();
  tail = {h: 0, w: 0};
  body = {h: 0, w: 1};
  head = {h: 0, w: 2};
  document.getElementById("board").innerHTML += '<div id="snake-unit0" class="snake"></div> ';
  document.getElementById("board").innerHTML += '<div id="snake-unit1" class="snake"></div> ';
  document.getElementById("board").innerHTML += '<div id="snake-unit2" class="snake"></div> ';
  let headd = document.getElementById("snake-unit2");
  headd.style.left = 50 + 'px';
  headd.style.top = 0 + 'px';
  let bodyy = document.getElementById("snake-unit1");
  bodyy.style.left = 25 + 'px';
  bodyy.style.top = 0 + 'px';
  let taill = document.getElementById("snake-unit0");
  taill.style.left = 0 + 'px';
  taill.style.top = 0 + 'px';
  grid[0][0] = 1;
  grid[0][1] = 1;
  grid[0][2] = 1;
  snake[0] = tail;
  snake[1] = body;
  snake[2] = head;
  length = 3;
  placeFoddAtRandomPosition();
  move();
}

function checkKey(e) {
    e = e || window.event;
    if(e.keyCode == '37') {
        // left arrow
        firstMove = true;
        if(currentDirection != 'right') {
          currentDirection = 'left';
        }
    } else if (e.keyCode == '38') {
       // up arrow
       firstMove = true;
    	if(currentDirection != 'down') {
          currentDirection = 'up';
        }
    } else if (e.keyCode == '39') {
       // right arrow
       firstMove = true;
       if(currentDirection != 'left') {
       	currentDirection = 'right';
       }
    } else if (e.keyCode == '40') {
        // down arrow
        firstMove = true;
        if(currentDirection != 'up') {
          currentDirection = 'down';
      }
    }
}

function shift() {
  for(i = 0; i < length; i++) {
    snake[i] = snake[i + 1];
  }
  for(i = 1; i <= length; i++) {
    document.getElementById('snake-unit'+ i).setAttribute("id", "snake-unit" + (i - 1));
  }
}

function checkGameOver(newUnit) {
  if(snake[length - 1].w < 0 || snake[length - 1].w >= boardWidth / unit ||
     snake[length - 1].h < 0 || snake[length - 1].h >= boardHeight / unit) {
     location.reload();
  }
  if(newUnit.w < 0 || newUnit.w >= boardWidth / unit ||
     newUnit.h < 0 || newUnit.h >= boardHeight / unit) {
     location.reload();
  }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function move() {
  let newUnit = {h: 0, w: 0};
  if(currentDirection == 'left') {
    newUnit.h = snake[length - 1].h;
    newUnit.w = snake[length - 1].w - 1;    
  } else if(currentDirection == 'right') {
    newUnit.h = snake[length - 1].h;
    newUnit.w = snake[length - 1].w + 1;
  } else if(currentDirection == 'down') {
    newUnit.h = snake[length - 1].h + 1;
    newUnit.w = snake[length - 1].w;
  } else if(currentDirection == 'up') {
    newUnit.h = snake[length - 1].h - 1;
    newUnit.w = snake[length - 1].w;
  }
  checkGameOver(newUnit);
  if(firstMove) {
	  if(grid[newUnit.h][newUnit.w] == 2) {
	    grid[newUnit.h][newUnit.w] = 1;
		snake[length] = newUnit;
		let nu = document.getElementById("food");
		nu.style.left = newUnit.w * unit + 'px';
		nu.style.top = newUnit.h * unit + 'px';
		document.getElementById('food').setAttribute("class", "snake");
		document.getElementById('food').setAttribute("id", "snake-unit" + length);
		length++;
		placeFoddAtRandomPosition();
		interval *= speedup;
	  } else {
	  	if(grid[newUnit.h][newUnit.w] == 1) {
		  location.reload();
	  	}
		grid[newUnit.h][newUnit.w] = 1;
		grid[snake[0].h][snake[0].w] = 0;
		snake[length] = newUnit;
		let un = document.getElementById("snake-unit0");
		un.style.top = newUnit.h * unit + 'px';
		un.style.left = newUnit.w * unit + 'px';
		document.getElementById('snake-unit0').setAttribute("id", "snake-unit" + length);
		shift();
	  }
	}
	await sleep(interval);
	move();
}
