const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");

let playerGo = 'black';
playerDisplay.textContent = playerGo;

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    "", "", "", "", "", "", "", "", 
    "", "", "", "", "", "", "", "", 
    "", "", "", "", "", "", "", "", 
    "", "", "", "", "", "", "", "", 
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard(){
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.setAttribute('square-id', i);
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', 'true');
        square.classList.add('square');
        const row = Math.floor((63-i) /8) + 1;
        if(row % 2 === 0){
            square.classList.add(i % 2 === 0 ? 'beige' : 'brown');
        } else {
            square.classList.add(i % 2 === 0 ? 'brown' : 'beige');
        }

        if(i < 16){
            square.firstChild.firstChild.classList.add('black');
        } else if(i >= 64-16){
            square.firstChild.firstChild.classList.add('white');
        }
        gameBoard.append(square);
    })
}

createBoard();

const allSquares = document.querySelectorAll('.square');
allSquares.forEach((square) => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})

let draggedElement
let startPositionId

function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}
function dragOver(e){
    e.preventDefault();
}
function dragDrop(e){
    e.stopPropagation();
    const opponentGo = playerGo === 'black' ? 'white' : 'black';
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    const isAnOpponentPiece = e.target.firstChild?.classList.contains(opponentGo);
    const isTherePiece = e.target.classList.contains('piece');

    if(correctGo){
        if(!isValid(e.target)){
            infoDisplay.textContent = 'This is an invalid move.';
            setTimeout(() => infoDisplay.textContent = "", 2000);
        } else if(isAnOpponentPiece){
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            checkForWin();
            changePlayer();
        } else if(!isTherePiece){
            e.target.append(draggedElement);
            changePlayer();
        } else {
            infoDisplay.textContent = 'You cannot go here.';
            setTimeout(() => infoDisplay.textContent = "", 2000);
        }
    } else {
        infoDisplay.textContent = 'This is not your turn.';
        setTimeout(() => infoDisplay.textContent = "", 2000);
    }
}

function isValid(target){
    const startId = Number(startPositionId);
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const piece = draggedElement.id;

    function isRookMoveValid(){
        for(let i = 8; i < 64 && startId + i < 64; i += 8){
            let allBeforeMeAreEmpty = true;
            for(let j = 8; j < i; j += 8){
                if(document.querySelector(`[square-id="${startId + j}"]`).firstChild){
                    allBeforeMeAreEmpty = false;
                    break;
                }
            }
            if(startId + i === targetId && allBeforeMeAreEmpty){
                return true;
            }
        }
        for(let i = -8; i > -64 && startId + i > -1; i -= 8){
            let allBeforeMeAreEmpty = true;
            for(let j = -8; j > i; j -= 8){
                if(document.querySelector(`[square-id="${startId + j}"]`).firstChild){
                    allBeforeMeAreEmpty = false;
                    break;
                }
            }
            if(startId + i === targetId && allBeforeMeAreEmpty){
                return true;
            }
        }
        let i = 0;
        const startColums = [0,8,16,24,32,40,48,56];
        const endColums = [7,15,23,31,39,47,55,63];
        while (!endColums.includes(startId + i)){
            i++;
            if(i !== 1 && document.querySelector(`[square-id="${startId + i - 1}"]`).firstChild){
                break;
            }
            if(startId + i === targetId){
                return true;
            }
        }
        i = 0;
        while (!startColums.includes(startId + i)){
            i--;
            if(i !== -1 && document.querySelector(`[square-id="${startId + i + 1}"]`).firstChild){
                break;
            }
            if(startId + i === targetId){
                return true;
            }
        }
        return false;
    }
    function isBishopMoveValid(){
        for(let i = 7; i <= 56 && startId + i < 64;i += 7){
            let allBeforeMeAreEmpty = true;
            for(let j = 7; j < i; j += 7){
                if(document.querySelector(`[square-id="${startId + j}"]`).firstChild){
                    allBeforeMeAreEmpty = false;
                    break;
                }
            }
            if(startId + i === targetId && allBeforeMeAreEmpty){
                return true;
            }
        }
        for(let i = 9; i <= 72 && startId + i < 64;i += 9){
            let allBeforeMeAreEmpty = true;
            for(let j = 9; j < i; j += 9){
                if(document.querySelector(`[square-id="${startId + j}"]`).firstChild){
                    allBeforeMeAreEmpty = false;
                    break;
                }
            }
            if(startId + i === targetId && allBeforeMeAreEmpty){
                return true;
            }
        }
        for(let i = -7; i >= -56 && startId + i > -1;i -= 7){
            let allBeforeMeAreEmpty = true;
            for(let j = -7; j > i; j -= 7){
                if(document.querySelector(`[square-id="${startId + j}"]`).firstChild){
                    allBeforeMeAreEmpty = false;
                    break;
                }
            }
            if(startId + i === targetId && allBeforeMeAreEmpty){
                return true;
            }
        }
        for(let i = -9; i >= 72 && startId + i > -1; i -= 9){
            let allBeforeMeAreEmpty = true;
            for(let j = -9; j > i; j -= 9){
                if(document.querySelector(`[square-id="${startId + j}"]`).firstChild){
                    allBeforeMeAreEmpty = false;
                    break;
                }
            }
            if(startId + i === targetId && allBeforeMeAreEmpty){
                return true;
            }
        }
        return false;
    }

    switch (piece){
        case 'pawn':
            const starterRows = [8,9,10,11,12,13,14,15];
            if(
                starterRows.includes(startId) && startId + 16 === targetId ||
                startId + 8 === targetId ||
                startId + 7 === targetId && document.querySelector(`[square-id="${targetId}"]`).firstChild||
                startId + 9 === targetId && document.querySelector(`[square-id="${targetId}"]`).firstChild
            ){
                return true;
            }
            return false;
        case 'knight':
            if(
                startId +2*8 +1 === targetId ||
                startId +2*8 -1 === targetId ||
                startId -2*8 +1 === targetId ||
                startId -2*8 -1 === targetId ||
                startId +1*8 +2 === targetId ||
                startId +1*8 -2 === targetId ||
                startId -1*8 +2 === targetId ||
                startId -1*8 -2 === targetId
            ){
                return true;
            }
            return false;
        case 'king':
            if(
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + 8 === targetId ||
                startId - 8 === targetId ||
                startId + 9 === targetId ||
                startId + 7 === targetId ||
                startId - 9 === targetId ||
                startId - 7 === targetId
            ){
                return true;
            }
            return false;
        case 'rook':
            return isRookMoveValid();
        case 'bishop':
            return isBishopMoveValid();
        case 'queen':
            return isRookMoveValid() || isBishopMoveValid();
    }
    return true;
}

function checkForWin(){
    const kings = Array.from(document.querySelectorAll('#king'));
    if(!kings.some(king => king.firstChild.classList.contains('white'))){
        infoDisplay.innerHTML = 'Black player wins';
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach((square) => {
            square.firstChild?.setAttribute('draggable', 'false');
        })
    }
    if(!kings.some(king => king.firstChild.classList.contains('black'))){
        infoDisplay.innerHTML = 'White player wins';
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach((square) => {
            square.firstChild?.setAttribute('draggable', 'false');
        })
    }
}

function changePlayer(){
    if(playerGo === 'black'){
        playerGo = "white";
        playerDisplay.textContent = playerGo;
        reverseIds();
    } else {
        playerGo = "black";
        playerDisplay.textContent = playerGo;
        revertIds();
    }
}

function reverseIds(){
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => {
        square.setAttribute('square-id', 63-i);
    })
}

function revertIds(){
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => {
        square.setAttribute('square-id', i);
    })
}
