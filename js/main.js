'use strict';

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';

document.addEventListener('contextmenu', event => event.preventDefault());

var gLevel = {
    SIZE: 8,
    MINES: 12
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    gTimer: null
};

var gBoard;

function onInit() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    onLevelSelected(8, 12);

}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isExpanded: false
            };
            board[i][j] = cell
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var className = 'cell';
            if (currCell.isShown) className += ' shown';
            if (currCell.isMine) className += ' mine';
            if (currCell.isMarked) className += ' marked';
            strHTML += `<td class="${className}"
            onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onCellMarked(this, ${i}, ${j})"
            data-i="${i}" data-j="${j}"></td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Create checkWin function
function checkWin() {
    // logs for testing
    console.log('shownCount', gGame.shownCount)
    console.log('markedCount', gGame.markedCount)
    console.log('totalCells', gLevel.SIZE * gLevel.SIZE)
    console.log('minesCounter', minesCount())
    console.log('totalMines', gLevel.MINES)

    if (gGame.shownCount === 0) return;
    var totalCells = gLevel.SIZE * gLevel.SIZE
    var shownCells = gGame.shownCount
    var markedCells = gGame.markedCount
    var totalMines = gLevel.MINES
    var minesCounter = minesCount()

    if (shownCells + markedCells === totalCells && minesCounter === totalMines) {
        // WIN
        gGame.isOn = false

        // SMILEY
        var elSmiley = document.querySelector('.smiley')
        elSmiley.innerText = '😎'

        // TIMER
        clearInterval(gGame.gTimer)
        gGame.gTimer = null

        // LIVES
        var elLives = document.querySelectorAll('.heart-icon')
        for (var i = 0; i < elLives.length; i++) {
            elLives[i].style.display = 'none'
        }

        // MINES
        var elMines = document.querySelectorAll('.mine')
        for (var i = 0; i < elMines.length; i++) {
            elMines[i].innerText = MINE
        }

        // FLAGS
        var elFlags = document.querySelectorAll('.marked')
        for (var i = 0; i < elFlags.length; i++) {
            elFlags[i].innerText = FLAG
        }

        showModal('You Won!', 'You are a true Minesweeper!')
    }
}



function startGame() {
    // GAME
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0

    // SMILEY
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = '😀'

    // LIVES
    gGame.lives = 3
    var elLives = document.querySelectorAll('.heart-icon')
    for (var i = 0; i < elLives.length; i++) {
        elLives[i].style.display = 'inline-block'
    }

    // BOARD
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = ''
    gBoard = buildBoard()
    renderBoard(gBoard)

}

function gameOver() {
    // GAME
    gGame.isOn = false

    // SMILEY
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = '😵'

    // TIMER
    gGame.secsPassed = 0
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = `TIME: ${gGame.secsPassed}`
    clearInterval(gGame.gTimer)
    gGame.gTimer = null

    // LIVES
    var elLives = document.querySelectorAll('.heart-icon')
    for (var i = 0; i < elLives.length; i++) {
        elLives[i].style.display = 'none'
    }

    // MINES
    var elMines = document.querySelectorAll('.mine')
    for (var i = 0; i < elMines.length; i++) {
        elMines[i].innerText = MINE
    }

    // FLAGS
    var elFlags = document.querySelectorAll('.marked')
    for (var i = 0; i < elFlags.length; i++) {
        elFlags[i].innerText = FLAG
    }

    showModal('Game Over', 'You lost the game!')
}

function onRestartGame() {
    hideModal();

    // RESET GAME
    gGame.isOn = false;
    gGame.secsPassed = 0;
    gGame.lives = 3;
    gGame.shownCount = 0;
    gGame.markedCount = 0;

    // RESET SMILEY
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = '😀';

    // RESET TIMER
    clearInterval(gGame.gTimer);
    gGame.gTimer = null;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = `TIME: ${gGame.secsPassed}`;

    // RESET LIVES
    var elLives = document.querySelectorAll('.heart-icon');
    for (var i = 0; i < elLives.length; i++) {
        elLives[i].style.display = 'inline-block';
    }

    // RESET BOARD
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = '';
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function onLevelSelected(SIZE, MINES) {

    // Only reset game if different level
    if (gLevel.SIZE !== SIZE || gLevel.MINES !== MINES) {

        // Set new level 
        gLevel.SIZE = SIZE;
        gLevel.MINES = MINES;

        // Reset game
        onRestartGame();
    }

    // Clear other selected buttons
    const elBtns = document.querySelectorAll('.level-btn')
    elBtns.forEach(btn => {
        btn.classList.remove('selected')
    })

    // // Mark selected button 
    // const elBtn = document.querySelector(`.level${SIZE}`)
    // elBtn.classList.add('selected')

}



function onCellClicked(elCell, i, j) {

    // START GAME
    if (!gGame.isOn) {
        startGame()

        // TIMER
        clearInterval(gGame.gTimer)
        gGame.gTimer = null
        gGame.gTimer = setInterval(function () {
            gGame.secsPassed++
            var elTimer = document.querySelector('.timer')
            elTimer.innerText = `TIME: ${gGame.secsPassed}`
        }, 1000)

        createMines(gBoard, { i, j })
    }

    // Check conditions
    var currCell = gBoard[i][j];
    if (currCell.isShown) return console.log('already shown')
    if (currCell.isMarked) return console.log('already marked')

    if (currCell.isMine) {
        // gLives--
        gGame.lives--

        // LIVES
        var heart = document.getElementById(`heart${gGame.lives + 1}`)
        heart.style.display = 'none'
        elCell.classList.add('mine')
        elCell.innerText = MINE

        // SMILEY
        var elSmiley = document.querySelector('.smiley')
        elSmiley.innerText = '😵'
        setTimeout(function () {
            elSmiley.innerText = '😀'
        }, 1000)


        // GAME OVER
        if (gGame.lives === 0) gameOver()
        return
    }

    if (currCell.minesAroundCount === 0) {
        fullExpandShow(gBoard, i, j);
    }
    if (!currCell.isShown) {
        gGame.shownCount++;
    }

    currCell.isShown = true;
    elCell.classList.add('shown');

    if (currCell.minesAroundCount > 0) {
        elCell.innerText = currCell.minesAroundCount;
        setCellColor(elCell, currCell.minesAroundCount)
    }
    checkWin()
}

function onCellMarked(elCell) {
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    var currCell = gBoard[i][j]
    if (currCell.isShown) return console.log('already shown')
    if (currCell.isMarked) {
        currCell.isMarked = false
        elCell.classList.remove('marked')
        elCell.innerText = EMPTY
        gGame.markedCount--
    } else {
        currCell.isMarked = true
        elCell.classList.add('marked')
        elCell.innerText = FLAG
        gGame.markedCount++
    }
    checkWin()
}

function fullExpandShow(board, i, j) {
    var cell = board[i][j];
    if (cell.isShown || cell.isMarked || cell.isMine || cell.isExpanded) return;

    if (cell.minesAroundCount > 0) {
        cell.isShown = true;
        gGame.shownCount++;
        var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
        elCell.classList.add('shown');
        elCell.innerText = cell.minesAroundCount;
        setCellColor(elCell, cell.minesAroundCount);
        return;
    }

    cell.isShown = true;
    cell.isExpanded = true;
    gGame.shownCount++;
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elCell.classList.add('shown');
    for (var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= board.length) continue;
        for (var l = j - 1; l <= j + 1; l++) {
            if (l < 0 || l >= board[0].length) continue;
            if (k === i && l === j) continue;
            fullExpandShow(board, k, l);
        }
    }
}

function setMinesNegsCount(board, pos) {
    var minesAroundCount = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === pos.i && j === pos.j) continue
            if (board[i][j].isMine) minesAroundCount++
        }
    }
    return minesAroundCount;
}

function createMines(board, pos) {
    var clickedCell = { i: pos.i, j: pos.j }

    for (var i = 0; i < gLevel.MINES; i++) {
        var randomPos = getRandomEmptyCell(board)
        if (randomPos.i === pos.i && randomPos.j === pos.j) {
            randomPos = getRandomEmptyCell(board)
            i--;
        } else board[randomPos.i][randomPos.j].isMine = true;
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            cell.minesAroundCount = setMinesNegsCount(board, { i, j })
        }
    }
    renderBoard(board);

    const elCell = document.querySelector(`[data-i="${clickedCell.i}"][data-j="${clickedCell.j}"]`)
    onCellClicked(elCell, clickedCell.i, clickedCell.j);
}

function getRandomEmptyCell(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (var j = 0; j < row.length; j++) {
            var cell = row[j]
            if (!cell.isMine) emptyCells.push({ i: i, j: j })
        }
    }
    var randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

// MODAL

function showModal(title, info) {
    var modal = document.getElementById('modal')
    var modalTitle = document.getElementById('modal-title')
    var modalInfo = document.getElementById('modal-info')

    modalTitle.innerText = title
    modalInfo.innerText = info

    modal.style.display = 'block'
}

function hideModal() {
    var modal = document.getElementById('modal')
    modal.style.display = 'none'
}

// TESTING FUNCTION
function minesCount() {
    var mines = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) mines++
        }
    }
    return mines
}

function setCellColor(elCell, count) {
    var color;
    switch (count) {
        case 1:
            color = 'blue';
            break;
        case 2:
            color = 'green';
            break;
        case 3:
            color = 'red';
            break;
        case 4:
            color = 'purple';
            break;
        case 5:
            color = 'maroon';
            break;
        case 6:
            color = 'turquoise';
            break;
        case 7:
            color = 'black';
            break;
        case 8:
            color = 'gray';
            break;
    }
    elCell.style.color = color;
}
