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
    document.getElementById('forbackbutton').style.display= 'block';
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
}



