//#######################################################################################
//###############################               #########################################
//###############################    GLOBAL     #########################################
//###############################               #########################################
//#######################################################################################

//FIREBASE SETUP#########################################################################
//#######################################################################################

var firebaseConfig = {
    apiKey: "AIzaSyD0H7-8Kg84ccGyLbj6PUuC7IkeORh6J94",
    authDomain: "authtest-5430b.firebaseapp.com",
    databaseURL: "https://authtest-5430b.firebaseio.com",
    projectId: "authtest-5430b",
    storageBucket: "",
    messagingSenderId: "751290791098",
    appId: "1:751290791098:web:34f86706cbdcc777"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        window.location.replace("../stocks/stocks.html");
    } else {
        console.log('not logged in')
    }
})


//MATERIALIZE INITIALIZATION#############################################################
//#######################################################################################

M.AutoInit();

//EVENT LISTENERS########################################################################
//#######################################################################################



//#######################################################################################
//###############################               #########################################
//############################### PAGE SPECIFIC #########################################
//###############################               #########################################
//#######################################################################################


//VARIABLES##############################################################################
//#######################################################################################

const inputEmail = document.getElementById('inputEmail')
const inputPassword = document.getElementById('inputPassword')
const loginButton = document.getElementById('loginButton')
const signUpButton = document.getElementById('signUpButton')

//EVENT LISTENERS########################################################################
//#######################################################################################

//Login
loginButton.addEventListener('click', e => {
    const email = inputEmail.value;
    const pass = inputPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
})

//Sign up
signUpButton.addEventListener('click', e => {
    const email = inputEmail.value;
    const pass = inputPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise
        //.then(user => console.log(user))
        .catch(e => console.log(e.message));
})