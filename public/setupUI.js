firebase.auth().onAuthStateChanged((user) => {
    console.log('User: ', user);
    setupUI(user);
});

const loginItems = document.querySelectorAll('.logged-in');
const logoutItems = document.querySelectorAll('.logged-out');
const flexEnd = document.getElementById('flex-end')

function setupUI(user){
    const refUserInfo = firebase.database().ref('UserInfo')
    if(user){
        console.log('Sign In');
        //location.replace("menuPage.html")
        let emailUser = user.email;
        let adIndex = emailUser.indexOf("@");
        let playerUsername = emailUser.slice(0, adIndex);
        document.querySelector('#user-profile-name').innerHTML = 'Player : '+playerUsername;

        console.log('Email: '+user.email);
        console.log('UID: '+user.uid);
        loginItems.forEach(item => item.style.display = 'inline-block');
        logoutItems.forEach(item => item.style.display = 'none');
        flexEnd.style.display = 'flex';
        refUserInfo.child(playerUsername.replace('.', '_')).update({
            ['Email']: user.email,
            ['ID']: user.uid,
        });
    }
    else{
        console.log('Sign Out')
        //location.replace("index.html")
        document.querySelector('#user-profile-name').innerHTML = '';
        document.querySelector('#user-profile-name').display = 'none';
        flexEnd.style.display = 'none';
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'inline-block');
    }
}

const refRoom = firebase.database().ref('Room')
/*
refRoom.on('value', snapshot => {
    console.log('Room: '+snapshot.val())
})
*/