const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const initialSpeed = 100; // Velocidad inicial del juego en milisegundos
let gameSpeed = initialSpeed;
let snake;
let food;
let dx;
let dy;
let isGameOver;
let isPaused = false;
let gameLoopInterval;

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('resumeButton').addEventListener('click', resumeGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);

function startGame() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    document.getElementById('pauseScreen').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'block'; // Mostrar el botón de pausar
    
    // Inicializar el juego
    snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
    food = { x: Math.floor(Math.random() * tileCount) * gridSize, y: Math.floor(Math.random() * tileCount) * gridSize };
    dx = gridSize;
    dy = 0;
    isGameOver = false;
    isPaused = false;

    // Limpiar y dibujar el juego
    limpiarCanvas();
    dibujarSerpiente();
    dibujarComida();

    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, gameSpeed);
}

function pauseGame() {
    isPaused = true;
    clearInterval(gameLoopInterval);
    document.getElementById('pauseScreen').style.display = 'flex';
}

function resumeGame() {
    isPaused = false;
    gameLoopInterval = setInterval(gameLoop, gameSpeed);
    document.getElementById('pauseScreen').style.display = 'none';
}

function gameLoop() {
    if (isGameOver) {
        ctx.fillStyle = '#000000'; // Negro
        ctx.font = '30px Arial';
        ctx.textAlign = 'center'; // Centra el texto horizontalmente
        ctx.textBaseline = 'middle'; // Centra el texto verticalmente
        ctx.fillText('Te perdiste muchos hijos', canvas.width / 2, canvas.height / 2);
        clearInterval(gameLoopInterval);
        document.getElementById('pauseButton').style.display = 'none'; // Ocultar el botón de pausar
        return;
    }

    if (isPaused) return; // Pausar el juego si está en pausa

    limpiarCanvas();
    moverSerpiente();
    verificarColisiones();
    dibujarComida();
    dibujarSerpiente();
}


function limpiarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff'; // Asegura que el fondo sea blanco
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moverSerpiente() {
    const cabeza = { ...snake[0] };

    cabeza.x += dx;
    cabeza.y += dy;
    
    if (cabeza.x === food.x && cabeza.y === food.y) {
        snake.unshift(food);
        food = { x: Math.floor(Math.random() * tileCount) * gridSize, y: Math.floor(Math.random() * tileCount) * gridSize };
    } else {
        snake.unshift(cabeza);
        snake.pop();
    }
}

function dibujarSerpiente() {
    const snakeHeadImage = new Image();
    snakeHeadImage.src = 'images/snakeHead.png'; // Asegúrate de tener la imagen en la carpeta correcta
    const snakeBodyImage = new Image();
    snakeBodyImage.src = 'images/snakeBody.png'; // Asegúrate de tener la imagen en la carpeta correcta

    // Dibuja la cabeza de la serpiente
    ctx.drawImage(snakeHeadImage, snake[0].x, snake[0].y, gridSize, gridSize);

    // Dibuja el cuerpo de la serpiente
    for (let i = 1; i < snake.length; i++) {
        ctx.drawImage(snakeBodyImage, snake[i].x, snake[i].y, gridSize, gridSize);
    }
}

function dibujarComida() {
    const foodImage = new Image();
    foodImage.src = 'images/food.png'; // Asegúrate de tener la imagen en la carpeta correcta
    ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);
}

function cambiarDireccion(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            if (dy === 0) { dx = 0; dy = -gridSize; }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (dy === 0) { dx = 0; dy = gridSize; }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (dx === 0) { dx = -gridSize; dy = 0; }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (dx === 0) { dx = gridSize; dy = 0; }
            break;
        case 'KeyP':
            if (isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
            break;
    }
}

function verificarColisiones() {
    const cabeza = snake[0];
    
    // Colisión con las paredes
    if (cabeza.x < 0 || cabeza.x >= canvas.width || cabeza.y < 0 || cabeza.y >= canvas.height) {
        isGameOver = true;
    }
    
    // Colisión con sí misma
    for (let i = 1; i < snake.length; i++) {
        if (cabeza.x === snake[i].x && cabeza.y === snake[i].y) {
            isGameOver = true;
        }
    }
}

document.addEventListener('keydown', cambiarDireccion);

let score = 0; // Variable para el contador de comida

function startGame() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    document.getElementById('pauseScreen').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'block'; // Mostrar el botón de pausar

    // Inicializar el juego
    snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
    food = { x: Math.floor(Math.random() * tileCount) * gridSize, y: Math.floor(Math.random() * tileCount) * gridSize };
    dx = gridSize;
    dy = 0;
    isGameOver = false;
    isPaused = false;
    score = 0; // Reiniciar el contador de comida

    // Limpiar y dibujar el juego
    limpiarCanvas();
    dibujarSerpiente();
    dibujarComida();
    actualizarContador(); // Actualizar el contador en el DOM

    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, gameSpeed);
}

function moverSerpiente() {
    const cabeza = { ...snake[0] };

    cabeza.x += dx;
    cabeza.y += dy;

    if (cabeza.x === food.x && cabeza.y === food.y) {
        snake.unshift(food);
        food = { x: Math.floor(Math.random() * tileCount) * gridSize, y: Math.floor(Math.random() * tileCount) * gridSize };
        score++; // Incrementar el contador de comida
        actualizarContador(); // Actualizar el contador en el DOM
    } else {
        snake.unshift(cabeza);
        snake.pop();
    }
}

function actualizarContador() {
    document.getElementById('score').innerText = `Comida: ${score}`;
}

