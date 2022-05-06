const refUserInfo = firebase.database().ref('UserInfo')
const refRoom = firebase.database().ref('Room')
const refVSFriendRoom = firebase.database().ref('VSFriendRoom')

refUserInfo.once('value', snapshot => {
    getRoomCode(snapshot);
})

let roomCode;

function getRoomCode(snapshot){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    roomCode = snapshot.child(currentUid).child('room-friend').val();

    $('#roomCode').html(roomCode+`<span class="copyText" id="copy">Copy</span>`)
}

refVSFriendRoom.on('value', snapshot => {
    roomPlayer(snapshot); 
})

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
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    playerXInfo = snapshot.child('room-'+roomCode).child("playerX-stat").val();
    // เช็คว่า child playerX มีอยู่ไหม ถ้ามีให้...
    if(snapshot.child('room-'+roomCode).child("playerX-stat").exists()){
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

    playerOInfo = snapshot.child('room-'+roomCode).child("playerO-stat").val();
    // เช็คว่า child playerX มีอยู่ไหม ถ้ามีให้...
    if(snapshot.child('room-'+roomCode).child("playerO-stat").exists()){
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

    showPlayer();
}

function showPlayer(){
    // Show Player X Name
    $('#player1name').html('Player X : '+playerXname);
    $('#charXName').html(playerXcharType);
    $('#charXHP').html('HP : '+playerXHP);
    $('#charXDamage').html('Damage : '+playerXdamage);
    document.getElementById("imageX").src = playerXimgSource;

    // Show Player O Name
    $('#player2name').html('Player O : '+playerOname);
    $('#charOName').html(playerOcharType);
    $('#charOHP').html('HP : '+playerOHP);
    $('#charODamage').html('Damage : '+playerOdamage);
    document.getElementById("imageO").src = playerOimgSource;
}



/* ----- Copy Room Code ----- */

const roomCodeEvent = document.getElementById('roomCode');
roomCodeEvent.addEventListener('mouseover', hoverCopy);
roomCodeEvent.addEventListener('mouseout', notHoverCopy);
roomCodeEvent.addEventListener('click', clickCopy);

function hoverCopy(){
    document.getElementById('copy').style.visibility = 'visible';
	document.getElementById('copy').innerHTML = 'Copy';
}

function notHoverCopy(){
    document.getElementById('copy').style.visibility = 'hidden';
}

function clickCopy(){
	let click = document.getElementById('copy');
    if(click.innerHTML == 'Copy'){
    	click.innerHTML = 'Copied';
    }

    var copyText = document.getElementById('roomCode').innerHTML;
    let roomCodeCopy = copyText.slice(0, 4);

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(roomCodeCopy);
}