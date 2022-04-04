const signin = document.getElementById('signin-google');
signin.addEventListener("click", signIn);
const auth = firebase.auth();

function signIn(){
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    //document.getElementById("newTab").click();
    auth.signInWithPopup(googleProvider)
    .then((result) => {
        var user = result.user; 
        console.log(user);
    })
    .catch(error => {
        console.error(error);
    })
}

const signout = document.querySelector('#signout-google');
signout.addEventListener('click', (user) => {
    firebase.auth().signOut();
    console.log('Logout complete.');
    //location.replace("index.html")
});

firebase.auth().onAuthStateChanged((user) => {
    console.log('User: ', user);
    setupUI(user);
});

const loginItems = document.querySelectorAll('.logged-in');
const logoutItems = document.querySelectorAll('.logged-out');

function setupUI(user){
    if(user){
        console.log('Main Menu Page')
        //location.replace("menuPage.html")
        loginItems.forEach(item => item.style.display = 'inline-block');
        logoutItems.forEach(item => item.style.display = 'none');
    }
    else{
        console.log('Sign In Page')
        //location.replace("index.html")
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'inline-block');
    }
}


//Select character
const selectmode = document.getElementById('play');
selectmode.addEventListener("click", selectchar);

function selectchar(){
    document.getElementById('head-mes').innerHTML = `Select Character`;
    document.getElementById('forbackbutton').style.display = 'inline-block';
    console.log('Select character page');
    choosecharUI()
}

function choosecharUI(){
    document.querySelector(`.gamemode`).innerHTML = `
    <button id="character" type="click" class="char1 logged-out">
        <img src="image/golem.png" width="200px" height="200px">
        <p class="modetext">Golem</p>
      </button>
      <button id="character" type="click" class="char2 logged-out">
      <img src="image/orc.png" width="200px" height="200px">
      <p class="modetext">Orc</p>
      </button>
      <button id="character" type="click" class="char3 logged-out">
      <img src="image/reaper.png" width="200px" height="200px">
      <p class="modetext">Reaper</p>
      </button>
    `;

    //Function - GameStart
    const gamestart = document.getElementById('character');
    gamestart.addEventListener("click", ready);
    
    function ready(){
        document.getElementById('message').style.display = 'none';
        document.getElementById('forbackbutton').style.display = 'none';
        document.getElementById('dont 1').style.display = 'none';
        document.getElementById('dont 2').style.display = 'none';
        document.getElementById('dont 3').style.display = 'none';
        document.getElementById('signout-google').style.display = 'none';
        document.getElementById('mode').style.display = 'none';
        document.getElementById('showhp').style.display = 'inline-block';
        document.getElementById('giveup').style.display = 'inline-block';
        console.log('Ready to Start');
        gameUI()
    }

    function gameUI(){
        document.querySelector(`.play`).innerHTML = `
        <div id="board" class="boxy">
            <div>
                <div id="avatar" class="p1avatar">
                </div>
                <button id="player1name" class="name" disabled>Player 1
                </button>
                <button id="player1score" class="score" disabled>Score
                </button>
            </div>
            <table id="bort">
                <tr id="A">
                    <td class="one square corner"> </td>
                    <td class="two square middle"> </td>
                    <td class="three square corner"> </td>
                </tr>
                <tr id="B">
                    <td class="one square middle"> </td>
                    <td class="two square center"> </td>
                    <td class="three square middle"> </td>
                </tr>
                <tr id="C">
                    <td class="one square corner"> </td>
                    <td class="two square middle"> </td>
                    <td class="three square corner"> </td>
                </tr>
            </table>
            <div>
                <div id="avatar" class="p2avatar">
                </div>
                <button id="player2name" class="name" disabled>Player 2
                </button>
                <button id="player2score" class="score" disabled>Score
                </button>
            </div>
        </div>
        `;
    }
}

const backButton = document.getElementById('backButt');
backButton.addEventListener("click", backPage);

function backPage(){
    backButton.style.display = 'none';
}