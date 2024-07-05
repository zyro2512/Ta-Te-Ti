let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let cells = document.querySelectorAll("td");
let currentCell;

//  Esta funcion obtiene datos de la URL proporcionada y los almacena en la variable window.questions
fetch('https://my.api.mockaroo.com/preguntas.json?key=84030ec0')
    .then(response => response.json())
    .then(data => {
        window.questions = data;
    });

//  Esta funcion agrega un controlador de eventos de clic a cada celda
//  lo que permite ejecutar la función handleClick cuando se hace clic en una celda específica.
cells.forEach((cell, index) => { 
    cell.addEventListener("click", () => handleClick(index));
});

//esta funcion verifica si la celda está vacía
//actualiza la variable currentCell y luego muestra una pregunta.
function handleClick(index) {
    if (board[index] !== "") return;
    currentCell = index;
    showQuestion();
}

// Esta funcion toma una pregunta al azar del arreglo window.questions, calcula un indice con Math.random
// y lo redondea hacia abajo con Math.floor, despues actualiza el texto de la pregunta con questio.text
// tambien crea botones y agrega un controlador de eventos Onclick para cada respuesta 
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

//Esta funcion hace un check a la respuesta seleccionada, si coincide a respuesta entonces se ocupa la casilla
// luego se llama a la funcion checkwin.
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

// Esta funcio hace un check si el jugador ocupa 3 casillas alineadas como dicta la funcion
// para cada combinacion WinConditions mira si las casillas estan ocupadas con el mismo simbolo de currentPlayer
// de ser asi, la funcion devuelve true y termina
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