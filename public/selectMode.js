//Select character
const selectmode = document.querySelectorAll('.play');
selectmode.forEach(play => play.addEventListener('click', selectMode));

const refGameInfo = firebase.database().ref('GameInfo')
const refUserInfo = firebase.database().ref('UserInfo')

function selectMode(event){
    const modeClick = event.currentTarget.getAttribute('id');
    const buttonMode1 = document.getElementById('mode1').id;
    const buttonMode2 = document.getElementById('mode2').id;
    const buttonMode3 = document.getElementById('mode3').id;

    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser.uid;

    if(modeClick === buttonMode1){
        console.log('Select Mode 1');
        refUserInfo.child(currentUid).child('selectMode').update({
            ['VS Bot']: true,
            ['VS Other']: false,
            ['VS Friend']: false,
        });
        window.open("selectHero.html", "_self");
    }
    else if(modeClick === buttonMode2){
        console.log('Select Mode 2');
        refUserInfo.child(currentUid).child('selectMode').update({
            ['VS Bot']: false,
            ['VS Other']: true,
            ['VS Friend']: false,
        });
        window.open("selectHero.html", "_self");
    }
    else if(modeClick === buttonMode3){
        console.log('Select Mode 2');
        refUserInfo.child(currentUid).child('selectMode').update({
            ['VS Bot']: false,
            ['VS Other']: false,
            ['VS Friend']: true,
        });
        window.open("vsFriendSelectMode.html", "_self");
    }
}