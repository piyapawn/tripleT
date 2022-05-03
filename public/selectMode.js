//Select character
const selectmode = document.querySelectorAll('.play');
selectmode.forEach(play => play.addEventListener('click', selectMode));

const refGameInfo = firebase.database().ref('GameInfo')

function selectMode(event){
    const modeClick = event.currentTarget.getAttribute('id');
    const buttonMode1 = document.getElementById('mode1').id;
    const buttonMode2 = document.getElementById('mode2').id;

    //console.log('buttonMode1: '+buttonMode1);
    //console.log('buttonMode2: '+buttonMode2);
    //console.log('buttonMode3: '+buttonMode3);
    //console.log('modeClick: '+modeClick);

    if(modeClick === buttonMode1){
        console.log('Select Mode 1');
        refGameInfo.child('GameMode').update({
            ['VS Bot']: true,
            ['VS Other']: false,
            ['VS Friend']: false,
        });
    }
    else if(modeClick === buttonMode2){
        console.log('Select Mode 2');
        refGameInfo.child('GameMode').update({
            ['VS Bot']: false,
            ['VS Other']: true,
            ['VS Friend']: false,
        });
    }

    window.open("selectHero.html", "_self");
}