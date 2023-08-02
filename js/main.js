'use strict'

// TODO LIST
// GAME OVER
// WIN
// TIMER
// CSS  
// LIVES
// SMILEY BUTTON
// BUTTONS FOR DIFFRENT LEVELS
// START GAME

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''

document.addEventListener('contextmenu', event => event.preventDefault())

var gLevel = {
    SIZE: 8,
    MINES: 12
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
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
                info: EMPTY
            }
            board[i][j] = cell
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var className = 'cell'
            if (currCell.isShown) className += ' shown'
            if (currCell.isMine) className += ' mine'
            if (currCell.isMarked) className += ' marked'
            strHTML += `<td class="${className}"
            onclick="onCellClicked(this, ${i}, ${j})"
            oncontextmenu="onCellMarked(this, ${i}, ${j})"
            data-i="${i}" data-j="${j}"></td>`
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// TODO - FIX THIS FUNCTION
function onCellClicked(elCell, i, j) {
    // console.log('elCell', elCell);
    // console.log('gBoard', gBoard);
    // console.log('gGame', gGame);
    // console.log('gGame.shownCount', gGame.shownCount);
    // console.log('gGame.markedCount', gGame.markedCount);
    // console.log('gGame.secsPassed', gGame.secsPassed);
    // console.log('gLevel.SIZE', gLevel.SIZE);
    // console.log('gLevel.MINES', gLevel.MINES);
    // console.log('minesCount', minesCount());



    var currCell = gBoard[i][j]
    console.log(currCell.minesAroundCount);
    // gBoard[5][5].isMine = true
    if (!gGame.isOn) {
        startGame()
        createMines(gBoard, { i: i, j: j })
    }

    console.log('HERE');
    if (currCell.isShown) return console.log('already shown');
    if (currCell.isMarked) return console.log('already marked');
    if (currCell.isMine) {
        console.log('Game Over');
        // gameOver()
        return
    }

    currCell.isShown = true
    elCell.classList.add('shown')
    gGame.shownCount++

    if (currCell.minesAroundCount > 0) {
        console.log('im here');
        switch (currCell.minesAroundCount) {
            case 1:
                elCell.style.color = 'blue'
                break;
            case 2:
                elCell.style.color = 'green'
                break;
            case 3:
                elCell.style.color = 'red'
                break;
            case 4:
                elCell.style.color = 'purple'
                break;
            case 5:
                elCell.style.color = 'maroon'
                break;
            case 6:
                elCell.style.color = 'turquoise'
                break;
            case 7:
                elCell.style.color = 'black'
                break;
            case 8:
                elCell.style.color = 'gray'
                break;
        }
        elCell.innerText = currCell.minesAroundCount
        console.log('elcell', elCell);
    }
}

function onCellMarked(elCell) {
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    var currCell = gBoard[i][j]
    if (currCell.isShown) return console.log('already shown');
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
}

// TODO - FIX THIS FUNCTION
function startGame() {
    gGame.isOn = true
    var elBtn = document.querySelector('.btn')
    elBtn.innerText = '😀'
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
}

function setMinesNegsCount(board, pos) {
    var minesAroundCount = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === pos.i && j === pos.j) continue
            if (board[i][j].isMine) minesAroundCount++
        }
    }
    return minesAroundCount
}

function createMines(board, pos) {
    var clickedCell = { i: pos.i, j: pos.j }

    for (var i = 0; i < gLevel.MINES; i++) {
        var randomPos = getRandomEmptyCell(board);
        if (randomPos.i === pos.i && randomPos.j === pos.j) {
            randomPos = getRandomEmptyCell(board)
            i--
        } else
            board[randomPos.i][randomPos.j].isMine = true
    }

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            cell.minesAroundCount = setMinesNegsCount(board, { i, j })
        }
    }
    renderBoard(board)

    const elCell = document.querySelector(`[data-i="${clickedCell.i}"][data-j="${clickedCell.j}"]`);
    onCellClicked(elCell, clickedCell.i, clickedCell.j)
}

function getRandomEmptyCell(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        for (var j = 0; j < row.length; j++) {
            var cell = row[j]
            if (!cell.isMine) emptyCells.push({ i: i, j: j })
        }
    }
    var randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// TESTING FUNCTION
function minesCount() {
    var mines = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) mines++
        }
    }
    return mines
}