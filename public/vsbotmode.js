// Jacob Colborn
// jacob@jakesweb.me
// tic-tac-toe

// variable declartion
var playerSelect = "X";
var computerSelect = "O";
var computerPosition = 0;
var playArea = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var playCount = 1;
var playerArea = [];
var computerArea = [];
var winTest = false;

// start play, select the player choice/computer
// choice, switch from select frame to game frame
//function gameStart(player) {
//  console.log(computerArea);
//  $("#selector").hide();
//  $("#game").show();
//
//  if (player === "o") {
//    computerSelect = "x";
//  } else {
//    computerSelect = "o";
//  }
//
//  playerSelect = player;
//}

// player gameplay function
function gamePlay(position) {
  position = parseInt(position);
  //console.log('Player Position: '+position);
  //console.log('Play Area: '+playArea)
  //console.log('Player Area: '+playerArea)
  if (!playArea.includes(position)) {
    alert("Already played area");
  }
  else {
    document.getElementById(position).innerHTML = playerSelect;
    console.log('Player Position: '+position);
    playerArea.push(position);
    //console.log('Player Area Push: '+playerArea)
    playerArea.sort();
    //console.log('Player Area Sort: '+playerArea)
    playArea.splice(playArea.indexOf(position), 1);
    //console.log('Play Area Splice: '+playArea)
    if (checkWin(playerArea) === 2) {
      gameWin("player");
    } else if (checkWin(playerArea) === 1) {
      gameWin("draw");
    } else {
      computerPlay();
    }
  }
}

// computer gameplay function
function computerPlay() {
  var randPlay = parseInt(Math.random() * (playArea.length - 1));
  computerPosition = playArea[randPlay];
  console.log('Computer Position: '+computerPosition);
  document.getElementById(computerPosition).innerHTML = computerSelect;
  computerArea.push(computerPosition);
  computerArea.sort();
  playArea.splice(playArea.indexOf(computerPosition), 1);
  if (checkWin(computerArea) === 2) {
    gameWin("computer");
  } else if (checkWin(computerArea) === 1) {
    gameWin("draw");
  }
  computerPosition = 0;
}

// check for win conditions
// parameter: array of played fields
function checkWin(textArray) {
  if (textArray.length >= 3) {
    // Check Horizontal Win
    if (
      textArray.includes(0) &&
      textArray.includes(1) &&
      textArray.includes(2)
    ) {
      winTest = true;
    }
    else if (
      textArray.includes(3) &&
      textArray.includes(4) &&
      textArray.includes(5)
    ) {
      winTest = true;
    }
    else if (
      textArray.includes(6) &&
      textArray.includes(7) &&
      textArray.includes(8)
    ) {
      winTest = true;
    }
    // Check Vertical Win
    else if (
        textArray.includes(0) &&
        textArray.includes(3) &&
        textArray.includes(6)
      ) {
        winTest = true;
    }
    else if (
      textArray.includes(1) &&
      textArray.includes(4) &&
      textArray.includes(7)
    ) {
      winTest = true;
    }
    else if (
      textArray.includes(2) &&
      textArray.includes(5) &&
      textArray.includes(8)
    ) {
      winTest = true;
    }
    // Check Diagonal Win
    else if (
      textArray.includes(0) &&
      textArray.includes(4) &&
      textArray.includes(8)
    ) {
      winTest = true;
    }
    else if (
      textArray.includes(2) &&
      textArray.includes(4) &&
      textArray.includes(6)
    ) {
      winTest = true;
    }
    else {
      winTest = false;
    }
  }
  if (winTest) {
    return 2;
  }
  if (playArea.length === 0) {
    return 1;
  }
}

// display win messages
// parameter: winners name
function gameWin(winner) {
  if (winner === "player") {
    alert("You are the winner!");
  }
  else if (winner === "draw") { 
    alert("The game is a draw");
  }
  else {
    alert("The computer is the winner!");
  }
  gameReset();
}

// reset variables to default, reset to game
// selection frame
function gameReset() {
  playerSelect = "";
  computerSelect = "";
  computerPosition = 0;
  playArea = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  playCount = 1;
  playerArea = [];
  computerArea = [];
  winTest = false;

  //Reset Table
  for(i = 0; i < 9; i++){
    document.getElementById(i).innerHTML = '';
  }

  console.log('Game Reset');
}