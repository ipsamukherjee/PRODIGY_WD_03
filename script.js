const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const restartBtn = document.getElementById("restartBtn");

const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");

let currentPlayer = "X";
let running = false;
let board = ["", "", "", "", "", "", "", "", ""];
let aiMode = false;

const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", cellClicked));
restartBtn.addEventListener("click", restartGame);

pvpBtn.addEventListener("click", () => {
    aiMode = false;
    restartGame();
    statusText.textContent = "Player X's Turn";
});

aiBtn.addEventListener("click", () => {
    aiMode = true;
    restartGame();
    statusText.textContent = "You (X) vs AI (O)";
});

function cellClicked() {
    const index = this.dataset.index;

    if (board[index] !== "" || !running) return;

    board[index] = currentPlayer;
    this.textContent = currentPlayer;

    if (checkWinner()) return;

    changePlayer();

    if (aiMode && currentPlayer === "O") {
        setTimeout(aiMove, 400);
    }
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

/* AI LOGIC */
function aiMove() {
    // 1. Try winning
    for (let [a,b,c] of winConditions){
        if (board[a] === "O" && board[b] === "O" && board[c] === "") return placeAI(c);
        if (board[a] === "O" && board[c] === "O" && board[b] === "") return placeAI(b);
        if (board[b] === "O" && board[c] === "O" && board[a] === "") return placeAI(a);
    }

    // 2. Block player X
    for (let [a,b,c] of winConditions){
        if (board[a] === "X" && board[b] === "X" && board[c] === "") return placeAI(c);
        if (board[a] === "X" && board[c] === "X" && board[b] === "") return placeAI(b);
        if (board[b] === "X" && board[c] === "X" && board[a] === "") return placeAI(a);
    }

    // 3. Random move
    let emptyCells = board.map((v,i)=>v===""?i:null).filter(i=>i!==null);
    const randIndex = emptyCells[Math.floor(Math.random()*emptyCells.length)];
    placeAI(randIndex);
}

function placeAI(index){
    board[index] = "O";
    cells[index].textContent = "O";
    if (checkWinner()) return;
    changePlayer();
}

function checkWinner() {
    for (let [a,b,c] of winConditions){
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            running = false;
            highlightWin(a,b,c);
            statusText.textContent = `🎉 Player ${board[a]} Wins!`;
            return true;
        }
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw 😶!";
        running = false;
        return true;
    }
    return false;
}

function highlightWin(a,b,c){
    cells[a].classList.add("win");
    cells[b].classList.add("win");
    cells[c].classList.add("win");
}

function restartGame(){
    board = ["","","","","","","","",""];
    currentPlayer = "X";
    running = true;

    cells.forEach(cell=>{
        cell.textContent = "";
        cell.classList.remove("win");
    });

    statusText.textContent = aiMode ? "You (X) vs AI (O)" : "Player X's Turn";
}
