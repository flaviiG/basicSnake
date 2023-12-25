//Create the empty board
for(i=0;i<225;i++){
    let newSquare = document.createElement('div');
    newSquare.setAttribute('id', 'square');
    document.getElementById('board').appendChild(newSquare);
}

//Create the matrix of the board
var board_matrix = [];
for(let i=0; i<15; i++){
    board_matrix[board_matrix.length] = Array(15).fill(0);
}

//The snake will be managed by a linked list
function snakeNode(val) {
    this.next = null;
    this.val = val;
}

//Generate initial snake with the size of 3
var snakeHead = new snakeNode([6,8]);
let snakeN = new snakeNode([6,7]);
snakeHead.next = snakeN;
let snakeN2 = new snakeNode([6,6]);
snakeN.next = snakeN2;

board_matrix[6][6] = 1;
board_matrix[6][7] = 1;
board_matrix[6][8] = 1;

//Generate an apple on a random position
function generateApple(){
    let x = (Math.floor(Math.random()*100) % 15);
    let y = (Math.floor(Math.random()*100) % 15);
    while(checkSnake(snakeHead, [y,x]) === true){
        x = (Math.floor(Math.random()*100) % 15);
        y = (Math.floor(Math.random()*100) % 15);
    }
    board_matrix[y][x] = 2;   
}

let score = 0;

function renderTable(){
    let squares = document.querySelectorAll("#square");

    //For each square add an empty square(optional), snake or apple based on the matrix
    for(let i=0; i<225; i++){
        if(board_matrix[Math.floor(i/15)][i%15] === 0){
            let newSquare = document.createElement('div');
            newSquare.setAttribute('id', 'empty');
            if(squares[i].firstChild)
                squares[i].removeChild(squares[i].firstChild);
            squares[i].appendChild(newSquare);
        }
        else if(board_matrix[~~(i/15)][i%15] === 1){
            let newSquare = document.createElement('div');
            newSquare.setAttribute('id', 'snake');
            if(squares[i].firstChild)
                squares[i].removeChild(squares[i].firstChild);
            squares[i].appendChild(newSquare);
            }
            else{
                let newSquare = document.createElement('div');
                newSquare.setAttribute('id', 'apple');
                if(squares[i].firstChild)
                    squares[i].removeChild(squares[i].firstChild);  
                squares[i].appendChild(newSquare);
            }
    }
}

const directions = {
    'ArrowUp' : 'up',
    'ArrowDown' : 'down',
    'ArrowLeft' : 'left',
    'ArrowRight' : 'right',
}

const moveDirections = {
    'up' : [-1, 0],
    'down' : [1, 0],
    'left' : [0, -1],
    'right' : [0, 1],
}

let direction = 'right';
let ms = 1000;
document.addEventListener('keydown', (event) => {

    clearInterval(intervalId);
    let name = event.key;
    
    if((name === 'ArrowUp' && direction !== 'down') || (name === 'ArrowDown' && direction !== 'up') || (name === 'ArrowLeft' && direction !== 'right') || (name === 'ArrowRight' && direction !== 'left')){
        //Update direction based on the key pressed
        direction = directions[name];
        moveSnake(direction);
    }
    intervalId = setInterval(function() {
        if(moveSnake(direction) === false)
            clearInterval(intervalId);
        }, ms);
});

function moveSnake(direction){
    let xhead = snakeHead.val[1];
    let yhead = snakeHead.val[0];

    let nextX = xhead + moveDirections[direction][1];
    let nextY = yhead + moveDirections[direction][0]
    let newSnakeNode = new snakeNode([nextY, nextX]);

    //Check if the snake goes outside the box or overlaps
    if(checkNextSnake(snakeHead, [nextY, nextX]) === false){
        
        //Remove all squares
        let board = document.getElementById('board');
        while(board.firstChild)
            board.removeChild(board.firstChild);
        board.style.display = "flex";
        board.style.alignItems = "center";
        board.style.justifyContent = "center";
        board.style.flexDirection= "column";
        
        //Add message
        let gameOverText = document.createElement('h1');
        gameOverText.innerHTML="Game Over!"
        gameOverText.style.fontSize = "80px";

        //Add retry button
        let refreshButton = document.createElement('button');
        refreshButton.innerHTML="Retry";
        refreshButton.setAttribute('id', 'refresh');

        refreshButton.addEventListener('click', () => location.reload());

        board.appendChild(gameOverText);
        board.appendChild(refreshButton);
        // document.removeEventListener('click', _);
        return false;
    }

    //Check if the snake eats an apple
    if(board_matrix[nextY][nextX] == 2)
    {
        //Update the score and the apple square becomes a snake square so the snake becomes larger
        score += 10;
        ms-=~~(ms/100 * 3);
        document.getElementById('score').innerHTML=score.toString();
        generateApple();
        board_matrix[nextY][nextX] = 1;
        newSnakeNode.next = snakeHead;
        snakeHead = newSnakeNode;
    }
    else{
        //Move the snake - the apple square becomes a snake square and the remove the snake tail
        board_matrix[nextY][nextX] = 1;
        newSnakeNode.next = snakeHead;
        snakeHead = newSnakeNode;
        let snakeN = snakeHead;
        while(snakeN.next.next !== null){
            snakeN = snakeN.next;
        }
        board_matrix[snakeN.next.val[0]][snakeN.next.val[1]] = 0;
        snakeN.next = null;
    }

    renderTable();
}

function equals(a,b){
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function checkSnake(head, val){
    let snakeN = head;
    while(snakeN !== null){

        if(equals(snakeN.val, val))
            return true;
        snakeN = snakeN.next;
    }
    return false;
}

function checkNextSnake(head, val){
    let x = val[1];
    let y = val[0];

    //Check if the snake exits the board
    if(x < 0 || x >= 15 || y < 0 || y >= 15)
        return false;

    //Check if the snake bites itself
    return !checkSnake(head, val);
}

window.addEventListener("load", generateApple);
window.addEventListener("load", renderTable);

//setInterval so that the snake moves on its own
var intervalId = setInterval(function() {
    if(moveSnake(direction) === false)
        clearInterval(intervalId);
    }, ms);