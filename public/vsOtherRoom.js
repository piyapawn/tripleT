// ref vanriable
const refGameInfo = firebase.database().ref('GameInfo')
const refUserInfo = firebase.database().ref('UserInfo')
const refRoom = firebase.database().ref('Room')

refUserInfo.once('value', snapshot => {
    userRoom(snapshot);
})

let playerRoomNum;
let charType;
let health;
let damage;

function userRoom(snapshot){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    playerRoomNum = snapshot.child(currentUid).child('room').val();

    console.log('Player Room Num: '+playerRoomNum)
}

refRoom.on('value', snapshot => {
    roomPlayer(snapshot); 
})

let roomNum;
let playerXInfo;
let playerOInfo;

let playerXname;
let playerXcharType;
let playerXHP;
let playerXdamage;
let playerXimgSource;

let playerOname;
let playerOcharType;
let playerOHP;
let playerOdamage;
let playerOimgSource;

function roomPlayer(snapshot){

    snapshot.forEach((data) => {
        const gameInfos = data.val();
        //console.log('Game Infos: '+gameInfos);
        Object.keys(gameInfos).forEach(key => {
            switch(key){
                case 'roomNum':
                    if(gameInfos[key] == playerRoomNum){
                        roomNum = gameInfos[key];
                    }
                    break
            }
        })
    })

    playerXInfo = snapshot.child("room-"+playerRoomNum).child("playerX").val();
    // เช็คว่า child playerX มีอยู่ไหม ถ้ามีให้...
    console.log('Room Check: '+playerRoomNum);
    console.log('Room PlayerX: '+snapshot.child("room-"+playerRoomNum).child("playerX").exists());
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
                case 'imgSource':
                    playerXimgSource = playerXInfo[key];
                    break
            }
        })
    }
    else{
        playerXname = '?'
        playerXcharType = 'Character ?'
        playerXHP = '?'
        playerXdamage = '?'
    }
    
    playerOInfo = snapshot.child("room-"+playerRoomNum).child("playerO").val();
    // เช็คว่า child playerO มีอยู่ไหม ถ้ามีให้...
    console.log('Room PlayerO: '+snapshot.child("room-"+playerRoomNum).child("playerO").exists());
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
                case 'imgSource':
                    playerOimgSource = playerOInfo[key];
                    break
            }
        })
    }
    else{
        playerOname = '?'
        playerOcharType = 'Character ?'
        playerOHP = '?'
        playerOdamage = '?'
    }

    console.log('PlayerX_RoomNum: '+playerXInfo);
    console.log('PlayerO_RoomNum: '+playerOInfo);

    //console.log('PlayerX_RoomNum: '+playerXInfo);
    //console.log('PlayerO_RoomNum: '+playerOInfo);

    showPlayer();

}

function showPlayer(){
    // Show Room Number
    $('#roomNum').html(playerRoomNum);

    $('#player1name').html('Player X : '+playerXname);
    $('#player2name').html('Player O : '+playerOname);

    /* No Responsive */
    // Show Player X Name
    $('#charXName').html(playerXcharType);
    $('#charXHP').html('HP : '+playerXHP);
    $('#charXDamage').html('Damage : '+playerXdamage);
    document.getElementById("imageX").src = playerXimgSource;

    // Show Player O Name
    $('#charOName').html(playerOcharType);
    $('#charOHP').html('HP : '+playerOHP);
    $('#charODamage').html('Damage : '+playerOdamage);
    document.getElementById("imageO").src = playerOimgSource;

    /* For Resposive */
    // Show Player Stat
    $('#charXNameRes').html(playerXcharType);
    $('#charXHPRes').html('HP : '+playerXHP);
    $('#charXDamageRes').html('Damage : '+playerXdamage);
    $('#imageXRes').attr("src", playerXimgSource);

    // Show Bot Stat
    $('#charONameRes').html(playerOcharType);
    $('#charOHPRes').html('HP : '+playerOHP);
    $('#charODamageRes').html('Damage : '+playerOdamage);
    $('#imageORes').attr("src", playerOimgSource);
}

function deletePlayerRoom(){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    refUserInfo.child(currentUid).child('room').remove();
}

function deletePlayerQuantity(){
    refGameInfo.child('RoomStatus').child('room-'+playerRoomNum+'playerQuantity').remove();
}

//export default playerRoomNum;