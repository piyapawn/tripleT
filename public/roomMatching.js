// ref vanriable
const refGameInfo = firebase.database().ref('GameInfo')
const refUserInfo = firebase.database().ref('UserInfo')
const refRoom = firebase.database().ref('Room')

/* Room Status */
// เอาค่าต่างๆจาก RoomStatus ใน realtime database
refGameInfo.on('value', snapshot => {
    roomStatus(snapshot);
})

refUserInfo.on('value', snapshot => {
    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);
    let current_User = currentPlayer.replace('.', '_');

    console.log('Child not Exist?: '+snapshot.child(current_User).child(current_User+'-room').exists());
    console.log('Child Exist?: '+snapshot.child(current_User).child(current_User+'-room').exists() == false);
})

let roomQuantity = 0;
let lastestRoomNum;
let roomList = [];

function roomStatus(snapshot){
    //console.log(snapshot.val());
    snapshot.forEach((data) => {
        const gameInfos = data.val();
        //console.log(gameInfos);
        Object.keys(gameInfos).forEach(key => {
            switch(key){
                case 'RoomQuantity':
                    roomQuantity = gameInfos[key];
                    console.log('RoomQuantity: '+roomQuantity);
                    break;
                case 'lastestRoomNum':
                    lastestRoomNum = Math.max(roomQuantity, gameInfos[key])
                    console.log('The Lastest RoomNum: '+lastestRoomNum);
                    break;
            }
        })
    })
    if(roomQuantity == 0){
        updateLastestRoomNum(1);
        roomList = [];
        console.log('Room List: '+roomList);
    }
    else{
        roomList.push(lastestRoomNum);
        //roomList = removeDuplicates(roomList);
        roomList.sort();
        console.log('Room List: '+roomList);
    }
}

let playerQuantity;

/* Room */
refRoom.on('value', snapshot => {
    //console.log('Room Quantity: '+roomQuantity);
    //console.log('playerQuantitySnapshot: '+snapshot.child('room-'+roomNum).numChildren());
    //console.log('playerQuantity: '+playerQuantity);
    refGameInfo.child('RoomStatus').update({
        ['RoomQuantity']: snapshot.numChildren(),
    });

    playerQuantity = snapshot.child('room-'+lastestRoomNum).numChildren();
    console.log('Player Quantity: '+playerQuantity)
    if(playerQuantity > 0){
        refGameInfo.child('RoomStatus').update({
            ['room-'+lastestRoomNum+'-playerQuantity']: playerQuantity-6,
        });
    }
    else{
        refGameInfo.child('RoomStatus').update({
            ['room-'+lastestRoomNum+'-playerQuantity']: playerQuantity,
        });
    }
})

/* การสร้างห้อง / เข้าร่วมห้อง */

// ประกาศตัวแปร เลขห้อง, จำนวนห้อง, จำนวนผู้เล่นในห้อง


// User ขณะที่ใช้งาน



let createOrJoin = document.getElementById('createOrJoin');

function createOrJoinRoom(charType, hp, damage, imgSource){
    /* --- check ว่ามีห้องไหม... --- */
    /* ถ้าไม่มีห้องเลย ให้... */
    if(roomQuantity == 0){        
        // สร้างห้องใหม่
        playerX_CreateRoom(charType, hp, damage, imgSource);
        userRoom();
    }
    /* ถ้ามีห้องแล้ว ให้... */
    else{
        /* -- เช็คจำนวนผู้เล่นในห้องแต่ละห้อง... -- */
        // ถ้าแต่ละห้องมีผู้เล่น 2 คนครบแล้ว ให้...
        if((playerQuantity-6) == 2){
            // เพิ่มเลขห้องล่าสุด
            lastestRoomNum++;
            updateLastestRoomNum(lastestRoomNum);

            // สร้างห้องใหม่
            playerX_CreateRoom(charType, hp, damage, imgSource);
            userRoom();
        }
        // ถ้ามีห้องหนึ่งยังมีผู้เล่นเพียง 1 คน ให้...
        else if((playerQuantity-6) == 1){
            // join ห้องที่มีผู้เล่น 1 คน
            playerO_Join(charType, hp, damage, imgSource);
            userRoom();
        }
        // ถ้ามีห้องหนึ่งที่ยังไม่มีผู้เล่นเลย ให้...
        else{
            // เพิ่มเลขห้องล่าสุด
            lastestRoomNum++;
            updateLastestRoomNum(lastestRoomNum);

            // join ห้องที่ไม่มีผู้เล่น
            playerX_CreateRoom(charType, hp, damage, imgSource);
            userRoom();
        }
    }
}

function setModalText(){
    if(roomQuantity == 0){
        createOrJoin.innerHTML = 'Create Room . . .';
    }
    else{
        if(playerQuantity == 2){
            createOrJoin.innerHTML = 'Create Room . . .';            
        }
        else if(playerQuantity == 1){
            createOrJoin.innerHTML = 'Join room . . .';
        }
        else{
            createOrJoin.innerHTML = 'Create Room . . .';
        }
    }
}

// Set Player X
function playerX_CreateRoom(charType, hp, damage, imgSource){
    // User ที่ใช้งานในขณะนั้น
    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);

    // update Player X และ update เลขห้อง
    refRoom.child('room-'+lastestRoomNum).update({
        ['roomNum']: lastestRoomNum,
        ['turn']: 'X',
        ['table']: '',
        ['round']: 1,
        ['winRound']: false,
        ['winMatch']: false,
    });

    refRoom.child('room-'+lastestRoomNum).child('playerX').update({
        ['name']: currentPlayer,
        ['char-type']: charType,
        ['hp']: hp,
        ['damage']: damage,
        ['imgSource']: imgSource,
        ['win']: false,
    });
}

// Set Player O
function playerO_Join(charType, hp, damage, imgSource){
    // User ที่ใช้งานในขณะนั้น
    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);

    // update Player O
    refRoom.child('room-'+lastestRoomNum).update({
        ['playerO']: currentPlayer,
    });

    refRoom.child('room-'+lastestRoomNum).child('playerO').update({
        ['name']: currentPlayer,
        ['char-type']: charType,
        ['hp']: hp,
        ['damage']: damage,
        ['imgSource']: imgSource,
        ['win']: false,
    });
}

function userRoom(){
    const currentUser = firebase.auth().currentUser;
    const currentEmail = currentUser.email;
    const currentUid = currentUser.uid;
    let adIndex = currentEmail.indexOf("@");
    let currentPlayer = currentEmail.slice(0, adIndex);
    let current_User = currentPlayer.replace('.', '_');

    console.log('Fuck');

    refUserInfo.on('value', snapshot => {
        console.log('Fuck You');
        if(currentUser){
            console.log('Fuck You Bitch');
            //console.log('Child Exist?: '+snapshot.child(current_User).child(current_User+'-room').exists())
            if(snapshot.child(current_User).child(current_User+'-room').exists() == false){
                console.log('Fuck You Bitch Boy');
                //console.lof('Room Exist: '+snapshot.child(current_User).child(current_User+'-room').exists());
                refUserInfo.child(current_User).update({
                    [current_User+'-room']: lastestRoomNum,
                });
            }
        }
    })
}

function updateLastestRoomNum(roomNumber){
    refGameInfo.child('RoomStatus').update({
        ['lastestRoomNum']: roomNumber,
    });
}

function removeDuplicates(roomList) {
    return [...new Set(roomList)];
}

export {createOrJoinRoom, playerX_CreateRoom, playerO_Join, setModalText};
//export {roomList};