// Definir Html elements

//Obtiene el elemento div llamado game-board
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const hightScoreText = document.getElementById('highScore') ;


//Variables del juego
const gridSize = 20;
let snake = [{x:10, y:10}] //posicion de comienzo de la serpiente
let food = generateFood();
let highScore = 0;
let direction = 'left';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


//Esta funcion dibuja el mapa del juego, la serpiente y la comida
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Dibuja la serpiente
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement = createGameElement('div','snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

// Create s snake of food cube/div

function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className =  className;
    return element;
}


// Set the  position of the food  or snake
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Dibujar la comida
function drawFood(){
    if (gameStarted) {
        const foodElement = createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement); 
    }
}

// Genera la comida para la serpiente, aleatoriamente
function generateFood(){
    const x = Math.floor(Math.random()* gridSize) + 1;
    const y = Math.floor(Math.random()* gridSize) + 1;
    return {x,y};
}

// Mover la serpiente
function move(){
    const head = {...snake[0]}
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);
    //snake.pop();
    if (head.x === food.x && head.y === food.y)  {
        food = generateFood();
        increasedSpeed();
        clearInterval(gameInterval);// resetea el movimiento (tiempo)
        gameInterval = setInterval(()=>{
            move();
            checkCollition();
            draw();
        },gameSpeedDelay);
    }else {
        snake.pop();
    }
}

//Start Game function
function starGame(){
    gameStarted = true; //Keep track of a running game.
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(()=>{
        move();
        checkCollition();
        draw();
    }, gameSpeedDelay);
}

// Create  keypress event listener
function handleKeyPress(event){
    if ((!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')) {
        starGame();
    }else{
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown',handleKeyPress);


function increasedSpeed(){
    console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;

    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
     else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
     else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollition(){
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || 
        head.y < 1 || head.y > gridSize) {
            resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
        
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length -1; 
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length -1;
    if (currentScore > highScore) {
        hightScore = currentScore;
        hightScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    hightScoreText.style.display = 'block';
}

//Test move()
// setInterval(() => {
//    move();// move firts 
//    draw();
// }, 200);