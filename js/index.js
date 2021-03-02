const X = 'X';
const O = 'O';
let turn = X;
let gameType = 3;
let turns = 0;
let finishGame = false;
let playerName1 = '';
let playerName2 = '';

const selections = [];
selections[X] = [];
selections[O] = [];

const scores = [];
scores[X] = 0;
scores[O] = 0;


// La funcion permite resetear cada valor usado para el juego
const resetParams = () => {
  window.scroll(0,0)
  turn = X;
  gameType = 3;
  turns = 0;
  finishGame = false;
  selections['X'] = [];
  selections[O] = [];
  document.getElementById("winner").innerHTML = ""
  document.getElementById("error").innerHTML = ""
}


// Realiza el cambio de jugador
const changeTurn = () => turn = (turn === X) ? O : X;

// Se cargan todas las posibles matrices o filas ganadoras y se verifica si hay ganador
const winnerPatterns = () => {
  let wins = [];
  if (gameType === 3) wins = [
    [11, 12, 13], [21, 22, 23], [31, 32, 33],
    [11, 21, 31], [12, 22, 32], [13, 23, 33],
    [11, 22, 33], [13, 22, 31]
  ];

  return wins
}

// Se verifica si existe o no ganador dependiendo de la funcion winnerPatters y dependiendo del resultado se puede
// o no continuar.
const checkWinner = () => {

  let selected = selections[turn].sort();
  let win_patterns = winnerPatterns();
  finishGame = false;

  if ((turns === (gameType * gameType)) && finishGame === false) {
    document.getElementById("winner").innerHTML = "Los jugadores han empatado"
    finishGame = true;
    disableAllBoxes();
  }

  for (let x = 0; x < win_patterns.length; x++) {
    if (finishGame !== true) {
      finishGame = isWinner(win_patterns[x], selections[turn]);
      if (finishGame === true) {
        scoreUpdate(turn);
        disableAllBoxes();
        document.getElementById("winner").innerHTML = `El Jugador ${(turn === X) ? playerName1 :  playerName2}`
        break;
      }
    }
  }
}

// se recorre el array desde X y desde O buscando la linea de 3 que permita ganar
const isWinner = (winPat, selections) => {
  let match = 0;

  for (let x = 0; x < winPat.length; x++) {
    for (let o = 0; o < selections.length; o++) {
      if (winPat[x] == selections[o]) {
        match++;
      }
    }
  }

  return (match === winPat.length)
}

// Bloquea la matriz una vez que termina el juego
const disableAllBoxes = () => {
  let elements = document.getElementsByClassName("grid-box");
  for (let element of elements) {
    element.disabled = true;
  }
}

// Permite obtener los nombres de los jugadores
const getValues = () => {
  playerName1 = document.getElementById("player1").value
  playerName2 = document.getElementById("player2").value
  generateGame(playerName1, playerName2)
}


/*
Metodo mas importante de la clase, se encarga de generar un juego nuevo verificando primero si los parametros
de nombre de jugador 1 y 2 se ingresaron
*/
function generateGame(player1, player2) {

  if (player1.length < 1 || player2.length < 1) {
    document.getElementById("error").innerHTML = "Deben ingresarse ambos jugadores"
    return
  }
  resetParams();
  document.getElementById('game-board').innerHTML = '';

  // Generamos el tablero el cual antes de hacerlo se verifica que los usuarios esten cargados y no sean nulos
  for (let row = 1; row <= gameType; row++) {
    for (let col = 1; col <= gameType; col++) {
      let unique_name = `grid-${row}-${col}`;
      let unique_id = `${row}${col}`;
      let button = document.createElement("input");

      button.setAttribute("value", ' ');
      button.setAttribute("id", unique_id);
      button.setAttribute("name", unique_name);
      button.setAttribute("class", 'grid-box');
      button.setAttribute("type", 'button');
      button.setAttribute("onclick", "markCheck(this)");
      document.getElementById('game-board').appendChild(button);
    }

    let breakline = document.createElement("br");
    document.getElementById('game-board').appendChild(breakline);
  }

}


// Seteo el valor de X o O
const markCheck = (obj) => {
  obj.value = turn;
  turns++;
  obj.setAttribute("class", `${(turn === X) ? 'green' : 'red'}-player`);
  obj.setAttribute("disabled", 'disabled');
  selections[turn].push(Number(obj.id));
  checkWinner();
  changeTurn();
}


// Verifico intersecciones comparando jugadores y resultados
const intersectionArray = (x, y) => {

  let response = [];
  for (let i = 0; i < x.length; i++) {
    for (let z = 0; z < y.length; z++) {
      if (x[i] === y[z]) {
        response.push(x[i]);
        break;
      }
    }
  }
  return response;

}

// Se Actualiza el historial
const scoreUpdate = (turn) => {
  scores[turn]++;
  document.getElementById(`score-${turn}`).innerHTML = scores[turn];
}
