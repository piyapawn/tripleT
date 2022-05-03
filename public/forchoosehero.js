// import function createOrJoinRoom จาก roomMatching.js
import * as func from './roomMatching.js';

// ref จาก GameInfo, Room
const refGameInfo = firebase.database().ref('GameInfo')
const refRoom = firebase.database().ref('Room')
const refUserInfo = firebase.database().ref('UserInfo')

// เอาค่าจาก realtime database
refGameInfo.on('value', snapshot => {
    checkInfo(snapshot);
})

let vsBot;
let vsOther;
let vsFriend;

function checkInfo(snapshot){
    //console.log(snapshot.val());
    snapshot.forEach((data) => {
        const gameInfos = data.val();
        //console.log(gameInfos);
        Object.keys(gameInfos).forEach(key => {
            switch(key){
                case 'VS Bot':
                    vsBot = gameInfos[key];
                    //console.log('vsBot: '+vsBot);
                    break;
                case 'VS Other':
                    vsOther = gameInfos[key];
                    //console.log('vsOther: '+vsOther);
                    break;
                case 'VS Friend':
                    vsFriend = gameInfos[key];
                    //console.log('vsFriend: '+vsFriend);
                    break;
            }
        })
    })

    if(vsBot){
        $('#gameModeText').html('Mode : Solo VS Bot');
    }
    else if(vsOther){
        $('#gameModeText').html('Mode : Play With Other');
    }
    else if(vsFriend){
        $('#gameModeText').html('Mode : Play With Friend');
    }
}

/* --- สำหรับย้อนกลับ --- */
const backButton = document.getElementById('backButt');
backButton.addEventListener("click", backPage);

function backPage(){
    //console.log('I said BACK!');
    window.open("index.html", "_self");
}

/* --- สำหรับไปหน้าเล่นเกม Gameboard.html --- */
// ตัวแปรปุ่มโหมดต่างๆ
// const hero1choose = document.getElementById('character1');
// hero1choose.addEventListener('click', openBotGameboard);
// 
// const hero2choose = document.getElementById('character2');
// hero2choose.addEventListener('click', openBotGameboard);
// 
// const hero3choose = document.getElementById('character3');
// hero3choose.addEventListener('click', openBotGameboard);

const openGame = document.querySelectorAll('.char');
openGame.forEach(char => char.addEventListener('click', openGameboard));

const closeModal = document.querySelectorAll('.cancelButton');
closeModal.forEach(cancelButton => cancelButton.addEventListener('click', cancelModal));

// ตัวแปรเวลา
let intervalID;
let timeCount;

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
            // userStatUpdate('Golem', 10, 3);
            userStatUpdate('Golem', 10, 3, 'image/golem.png')
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
            intervalID = setInterval(timeCountdown, 1000, 'Golem', 10, 3, 'image/golem.png');
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
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);
    let current_User = currentPlayer.replace('.', '_');

    refUserInfo.child(current_User).child('user-stat').update({
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
        botStatUpdate('Golem', 10, 3, 'image/golem.png')
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
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);
    let current_User = currentPlayer.replace('.', '_');

    refUserInfo.child(current_User).child('bot-stat').update({
        ['char-type']: charType,
        ['hp']: hp,
        ['damage']: damage,
        ['imgSource']: imgSource,
        ['win']: false,
    })
}

// Cancel Modal ที่เปิดอยู่ และ reset เวลาใหม่
function cancelModal(){
    clearInterval(intervalID);
    timeCount = 5;
    $("#time").html(timeCount+' s');
    //console.log('CreateRoom or FindRoom Canceled');
    
    //จะใช้งาน อย่างลืมเอาคอมเม้นออก
    // refRoom.child('room-'+roomNum).remove();
}