firebase.auth().onAuthStateChanged((user) => {
    setupUI(user);
});

const loginItems = document.querySelectorAll('.logged-in');
const logoutItems = document.querySelectorAll('.logged-out');
const flexEnd = document.getElementById('flex-end')

function setupUI(user){
    const refUserInfo = firebase.database().ref('UserInfo')
    if(user){
        //location.replace("menuPage.html")
        let emailUser = user.email;
        let adIndex = emailUser.indexOf("@");
        let playerUsername = emailUser.slice(0, adIndex);
        document.querySelector('#user-profile-name').innerHTML = 'Player : '+playerUsername;

        loginItems.forEach(item => item.style.display = 'inline-block');
        logoutItems.forEach(item => item.style.display = 'none');
        flexEnd.style.display = 'flex';
        refUserInfo.child(user.uid).update({
            ['Email']: user.email,
            ['ID']: user.uid,
        });
    }
    else{
        //location.replace("index.html")
        document.querySelector('#user-profile-name').innerHTML = '';
        document.querySelector('#user-profile-name').display = 'none';
        flexEnd.style.display = 'none';
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'inline-block');
    }
}