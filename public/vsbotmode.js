// Jacob Colborn
// jacob@jakesweb.me
// tic-tac-toe

// ref จาก GameInfo, Room
const refUserInfo = firebase.database().ref('UserInfo')

// variable declartion
var playRound = 1;
var playTurn = 'X';
var playerSelect = "X";
var computerSelect = "O";
var computerPosition = 0;
var playArea = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var playerArea = [];
var computerArea = [];
var winRoundCheck = false;
var winMatchCheck = false;

refUserInfo.on('value', snapshot => {
  showStat(snapshot);
})

/* Turn Base Variables */
// Player Stat
let playerName;
let playerCharType;
let playerHP;
let playerDamage;
let playerImgSource
let playerWin;

// Bot Stat
let botCharType;
let botHP;
let botDamage;
let botImgSource
let botWin;

function showStat(snapshot){
  const currentUser = firebase.auth().currentUser;
  const currentEmail = currentUser.email;
  const currentUid = currentUser.uid;
  let adIndex = currentEmail.indexOf("@");
  let currentPlayer = currentEmail.slice(0, adIndex);
  let current_User = currentPlayer.replace('.', '_');

  const userInfos = snapshot.child(current_User).child('user-stat').val();
  if(snapshot.child(current_User).child('user-stat').exists()){
    Object.keys(userInfos).forEach(key => {
      switch(key){
        case 'name':
          playerName = userInfos[key];
          break
        case 'char-type':
          playerCharType = userInfos[key];
          break
        case 'hp':
          playerHP = userInfos[key];
          break
        case 'damage':
          playerDamage = userInfos[key];
          break
        case 'imgSource':
          playerImgSource = userInfos[key];
          break
        case 'win':
          playerWin = userInfos[key];
          break
      }
    })
  }

  const botInfos = snapshot.child(current_User).child('bot-stat').val();
  if(snapshot.child(current_User).child('bot-stat').exists()){
    Object.keys(botInfos).forEach(key => {
      switch(key){
        case 'char-type':
          botCharType = botInfos[key];
          break
        case 'hp':
          botHP = botInfos[key];
          break
        case 'damage':
          botDamage = botInfos[key];
          break
        case 'imgSource':
          botImgSource = botInfos[key];
          break
        case 'win':
          botWin = botInfos[key];
          break
      }
    })
  }
  
  console.log('Player X : '+playerName);
  console.log(playerCharType);
  console.log('HP : '+playerHP);
  console.log('Damage : '+playerDamage);
  console.log("ImgSource: "+ playerImgSource);

  console.log(botCharType);
  console.log('HP : '+botHP);
  console.log('Damage : '+botDamage);
  console.log("ImgSource: "+ botImgSource);

  showInfo();
  gameMatchWin();
}

function showInfo(){
  // Show Player Stat
  $('#player1name').html('Player X : '+playerName);
  $('#charXName').html(playerCharType);
  $('#charXHP').html('HP : '+playerHP);
  $('#charXDamage').html('Damage : '+playerDamage);
  $('#imageX').attr("src", playerImgSource);

  // Show Bot Stat
  $('#charOName').html(botCharType);
  $('#charOHP').html('HP : '+botHP);
  $('#charODamage').html('Damage : '+botDamage);
  $('#imageO').attr("src", botImgSource);
}

let intervalID;
let timeCount;

// player gameplay function
function gamePlay(position) {
  position = parseInt(position);
  //console.log('Player Position: '+position);
  //console.log('Play Area: '+playArea)
  //console.log('Player Area: '+playerArea)
  if(!winMatchCheck){
    if(playTurn == 'X'){
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
        updateTurn('O');
        if (checkWin(playerArea) === 2) {
          gameRoundWin("player");
        } else if (checkWin(playerArea) === 1) {
          gameRoundWin("draw");
        } else {
          timeCount = 2;
          intervalID = setInterval(delayBot, 1000);
        }
      }
    }
  }
}

// computer gameplay function
function computerPlay() {
  if(playTurn == 'O'){
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
    updateTurn('X');
  }
}

// delay ให้บอทคิด
function delayBot(){
  if(timeCount >= 0){
    document.getElementById("timeCountdownText").style.visibility = 'visible';
    $("#timeCountdownText").html('Bot thinks . . . '+timeCount+' s');
    timeCount--;
  }
  else{
    document.getElementById("timeCountdownText").style.visibility = 'hidden';
    computerPlay();
    clearInterval(intervalID);
  }
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
    attackEnemies(winner, playerDamage);
  }
  else if (winner === "computer") {
    attackEnemies(winner, botDamage);
  }
  else {
    timeCountdownRound = 3;
    intervalIDRound = setInterval(gameRoundReset, 1000, winner)
  }
}

function updateTurn(turn){
  playTurn = turn;
  $('#turnText').html('Turn : '+playTurn);
}

function updateRound(){
  playRound++;
  $('#round').html(playRound);
}

let timeCountdownRound;
let intervalIDRound;

function attackEnemies(winner, damage){
  const currentUser = firebase.auth().currentUser;
  const currentEmail = currentUser.email;
  const currentUid = currentUser.uid;
  let adIndex = currentEmail.indexOf("@");
  let currentPlayer = currentEmail.slice(0, adIndex);
  let current_User = currentPlayer.replace('.', '_');

  console.log('Attack Function');

  if(winner === "player"){
    console.log('Winner : Player');
    if(botHP-damage <= 0){
      botHP = 0;
      //timeCountdownEndGame = 5;
      //intervalIDgameMatch = setInterval(endMatchGame, 1000, winner);
    }
    else{
      botHP = botHP - damage;
      updateRound();
      console.log('Player X attacks Player O');
      timeCountdownRound = 3;
      intervalIDRound = setInterval(gameRoundReset, 1000, winner)
    }
    refUserInfo.child(current_User).child('bot-stat').update({
        ['hp']: botHP,
    })
  }
  else if(winner === "computer"){
    if(playerHP-damage <= 0){
      playerHP = 0;
    }
    else{
      playerHP = playerHP - damage;
      updateRound();
      timeCountdownRound = 3;
      intervalIDRound = setInterval(gameRoundReset, 1000, winner)
    }
    refUserInfo.child(current_User).child('user-stat').update({
        ['hp']: playerHP,
    })
  }
  
  //console.log(checkWin(playerArea));
  //console.log(checkWin(computerArea));
  //console.log('Player HP: '+playerHP);
  //console.log('Bot HP: '+botHP);
}

// reset variables to default, reset to game
// selection frame
function gameRoundReset(winner){
  if(timeCountdownRound >= 0){
    document.getElementById("timeCountdownText").style.visibility = 'visible';
    $('#timeCountdownText').html('Next Round start in . . . '+timeCountdownRound+' s');
    
    if(winner == 'draw'){
      $('#turnText').html('Gamw Draw');
    }
    else{
      $('#turnText').html('Winner : '+winner);
    }
    timeCountdownRound--;
  }
  else{
    document.getElementById("timeCountdownText").style.visibility = 'hidden';
    console.log('Win?: '+winMatchCheck)
    computerPosition = 0;
    playArea = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    updateTurn('X');
    playerArea = [];
    computerArea = [];
    winRoundCheck = false;
  
    //Reset Table
    for(i = 0; i < 9; i++){
      document.getElementById(i).innerHTML = '';
    }
    
    console.log('Game Reset');

    clearInterval(intervalIDRound);
  }
}

let intervalIDgameMatch;
let timeCountdownEndGame;

function gameMatchWin(){
    if(playerHP == 0 && playRound <= 10){
        timeCountdownEndGame = 5;
        intervalIDgameMatch = setInterval(endMatchGame, 1000, 'bot');
        winMatchCheck = true;
    }
    else if(botHP == 0 && playRound <= 10){
        timeCountdownEndGame = 5;
        intervalIDgameMatch = setInterval(endMatchGame, 1000, 'player');
        winMatchCheck = true;
    }
    else if(playRound == 10){
        timeCountdownEndGame = 5;
        intervalIDgameMatch = setInterval(endMatchGame, 1000, 'draw');
        winMatchCheck = true;
    }
}

function endMatchGame(theWinner){
    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);
    let current_User = currentPlayer.replace('.', '_');

    if(timeCountdownEndGame >= 0){
        document.getElementById("timeCountdownText").style.visibility = 'visible';
        if(theWinner == 'draw'){
            $("#turnText").html('GAME DRAW');
        }
        else{
            $("#turnText").html('The Winner is '+theWinner);
        }
        $("#timeCountdownText").html('Back to Homepage . . . '+timeCountdownEndGame+' s');
        timeCountdownEndGame--;
    }
    else{
        refUserInfo.child(current_User).child('user-stat').remove();
        refUserInfo.child(current_User).child('bot-stat').remove();
        window.location.replace('index.html');
        clearInterval(intervalIDgameMatch);
        return
    }
}

function gameMatchReset(){
    document.getElementById('playerHP1').innerHTML = playerHP;
    document.getElementById('playerHP2').innerHTML = botHP
    document.getElementById('roundText').innerHTML = 'Round : ';
    //document.getElementById('round').innerHTML = '1';

    gameRoundReset();
    winMatchCheck = false;
    document.querySelector('#reMatch').disabled = true;
}

function surrenderGame(){
    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);
    let current_User = currentPlayer.replace('.', '_');
    alert('Bot Win!');

    refUserInfo.child(current_User).child('user-stat').remove();
    refUserInfo.child(current_User).child('bot-stat').remove();

    window.location.replace('index.html');
}