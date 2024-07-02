let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let cells = document.querySelectorAll("td");
let currentCell;

// url de la API del proyecto en mockapi
fetch('https://my.api.mockaroo.com/preguntas.json?key=84030ec0')
    .then(response => response.json())
    .then(data => {
        window.questions = data;
    });

cells.forEach((cell, index) => { 
    cell.addEventListener("click", () => handleClick(index));
});

function handleClick(index) {
    if (board[index] !== "") return;
    currentCell = index;
    showQuestion();
}

function showQuestion() {
    let question = window.questions[Math.floor(Math.random() * window.questions.length)];
    document.getElementById('questionText').textContent = question.Pregunta;
    
    let answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';

    [question.Respuesta1, question.Respuesta2, question.Respuesta3].forEach((answer, i) => {
        let answerElement = document.createElement('button');
        answerElement.className = 'list-group-item list-group-item-action';
        answerElement.textContent = answer;
        answerElement.onclick = () => checkAnswer(question, i + 1);
        answersContainer.appendChild(answerElement);
    });

    $('#questionModal').modal('show');
}

function checkAnswer(question, selected) {
    $('#questionModal').modal('hide');
    if (question.Verdadera === selected) {
        board[currentCell] = currentPlayer;
        cells[currentCell].textContent = currentPlayer;
        if (checkWin()) {
            setTimeout(() => alert(`${currentPlayer} ganó!`), 100);
        }
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    } else {
        alert('Respuesta incorrecta. Intenta de nuevo.');
    }
}

function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
        [0, 4, 8], [2, 4, 6] // Diagonales
    ];

    for (let condition of winConditions) {
        if (condition.every(index => board[index] === currentPlayer)) {
            return true;
        }
    }
    return false;
}