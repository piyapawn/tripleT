const refVSFriendRoom = firebase.database().ref('VSFriendRoom')
const refUserInfo = firebase.database().ref('UserInfo')

refUserInfo.on('value', snapshot => {
    showMode(snapshot);
})

function showMode(snapshot){
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    const friendMode = snapshot.child(currentUid).child('selectMode').child('VS Friend').val();
    console.log('Friend Mode: '+friendMode)
    if(friendMode){
        $('#gameModeText').html('Mode : Play With Friend');
    }
}

//Select
const select = document.querySelectorAll('.vsFriendPlay');
select.forEach(vsFriendPlay => vsFriendPlay.addEventListener('click', selectCreateOrJoin));

function selectCreateOrJoin(event){
    const selectClick = event.currentTarget.getAttribute('id');
    const createRoom = document.getElementById('createRoom').id;
    const joinRoom = document.getElementById('joinRoom').id;

    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    console.log('Click: '+selectClick);
    console.log('Create: '+createRoom);
    console.log('Join: '+joinRoom);

    if(selectClick === createRoom){
        console.log('Create Room');
        refUserInfo.child(currentUid).child('FriendModeSelect').update({
            ['Create Room']: true,
            ['Join Room']: false,
        });
    }
    else if(selectClick === joinRoom){
        console.log('Join Room');
        refUserInfo.child(currentUid).child('FriendModeSelect').update({
            ['Create Room']: false,
            ['Join Room']: true,
        });
    }

    window.open("selectHero.html", "_self");
}

const backButton = document.getElementById('backButt');
backButton.addEventListener("click", backPage);

function backPage(){
    //console.log('I said BACK!');
    window.open("index.html", "_self");
}