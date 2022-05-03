//import * as variable from "./vsOtherRoom.js"

// ref vanriable
const refGameInfo = firebase.database().ref('GameInfo')
const refUserInfo = firebase.database().ref('UserInfo')
const refRoom = firebase.database().ref('Room')

refUserInfo.once('value', snapshot => {
  userRoom(snapshot);
})

let playerRoomNum;

function userRoom(snapshot){
    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);
    let current_User = currentPlayer.replace('.', '_');

    if(currentUser){
        snapshot.forEach((data) => {
            const userInfos = data.val();
            //console.log('User Infos: '+userInfos);
            //console.log('User Infos (Email): '+userInfos.Email);
            Object.keys(userInfos).forEach(key => {
                switch(key){
                    case current_User+'-room':
                        if(userInfos[key] != undefined){
                            playerRoomNum = userInfos[key];
                        }
                        //console.log('userInfos: '+userInfos[key]);
                        //console.log('Player Room Num: '+playerRoomNum);
                        break;
                }
            })
        })
    }
}

refRoom.on('value', snapshot => {
    getRoomInfo(snapshot);
})

// variable declartion
let playerXInfo;
let playerOInfo;

let playerXname;
let playerXcharType;
let playerXHP;
let playerXdamage;

let playerOname;
let playerOcharType;
let playerOHP;
let playerOdamage;

let playerTurn;
let channel;
let playRound;
let winRoundCheck;
let winMatchCheck;
let winner;
let loser;

function getPlayer(snapshot){

}
let intervalID;
let timeCountdown;

function getRoomInfo(snapshot){
    console.log(snapshot.child("room-"+playerRoomNum).exists());
    if(snapshot.child("room-"+playerRoomNum).exists() == false){
        window.location.replace("index.html", "_self");
        console.log('Back to Homepage')
    }
    // Get Room Info
    const roomInfos = snapshot.child('room-'+playerRoomNum).val();
    Object.keys(roomInfos).forEach(key => {
        switch(key){
            case 'turn':
                playerTurn = roomInfos[key];
                break
            case 'round':
                playRound = roomInfos[key];
                break
            case 'winRound':
                winRoundCheck = roomInfos[key];
                break
            case 'winMatch':
                winMatchCheck = roomInfos[key];
                break
        }
    })

    playerXInfo = snapshot.child("room-"+playerRoomNum).child("playerX").val();
    if(snapshot.child("room-"+playerRoomNum).child("playerX").exists()){
        Object.keys(playerXInfo).forEach(key => {
            switch(key){
                case 'name':
                    playerXname = playerXInfo[key];
                    break
                case 'char-type':
                    playerXcharType = playerXInfo[key];
                    break
                case 'hp':
                    playerXHP = playerXInfo[key];
                    break
                case 'damage':
                    playerXdamage = playerXInfo[key];
                    break
            }
        })
    }
    playerOInfo = snapshot.child("room-"+playerRoomNum).child("playerO").val();
    if(snapshot.child("room-"+playerRoomNum).child("playerO").exists()){
        Object.keys(playerOInfo).forEach(key => {
            switch(key){
                case 'name':
                    playerOname = playerOInfo[key];
                    break
                case 'char-type':
                    playerOcharType = playerOInfo[key];
                    break
                case 'hp':
                    playerOHP = playerOInfo[key];
                    break
                case 'damage':
                    playerOdamage = playerOInfo[key];
                    break
            }
        })
    }
    document.getElementById('round').innerHTML = playRound;

    // console.log('Room Table: '+roomInfos.table);
    if(roomInfos.table != ""){
        for (const id in roomInfos.table){
            document.getElementById(id).innerHTML = roomInfos.table[id];
        }
    }

    if(winRoundCheck == false){
        document.getElementById('turnText').innerHTML = 'Turn : '+playerTurn;
        checkWinRound();
    }
    else if(winRoundCheck == true){
        // checkWinMatch();
        if(winner == 'X' || winner == 'O'){
            document.getElementById('turnText').innerHTML = 'Winner : '+winner;
        }
        else if(winner == 'draw'){
            document.getElementById('turnText').innerHTML = 'Game Draw';
        }
    }
}

// Turn Base Variables
// Player Stat
let playerHP = 5;
let playerDamage = 3;
// Bot Stat
let botHP = 5;
let botDamage = 2;

const cells = document.querySelectorAll('.cell');
cells.forEach(cell => cell.addEventListener('click', gamePlay));

// player gameplay function
function gamePlay(event) {
    const channelID = event.currentTarget.getAttribute('id');
    const channelVal = document.getElementById(channelID).innerHTML;

    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);
    let current_User = currentPlayer.replace('.', '_');

    //console.log('Channel ID: '+channelID);
    //console.log('Channel Value: '+channelVal);
    //console.log('Player Position: '+position);
    //console.log('Play Area: '+playArea)
    //console.log('Player Area: '+playerXArea)

    // เช็คว่ามีผู้เล่น 2 คนครบยัง
    if(playerXname != null && playerOname != null){
        // เช็คว่ามีผู้เล่นชนะใน 1 Match ไหม ถ้ายังไม่มีผู้เล่นชนะให้...
        if(winMatchCheck == false){
            //console.log('Current User: '+currentUser.Email);
            // เช็คว่ามีผู้เล่นชนะ ใน 1 Round ไหม ถ้ายังไม่มีผู้เล่นชนะให้...
            if(winRoundCheck == false){
                // เช็คว่าเป็นผู้ใช้ขณะนี้หรือไม่
                if(currentUser){
                    //console.log('ChannelVal: '+channelVal);
                    // เช็คว่าช่องที่เลือกลง ว่างหรือไม่ ถ้าว่างให้...
                    if(channelVal == ''){
                        //console.log('Current Player: '+currentPlayer);
                        //console.log('PlayerX: '+playerX);
                        // เช็คว่าผู้เล่นที่ใช้งานอยู่คือ Player X หรือไม่ และเช็คว่า Turn คือ X หรือไม่ ถ้าตรงทั้งสองเงื่อนไขให้...
                        if(currentPlayer == playerXname && playerTurn == 'X'){
                            // อัปเดตตาราง
                            updateTable(channelID);
                            // สลับ Turn จาก X เป็น O
                            switchTurn('O');
                        }
                        // เช็คว่าผู้เล่นที่ใช้งานอยู่คือ Player O หรือไม่ และเช็คว่า Turn คือ O หรือไม่ ถ้าตรงทั้งสองเงื่อนไขให้...
                        else if(currentPlayer == playerOname && playerTurn == 'O'){
                            // อัปเดตตาราง
                            updateTable(channelID);
                            // สลับ Turn จาก O เป็น X
                            switchTurn('X');
                        }
                    }
                }
            }
        }
    }
}

/*
// computer gameplay function
function computerPlay() {
    var randPlay = parseInt(Math.random() * (playArea.length - 1));
    computerPosition = playArea[randPlay];
    //console.log('Computer Position: '+computerPosition);
    document.getElementById(computerPosition).innerHTML = playerO;
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
*/

// check for win conditions
// parameter: array of played fields
function checkWinRound() {
    refRoom.child('room-'+playerRoomNum).once("value", snapshot => {
        const winPlayerX = snapshot.child('playerX').child('win').val();
        const winPlayerO = snapshot.child('playerO').child('win').val();

        console.log('Player X Win: '+winPlayerX);
        console.log('Player O Win: '+winPlayerO);
        console.log('Win Match Check: '+winMatchCheck)

        // Check ว่าใน Match นั้นมีใครชนะหรือยัง
        if(winMatchCheck || playRound == 10){
            if(winPlayerX){
                timeCountdownEndGame = 5;
                intervalIDgameMatch = setInterval(endMatchGame, 1000, 'X');
            }
            // ถ้าชนะแล้วให้กลับหน้า Home
            else if(winPlayerO){
                timeCountdownEndGame = 5;
                intervalIDgameMatch = setInterval(endMatchGame, 1000, 'O');
            }
            else{
                timeCountdownEndGame = 5;
                intervalIDgameMatch = setInterval(endMatchGame, 1000, 'draw');
            }
        }

        const roomInfos = snapshot.val();

        let win1 = roomInfos.table[0] != undefined && roomInfos.table[0] == roomInfos.table[1] && roomInfos.table[1] == roomInfos.table[2]
        let win2 = roomInfos.table[3] != undefined && roomInfos.table[3] == roomInfos.table[4] && roomInfos.table[4] == roomInfos.table[5]
        let win3 = roomInfos.table[6] != undefined && roomInfos.table[6] == roomInfos.table[7] && roomInfos.table[7] == roomInfos.table[8]
        let win4 = roomInfos.table[0] != undefined && roomInfos.table[0] == roomInfos.table[3] && roomInfos.table[3] == roomInfos.table[6]
        let win5 = roomInfos.table[1] != undefined && roomInfos.table[1] == roomInfos.table[4] && roomInfos.table[4] == roomInfos.table[7]
        let win6 = roomInfos.table[2] != undefined && roomInfos.table[2] == roomInfos.table[5] && roomInfos.table[5] == roomInfos.table[8]
        let win7 = roomInfos.table[0] != undefined && roomInfos.table[0] == roomInfos.table[4] && roomInfos.table[4] == roomInfos.table[8]
        let win8 = roomInfos.table[2] != undefined && roomInfos.table[2] == roomInfos.table[4] && roomInfos.table[4] == roomInfos.table[6]

        // เช็ตว่าเข้าเงื่อนไขไหนจาก win ต่างๆไหม
        if(win1 || win2 || win3 || win4 || win5 || win6 || win7 || win8){
            updateWinRound(true);
            timeCountdown = 3;
            intervalID = setInterval(resetGameRound, 1000);
            if(playerTurn == 'X'){
                winner = 'X';
                loser = 'O'
                switchTurn('O');
                attackEnemies(playerXdamage, winner);
                updateRound();
            }
            else if(playerTurn == 'O'){
                winner = 'O';
                loser = 'X'
                switchTurn('X');
                attackEnemies(playerOdamage, winner);
                updateRound();
            }
        }
        // ถ้าไม่เข้าเงื่อนไข win ไหนเลย แล้วทุกช่องเต็มด้วย (เสมอ)
        else if(roomInfos.table[0] && roomInfos.table[1] && roomInfos.table[2] &&
                roomInfos.table[3] && roomInfos.table[4] && roomInfos.table[5] &&
                roomInfos.table[6] && roomInfos.table[7] && roomInfos.table[8]
        ){
            updateWinRound(true);
            timeCountdown = 3;
            intervalID = setInterval(resetGameRound, 1000);
            winner = 'draw';
            updateRound();
        }

    })

}

/*
function checkWinMatch(){
    refRoom.child('room-'+playerRoomNum).once("value", snapshot => {
        const winMatchLastCheck = snapshot.child('room-'+playerRoomNum).child('winMatch').val();
        console.log('Win Match Last Check: '+winMatchLastCheck)
        if(winMatchLastCheck){
            timeCountdown = 5;
            intervalIDgameMatch = setInterval(endMatchGame, 1000);
        }
    })
}
*/

// display win messages
// parameter: winners name
/*
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
    if(checkWin(playerXArea) === 2){
        botHP -= playerDamage;
        document.getElementById('playerHP2').innerHTML = botHP;
    }
    else if(checkWin(computerArea) === 2){
        playerHP -= botDamage;
        document.getElementById('playerHP1').innerHTML = playerHP;
    }

    //console.log(checkWin(playerXArea));
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
        //winMatchCheck = true;
    }
    else if(botHP <= 0 && playRound <= 10){
        alert('Player Win!');
        document.getElementById('playerHP2').innerHTML = 0;
        document.getElementById('roundText').innerHTML = 'Winner : Player 1!';
        document.getElementById('round').innerHTML = '';
        document.querySelector('#reMatch').disabled = false;
        //winMatchCheck = true;
    }
    else if(playRound == 10){
        document.getElementById('roundText').innerHTML = 'GAME DRAW';
        document.getElementById('round').innerHTML = '';
        document.querySelector('#reMatch').disabled = false;
        //winMatchCheck = true;
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
    playerX = "X";
    playerO = "O";
    computerPosition = 0;
    playArea = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    playerXArea = [];
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
*/

const surrender = document.getElementById('surrender');
surrender.addEventListener('click', surrenderGame);

let timeCountdownEndGame;
let intervalIDgameMatch;

function surrenderGame(){
    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);
    let current_User = currentPlayer.replace('.', '_');

    if(playerXname != null && playerOname != null){
        if(currentUser){
            if(currentPlayer == playerXname){
                updateWinMatch(true);
                updateTheWinner(true, 'O');
            }
            else if(currentPlayer == playerOname){
                updateWinMatch(true);
                updateTheWinner(true, 'X');
            }
        }
    }
    
}

// Reset รอบ
function resetGameRound(){
    if(timeCountdown >= 0){
        document.getElementById("timeCountdownText").style.visibility = 'visible';
        if(winner == 'draw'){
            $("#timeCountdownText").html('No player won this round . . . '+timeCountdown+' s');
        }
        else{
            $("#timeCountdownText").html('Player '+winner+' attacks Player '+loser+' ! . . . '+timeCountdown+' s');
        }
        timeCountdown--;
    }
    else{
        document.getElementById("timeCountdownText").style.visibility = 'hidden';
        //document.getElementById("timeCountdownText").innerHTML = 'Next Round start in . . . ';
        resetTable();
        updateWinRound(false);
        clearInterval(intervalID);
        return
    }
}

// สลับเทิร์นผู้เล่น
function switchTurn(turn){
    refRoom.child('room-'+playerRoomNum).update({
        ['turn']: turn,
    });
}

// เพิ่มเลขรอบ
function updateRound(){
    refRoom.child('room-'+playerRoomNum).update({
        ['round']: playRound+1,
    });
}

// อัปเดตตาราง
function updateTable(id){
    refRoom.child("room-"+playerRoomNum).child("table").update({
        [id]: playerTurn,
    })
}



// โจมตีศัตรู
function attackEnemies(damage, winner){
    if(winner == 'X'){
        if(playerOHP-damage <= 0){
            playerOHP = 0;
            timeCountdownEndGame = 5;
            intervalIDgameMatch = setInterval(endMatchGame, 1000, winner);
        }
        else{
            playerOHP = playerOHP - damage;
        }
        refRoom.child('room-'+playerRoomNum).child('playerO').update({
            ['hp']: playerOHP,
        })
    }
    else if(winner == 'O'){
        if(playerXHP-damage < 0){
            playerXHP = 0;
            timeCountdownEndGame = 5;
            intervalIDgameMatch = setInterval(endMatchGame, 1000, winner);
        }
        else{
            playerXHP = playerXHP - damage;
        }
        refRoom.child('room-'+playerRoomNum).child('playerX').update({
            ['hp']: playerXHP,
        })
    }
}

// Reset ตาราง
function resetTable(){
    refRoom.child('room-'+playerRoomNum).update({
        ['table']: '',
    });

    for (let i=0; i<=8; i++){
        document.getElementById(i).innerHTML = '';
    }
}

// อัปเดตรอบนั้นว่า ชนะ หรือ แพ้
function updateWinRound(bool){
    refRoom.child("room-"+playerRoomNum).update({
        ['winRound']: bool,
    })
}

// อัปเดตตานั้นว่า ชนะ หรือ แพ้
function updateWinMatch(bool){
    refRoom.child("room-"+playerRoomNum).update({
        ['winMatch']: bool,
    })
}

function updateTheWinner(bool, theWinner){
    refRoom.child("room-"+playerRoomNum).child('player'+theWinner).update({
        ['win']: bool,
    })
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
            $("#turnText").html('No player won this match.');
        }
        else{
            $("#turnText").html('The Winner is '+theWinner);
        }
        $("#timeCountdownText").html('Back to Homepage . . . '+timeCountdownEndGame+' s');
        timeCountdownEndGame--;
    }
    else{
        refRoom.child('room-'+playerRoomNum).remove();
        refUserInfo.child(current_User).child(current_User+'-room').remove();
        refGameInfo.child('RoomStatus').child('room-'+playerRoomNum+'playerQuantity').remove();
        //window.open("index.html", "_self");
        clearInterval(intervalIDgameMatch);
        return
    }
}
