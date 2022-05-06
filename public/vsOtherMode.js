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
    const currentUid = currentUser.uid;

    playerRoomNum = snapshot.child(currentUid).child('room').val();
}

refRoom.on('value', snapshot => {
    getRoomInfo(snapshot);
})

// variable declartion
// Player X & Player O ดึงค่าจาก Firebase
let playerXInfo;
let playerOInfo;
// ประกาศตัวแปรต่างๆในการรับค่าจาก Player X
let playerXname;
let playerXcharType;
let playerXHP;
let playerXdamage;
// ประกาศตัวแปรต่างๆในการรับค่าจาก Player O
let playerOname;
let playerOcharType;
let playerOHP;
let playerOdamage;
// ประกาศตัวแปรอื่นๆที่ใช้ในเกม
let playerTurn;
let channel;
let playRound;
let winRoundCheck;
let winMatchCheck;
let winner;
let loser;

// ประกาศตัวแปรเวลา
let intervalID;
let timeCountdown;

function getRoomInfo(snapshot){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    console.log(snapshot.child("room-"+playerRoomNum).exists());

    if(snapshot.child("room-"+playerRoomNum).exists() == false){
        refUserInfo.child(currentUid).child('room').remove();
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

    if(playerXname != null && playerOname != null){
        document.getElementById('surrender').style.visibility = 'visible';
        document.getElementById('leaveRoom').style.visibility = 'hidden';
    }

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


const cells = document.querySelectorAll('.cell');
cells.forEach(cell => cell.addEventListener('click', gamePlay));

// player gameplay function
function gamePlay(event) {
    // ประกาศตัวแปรรับค่า id จากปุ่มที่ผู้เล่นกด
    const channelID = event.currentTarget.getAttribute('id');
    const channelVal = document.getElementById(channelID).innerHTML;

    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);

    // เช็คว่ามีผู้เล่น 2 คนครบยัง
    if(playerXname != null && playerOname != null){
        // เช็คว่ามีผู้เล่นชนะใน 1 Match ไหม ถ้ายังไม่มีผู้เล่นชนะให้...
        if(winMatchCheck == false){
            // เช็คว่ามีผู้เล่นชนะ ใน 1 Round ไหม ถ้ายังไม่มีผู้เล่นชนะให้...
            if(winRoundCheck == false){
                // เช็คว่าเป็นผู้ใช้ขณะนี้หรือไม่
                if(currentUser){
                    // เช็คว่าช่องที่เลือกลง ว่างหรือไม่ ถ้าว่างให้...
                    if(channelVal == ''){
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

const surrender = document.getElementById('surrender');
surrender.addEventListener('click', surrenderGame);

let timeCountdownEndGame;
let intervalIDgameMatch;

function surrenderGame(){
    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);

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

const leave = document.getElementById('leaveRoom');
leave.addEventListener('click', leaveRoom);

function leaveRoom(){
    refRoom.child('room-'+playerRoomNum).remove();
    refUserInfo.child(currentUid).child('room').remove();
    refGameInfo.child('RoomStatus').child('room-'+playerRoomNum+'playerQuantity').remove();
    window.location.replace("index.html", "_self");
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
    const currentUid = currentUser.uid;

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
        refGameInfo.child('RoomStatus').child('room-'+playerRoomNum+'playerQuantity').remove();
        //window.open("index.html", "_self");
        clearInterval(intervalIDgameMatch);
        return
    }
}
