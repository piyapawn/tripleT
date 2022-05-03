// Jacob Colborn
// jacob@jakesweb.me
// tic-tac-toe

// variable declartion
var playRound = 1;
var playerSelect = "X";
var computerSelect = "O";
var computerPosition = 0;
var playArea = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var playerArea = [];
var computerArea = [];
var winRoundCheck = false;
var winMatchCheck = false;

// Turn Base Variables
// Player Stat
var playerHP = 5;
var playerDamage = 3;
// Bot Stat
var botHP = 5;
var botDamage = 2;

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
  if(!winMatchCheck){
    if (!playArea.includes(position)) {
      alert("Already played area");
    }
    else {
      document.getElementById(position).innerHTML = playerSelect;
      //console.log('Player Position: '+position);
      playerArea.push(position);
      //console.log('Player Area Push: '+playerArea)
      playerArea.sort();
      //console.log('Player Area Sort: '+playerArea)
      playArea.splice(playArea.indexOf(position), 1);
      //console.log('Play Area Splice: '+playArea)
      if (checkWin(playerArea) === 2) {
        gameRoundWin("player");
      } else if (checkWin(playerArea) === 1) {
        gameRoundWin("draw");
      } else {
        computerPlay();
      }
    }
  }
}

// computer gameplay function
function computerPlay() {
  var randPlay = parseInt(Math.random() * (playArea.length - 1));
  computerPosition = playArea[randPlay];
  //console.log('Computer Position: '+computerPosition);
  document.getElementById(computerPosition).innerHTML = computerSelect;
  computerArea.push(computerPosition);
  computerArea.sort();
  playArea.splice(playArea.indexOf(computerPosition), 1);
  if (checkWin(computerArea) === 2) {
    gameRoundWin("computer");
  } else if (checkWin(computerArea) === 1) {
    gameRoundWin("draw");
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
      winRoundCheck = true;
    }
    else if (
      textArray.includes(3) &&
      textArray.includes(4) &&
      textArray.includes(5)
    ) {
      winRoundCheck = true;
    }
    else if (
      textArray.includes(6) &&
      textArray.includes(7) &&
      textArray.includes(8)
    ) {
      winRoundCheck = true;
    }
    // Check Vertical Win
    else if (
        textArray.includes(0) &&
        textArray.includes(3) &&
        textArray.includes(6)
      ) {
        winRoundCheck = true;
    }
    else if (
      textArray.includes(1) &&
      textArray.includes(4) &&
      textArray.includes(7)
    ) {
      winRoundCheck = true;
    }
    else if (
      textArray.includes(2) &&
      textArray.includes(5) &&
      textArray.includes(8)
    ) {
      winRoundCheck = true;
    }
    // Check Diagonal Win
    else if (
      textArray.includes(0) &&
      textArray.includes(4) &&
      textArray.includes(8)
    ) {
      winRoundCheck = true;
    }
    else if (
      textArray.includes(2) &&
      textArray.includes(4) &&
      textArray.includes(6)
    ) {
      winRoundCheck = true;
    }
    else {
      winRoundCheck = false;
    }
  }
  if (winRoundCheck) {
    return 2;
  }
  if (playArea.length === 0) {
    return 1;
  }
}

// display win messages
// parameter: winners name
function gameRoundWin(winner) {
  if (winner === "player") {
    alert("You are the winner!");
  }
  else if (winner === "draw") { 
    alert("The game is a draw");
  }
  else {
    alert("The computer is the winner!");
  }
  
  attackEnemies();
}

function attackEnemies(){
    if(checkWin(playerArea) === 2){
        botHP -= playerDamage;
        document.getElementById('playerHP2').innerHTML = botHP;
    }
    else if(checkWin(computerArea) === 2){
        playerHP -= botDamage;
        document.getElementById('playerHP1').innerHTML = playerHP;
    }

    //console.log(checkWin(playerArea));
    //console.log(checkWin(computerArea));
    //console.log('Player HP: '+playerHP);
    //console.log('Bot HP: '+botHP);
    gameRoundReset();
    gameMatchWin();
}

function gameMatchWin(){
    if(playerHP <= 0 && playRound <= 10){
        alert('Bot Win!');
        document.getElementById('playerHP1').innerHTML = 0;
        document.getElementById('roundText').innerHTML = 'Winner : Player 2!';
        document.getElementById('round').innerHTML = '';
        document.querySelector('#reMatch').disabled = false;
        winMatchCheck = true;
    }
    else if(botHP <= 0 && playRound <= 10){
        alert('Player Win!');
        document.getElementById('playerHP2').innerHTML = 0;
        document.getElementById('roundText').innerHTML = 'Winner : Player 1!';
        document.getElementById('round').innerHTML = '';
        document.querySelector('#reMatch').disabled = false;
        winMatchCheck = true;
    }
    else if(playRound == 10){
        document.getElementById('roundText').innerHTML = 'GAME DRAW';
        document.getElementById('round').innerHTML = '';
        document.querySelector('#reMatch').disabled = false;
        winMatchCheck = true;
    }
}
// reset variables to default, reset to game
// selection frame
function gameRoundReset(){
    if(winMatchCheck){
        playRound = 1;
    }
    else if(!winMatchCheck){
        playRound++;
    }
    console.log('Win?: '+winMatchCheck)
    playerSelect = "X";
    computerSelect = "O";
    computerPosition = 0;
    playArea = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    playerArea = [];
    computerArea = [];
    winRoundCheck = false;
    
    document.getElementById('round').innerHTML = playRound;

    //Reset Table
    for(i = 0; i < 9; i++){
      document.getElementById(i).innerHTML = '';
    }
    
    console.log('Game Reset');
}

function gameMatchReset(){
    playerHP = 5;
    playerDamage = 3;
    botHP = 5;
    botDamage = 2;
    
    document.getElementById('playerHP1').innerHTML = playerHP;
    document.getElementById('playerHP2').innerHTML = botHP
    document.getElementById('roundText').innerHTML = 'Round : ';
    //document.getElementById('round').innerHTML = '1';

    gameRoundReset();
    winMatchCheck = false;
    document.querySelector('#reMatch').disabled = true;
}

function surrenderGame(){
    alert('Bot Win!');
    window.location.replace('index.html');
}