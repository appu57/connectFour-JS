const row = 6;
const columns = 7;
var currentColumns = [];
var board;
var gameComplete = false;
var player1 = true;

window.onload = function () {
    setGameBoard();
}

function setGameBoard() {
    board = [];
    currentColumns = [5, 5, 5, 5, 5, 5, 5] //we have 7 columns according to array index starts with 0 so the row index is [0,1,2,3,4,5] and when ever user clicks on column "x" then always the color ball will go sit in the last row  of that last column so initially it is 5 ,once u set the cell to red/yellow then reduce curentColumns[column]-- which means the least row(5) for that column is not empty so now the least row(4) would be the last but one row 
    for (let r = 0; r < row; r++) {
        let rows = [];
        for (let c = 0; c < columns; c++) {
            rows.push(" ");
            let gridcell = document.createElement("div");
            gridcell.id = r.toString() + "_" + c.toString();
            gridcell.classList.add("grid-cell");
            gridcell.addEventListener("click", dropTheColor);
            document.querySelector(".game-board").append(gridcell);
        }
        board.push(rows);//2d array to store the user entry 
    }
}

let timeout;
let debounceTimeOut;
function dropTheColor() {
    clearTimeout(debounceTimeOut);
    debounceTimeOut = setTimeout(() => { //adding debounce prevents user from adding many grid cells at once doesn't allow user to do multiple click event
        let coordsOfTheParticularColumn = this.id.split("_"); //we get the ith index and jth index of the tile we selected 
        let r = parseInt(coordsOfTheParticularColumn[0]);
        let c = parseInt(coordsOfTheParticularColumn[1]);

        r = currentColumns[c]; //get the least row of the column where we can set color ball
        if (r < 0) //no cells left to set the color ball in the columm
        {
            return;
        }
        if (board[r][c] == " ") {
            board[r][c] = player1 ? "red" : "yellow";
            let gridCell = document.getElementById(r.toString() + "_" + c.toString());
            if (player1) {
                gridCell.classList.add("red-grid");
                setTimeout(checkWinner, 50);
                currentColumns[c] = r - 1;
                timeout = setTimeout(ComputerMove,100); //because the computerMove was called first even before above were executed 
            }

        }
        setTimeout(checkWinner, 200);
    }, 170);
}

function ComputerMove() {
    let moves = winningMoves("red", 4) || winningMoves("yellow", 4);
    if (moves == true) {
        dropComputerMove();
    }
    else {
        moves = winningMoves("red", 3) || winningMoves("yellow", 3);
        if (moves == true) {
            dropComputerMove();
        }
        else {
            makeRandomMove();
        }
    }
}

var selectedRow = 0, selectedColumn = 0;
function winningMoves(type, checkForCount) {

    for (let i = row - 1; i >= 0; i--) {
        for (let j = columns - 1; j >= 0; j--) {
            if (checkCount(type, i, j, 0, 1, checkForCount) == checkForCount)//colum wise right to left since we are moving from last row 
            {
                return true;
            }
            if (checkCount(type, i, j, 1, 0, checkForCount) == checkForCount)//column wise right to left
            {
                return true;
            }
            if (checkCount(type, i, j, -1, 0, checkForCount) == checkForCount) {
                return true;
            }
            if (checkCount(type, i, j, 0, -1, checkForCount) == checkForCount) {
                return true;
            }
            if (checkCount(type, i, j, -1, -1, checkForCount) == checkForCount) {
                return true;
            }
        }
    }

    return false;


}


function checkCount(type, r, c, dr, dc, checkForCount) {
    let count = 0;
    let i = r;
    let j = c;
    while (i >= 0 && j >= 0 && i < row && j < columns && (board[i][j] == type || count == checkForCount - 1 && board[i][j] == " ")) { //if in condition only board[i][j]==type is given we wont enter a loop where board[i][j] = " " . Only if count has become equal to checkForCount -1 it means there exists checkForCount -1 consecutive gridCell with same type now to block that we should check if the next gridCell is empty 
        if (board[i][j] == type && count <= checkForCount - 1) {
            count = count + 1;
        }
        i += dr;
        j += dc;
        if (i >= 0 && j >= 0 && i < row && j < columns && currentColumns[j] == i && board[i][j] == " ") { //columns[j]==i because we have to check if i is the least grid-cell to drop or is there is empty grid cell below 
            count = count + 1;
            selectedColumn = j;
            selectedRow = i;
            return count;
        }
    }
    return count == checkForCount ? checkForCount : 0;

}

function dropComputerMove() {
    const id = selectedRow.toString() + "_" + selectedColumn.toString();
    const gridCell = document.getElementById(id);
    gridCell.classList.add("yellow-cell");
    currentColumns[selectedColumn] = parseInt(selectedRow) - 1;
    board[selectedRow][selectedColumn] = "yellow";

}

function makeRandomMove() {
    for (let i = row - 1; i >= 0; i--) {
        for (let j = columns - 1; j >= 0; j--) {
            if (board[i][j] == " ") {
                const id = i.toString() + "_" + j.toString();
                const gridCell = document.getElementById(id);
                gridCell.classList.add("yellow-cell");
                board[i][j] = "yellow";
                currentColumns[j] = i - 1;
                return;
            }
        }
    }
}

function checkForDiagonal(type, checkForCount, i, j, dr, dc) {
    let count = 0;
    while (i >= 0 && j >= 0 && i < row && j < columns && (board[i][j] == type || board[i][j] == " ")) {
        if (board[i][j] == type && count <= checkForCount - 1) {
            count = count + 1;
        }
        i += dr;
        j += dc;
        if (i >= 0 && j >= 0 && i < row && j < columns && currentColumns[j] == i && board[i][j] == " ") {
            selectedColumn = j;
            selectedRow = i;
            count++
            return count;
        }
    }
    return count;
}

function checkWinner() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c + 1] && board[r][c + 1] == board[r][c + 2] && board[r][c + 2] == board[r][c + 3]) {
                    setWinner(board[r][c]);
                    return;
                }
            }
        }
    }

    // vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < row - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r + 1][c] && board[r + 1][c] == board[r + 2][c] && board[r + 2][c] == board[r + 3][c]) {
                    setWinner(board[r][c]);
                    return;
                }
            }
        }
    }

    // anti diagonal
    for (let r = 0; r < row - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r + 1][c + 1] && board[r + 1][c + 1] == board[r + 2][c + 2] && board[r + 2][c + 2] == board[r + 3][c + 3]) {
                    setWinner(board[r][c]);
                    return;
                }
            }
        }
    }

    // diagonal
    for (let r = 3; r < row; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r - 1][c + 1] && board[r - 1][c + 1] == board[r - 2][c + 2] && board[r - 2][c + 2] == board[r - 3][c + 3]) {
                    setWinner(board[r][c]);
                    return;
                }
            }
        }
    }

}
const winnerdisplay = document.querySelector(".winner-display");
function setWinner(type) {
    let text;
    if (type == "red") {
        text = "Congragulation Player 1 won the match !!"
    }
    else {
        text = "Congratulations Computer won the match !!"
    } clearTimeout(timeout);
    removeEvent();

    winnerdisplay.innerHTML = text
}

const gridCell = document.querySelectorAll(".grid-cell");
function removeEvent() {
    console.log(gridCell)
    gridCell.forEach((grid) => {
        console.log(grid);
        grid.classList.remove(".grid-cell")
    })
}