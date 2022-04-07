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
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'inline-block');
    }
    else{
        console.log('Sign In Page')
        //location.replace("index.html")
        loginItems.forEach(item => item.style.display = 'inline-block');
        logoutItems.forEach(item => item.style.display = 'none');
    }
}

const backButton = document.getElementById('backButt');
backButton.addEventListener("click", backPage);

function backPage(){
    console.log('I said BACK!');
    window.open("index.html", "_self");
}


/*---สำหรับไปหน้าเล่นเกม Gameboard.html---*/

const hero1choose = document.getElementById('character1');
hero1choose.addEventListener('click', openGameboard);

const hero2choose = document.getElementById('character2');
hero2choose.addEventListener('click', openGameboard);

const hero3choose = document.getElementById('character3');
hero3choose.addEventListener('click', openGameboard);

function openGameboard(){
    window.open("GameBoard.html", "_self");
    console.log('I clicked');
}