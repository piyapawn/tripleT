// import function createOrJoinRoom จาก roomMatching.js
import * as func from './roomMatching.js';

// ref จาก GameInfo, Room
const refGameInfo = firebase.database().ref('GameInfo')
const refRoom = firebase.database().ref('Room')
const refUserInfo = firebase.database().ref('UserInfo')
const refVSFriendRoom = firebase.database().ref('VSFriendRoom')

// เอาค่าจาก realtime database
refUserInfo.on('value', snapshot => {
    checkSelectInfo(snapshot);
})

let vsBot;
let vsOther;
let vsFriend;

let createRoom;
let joinRoom;

function checkSelectInfo(snapshot){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    if(currentUser){
        const selectModeInfo = snapshot.child(currentUid).child('selectMode').val();
        Object.keys(selectModeInfo).forEach(key => {
            switch(key){
                case 'VS Bot':
                    vsBot = selectModeInfo[key];
                    break;
                case 'VS Other':
                    vsOther = selectModeInfo[key];
                    break;
                case 'VS Friend':
                    vsFriend = selectModeInfo[key];
                    break;
            }
        })

        const friendSelectInfo = snapshot.child(currentUid).child('FriendModeSelect').val();
        if(snapshot.child(currentUid).child('FriendModeSelect').exists()){
            Object.keys(friendSelectInfo).forEach(key => {
                switch(key){
                    case 'Create Room':
                        createRoom = friendSelectInfo[key];
                        break;
                    case 'Join Room':
                        joinRoom = friendSelectInfo[key];
                        break;
                }
            })
        }

        if(vsBot){
            $('#gameModeText').html('Mode : Solo VS Bot');
        }
        else if(vsOther){
            $('#gameModeText').html('Mode : Play With Other');
        }
        else if(vsFriend){
            $('#gameModeText').html('Mode : Play With Friend');
            document.getElementById('createOrJoinFriend').style.display = 'flex';
            if(createRoom){
                $('#createOrJoinText').html('Create Room');
            }
            else{
                $('#createOrJoinText').html('Join Room');
            }
        }
    }
}

/* --- สำหรับย้อนกลับ --- */
const backButton = document.getElementById('backButt');
backButton.addEventListener("click", backPage);

function backPage(){
    if(vsBot){
        window.open("index.html", "_self");
    }
    else if(vsOther){
        window.open("index.html", "_self");
    }
    else if(vsFriend){
        window.open("vsFriendSelectMode.html", "_self");
    }
    //console.log('I said BACK!');
}

/* --- สำหรับไปหน้าเล่นเกม Gameboard.html --- */
// ตัวแปรปุ่มโหมดต่างๆ

const openGame = document.querySelectorAll('.char');
openGame.forEach(char => char.addEventListener('click', openGameboard));

const closeModal = document.querySelectorAll('.cancelButton');
closeModal.forEach(cancelButton => cancelButton.addEventListener('click', cancelModal));

// ตัวแปรเวลา
let intervalID;
let timeCount;

let golem = false;
let orc = false;
let reaper = false;
// Function เปิดหน้า Bot Game Board
function openGameboard(event){
    const charID = event.currentTarget.getAttribute('id');

    /* check ว่าเลือกโหมดไหน */
    // โหมดเล่นกับบอท
    if(vsBot){
        // สุ่ม Character ให้ bot และอัปเดตไปยังฐานข้อมูล
        randomBotStat();
        // เพิ่ม statInfo ให้ Player
        if(charID == 'golem'){
            // userStatUpdate('Golem', 13, 3);
            userStatUpdate('Golem', 13, 3, 'image/golem.png')
            window.open("botGameBoard.html", "_self");
        }
        else if(charID == 'orc'){
            // userStatUpdate('Orc',8 ,6);
            userStatUpdate('Orc',8 ,6, 'image/orc.png')
            window.open("botGameBoard.html", "_self");
        }
        else if(charID == 'reaper'){
            // userStatUpdate('Reaper',5 ,8);
            userStatUpdate('Reaper',5 ,8, 'image/reaper.png')
            window.open("botGameBoard.html", "_self");
        }
    }
    else if(vsOther){
        //console.log('GameMode: vsOther');
        // เรียกใช้ฟังก์ชัน createOrJoinRoom จาก roomMatching.js
        //func.setPlayerX();
        timeCount = 4;

        // เพิ่ม statInfo ให้ Player
        if(charID == 'golem'){
            // userStatUpdate('Golem', 10, 3);
            intervalID = setInterval(timeCountdown, 1000, 'Golem', 13, 3, 'image/golem.png');
        }
        else if(charID == 'orc'){
            // userStatUpdate('Orc',8 ,6);
            intervalID = setInterval(timeCountdown, 1000, 'Orc',8 ,6, 'image/orc.png');
        }
        else if(charID == 'reaper'){
            // userStatUpdate('Reaper',5 ,8);
            intervalID = setInterval(timeCountdown, 1000, 'Reaper',5 ,8, 'image/reaper.png');
        }

        $('#exampleModal').modal();
        func.setModalText();
    }
    
    else if(vsFriend){

        if(charID == 'golem'){
            // userStatUpdate('Golem', 13, 3);
            if(createRoom){
                alert('Create Room');
                createFriendRoom('Golem', 13, 3, 'image/golem.png');
                window.open("friendGameBoard.html", "_self");
            }
            else if(joinRoom){
                $('#roomCodeModal').modal();
                golem = true;
            }
        }
        else if(charID == 'orc'){
            // userStatUpdate('Orc',8 ,6);
            if(createRoom){
                alert('Create Room');
                createFriendRoom('Orc',8 ,6, 'image/orc.png');
                window.open("friendGameBoard.html", "_self");
            }
            else if(joinRoom){
                $('#roomCodeModal').modal();
                orc = true;
            }
        }
        else if(charID == 'reaper'){
            // userStatUpdate('Reaper',5 ,8);
            if(createRoom){
                alert('Create Room');
                createFriendRoom('Reaper',5 ,8, 'image/reaper.png');
                window.open("friendGameBoard.html", "_self");
            }
            else if(joinRoom){
                $('#roomCodeModal').modal();
                reaper = true;
            }
        }
    }
}

// Function นับเวลาถอยหลัง 5 วิ หลังจากกดหาหรือสร้างห้อง
function timeCountdown(charType, hp, damage, imgSource){
    if(timeCount >= 0){
        //console.log('Time: '+timeCount+' s');
        $("#time").html(timeCount+' s');
        timeCount--;
    }
    else{
        //console.log('Time Out!');
        window.open("otherGameBoard.html", "_self");
        clearInterval(intervalID);
        func.createOrJoinRoom(charType, hp, damage, imgSource);
        //return
    }
}

function userStatUpdate(charType, hp, damage, imgSource){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;
    const currentEmail = currentUser.email;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);

    refUserInfo.child(currentUid).child('user-stat').update({
        ['name']: currentPlayer,
        ['char-type']: charType,
        ['hp']: hp,
        ['damage']: damage,
        ['imgSource']: imgSource,
        ['win']: false,
    })
}

function randomBotStat(){
    const randomNum = Math.floor(Math.random() * 3) + 1;

    if(randomNum == 1){
        botStatUpdate('Golem', 13, 3, 'image/golem.png')
    }
    else if(randomNum == 2){
        botStatUpdate('Orc',8 ,6, 'image/orc.png')
    }
    else if(randomNum == 3){
        botStatUpdate('Reaper',5 ,8, 'image/reaper.png')
    }

}

function botStatUpdate(charType, hp, damage, imgSource){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    refUserInfo.child(currentUid).child('bot-stat').update({
        ['char-type']: charType,
        ['hp']: hp,
        ['damage']: damage,
        ['imgSource']: imgSource,
        ['win']: false,
    })
}

function createFriendRoom(charType, hp, damage, imgSource){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;
    const currentEmail = currentUser.email;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);

    var randomCode = "" + Math.floor(Math.random() * 10000)
    var pad = "0000"
    var codeString = pad.substring(0, pad.length - randomCode.length) + randomCode;
    //var codeInt = parseInt(codeString);


    refVSFriendRoom.child('room-'+codeString).update({
        ['room-code']: codeString,
        ['turn']: 'X',
        ['table']: '',
        ['round']: 1,
        ['winRound']: false,
        ['winMatch']: false,
    })

    refVSFriendRoom.child('room-'+codeString).child('playerX-stat').update({
        ['name']: currentPlayer,
        ['char-type']: charType,
        ['hp']: hp,
        ['damage']: damage,
        ['imgSource']: imgSource,
        ['win']: false,
    })

    refUserInfo.child(currentUid).update({
        ['room-friend']: codeString,
    })
}

const click = document.getElementById('submitButton');
click.addEventListener('click', checkRoomCode);


let checkPlayerOstatExists;
let checkRoomCodeExists;
let roomCodeAssign;

function checkRoomCode(){
    roomCodeAssign = String(document.getElementById('roomCode').value);
    console.log('Room Code: '+roomCodeAssign);
    
    refVSFriendRoom.once('value', snapshot => {
        console.log('Check Room Code Exists: '+snapshot.hasChild('room-'+roomCodeAssign))
        checkRoomCodeExists = snapshot.hasChild('room-'+roomCodeAssign);

        checkPlayerOstatExists = snapshot.child('room-'+roomCodeAssign).hasChild('playerO-stat');
        console.log('Player O Stat Exist?: '+checkPlayerOstatExists);
        console.log('Player O Stat not Exist?: '+!checkPlayerOstatExists);

        if(checkRoomCodeExists){
            if(golem){
                friendUpdatePlayerO('Golem', 13, 3, 'image/golem.png', roomCodeAssign);
            }
            else if(orc){
                friendUpdatePlayerO('Orc',8 ,6, 'image/orc.png', roomCodeAssign);
            }
            else if(reaper){
                friendUpdatePlayerO('Reaper',5 ,8, 'image/reaper.png', roomCodeAssign);
            }
        }
        else{
            alert('This room does not exist');
        }
        
    })

    // console.log('Check Code: '+refVSFriendRoom.child('room-code').isEqual(roomCodeAssign));

    
/*
    refVSFriendRoom.orderByChild('room-code').equalTo(roomCodeAssign)
    .once('value').then(function(snapshot) {
        console.log('Room Code Assign: '+snapshot.key);
        console.log('Player O Stat: '+checkPlayerOstatExists);
        
    });
*/
}

function friendUpdatePlayerO(charType, hp, damage, imgSource, roomCodeAssign){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;
    const currentEmail = currentUser.email;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);

    if(checkPlayerOstatExists == false){
        console.log('Join Room');
        refVSFriendRoom.child('room-'+roomCodeAssign).child('playerO-stat').update({
            ['name']: currentPlayer,
            ['char-type']: charType,
            ['hp']: hp,
            ['damage']: damage,
            ['imgSource']: imgSource,
            ['win']: false,
        })
        refUserInfo.child(currentUid).update({
            ['room-friend']: roomCodeAssign,
        })
        window.open("friendGameBoard.html", "_self");
    }
    else{
        alert('This room is full');
    }
}

// Cancel Modal ที่เปิดอยู่ และ reset เวลาใหม่
function cancelModal(){
    clearInterval(intervalID);
    timeCount = 5;
    $("#time").html(timeCount+' s');
}