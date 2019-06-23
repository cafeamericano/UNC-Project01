//#######################################################################################
//###############################               #########################################
//###############################    GLOBAL     #########################################
//###############################               #########################################
//#######################################################################################

//FIREBASE SETUP#########################################################################
//#######################################################################################

var firebaseConfig = {
    apiKey: "AIzaSyBAFakhuIZwevHjyCyEFia2vW4j5DPOom4",
    authDomain: "project1dashboard.firebaseapp.com",
    databaseURL: "https://project1dashboard.firebaseio.com",
    projectId: "project1dashboard",
    storageBucket: "",
    messagingSenderId: "629434949340",
    appId: "1:629434949340:web:5e49ca8bcf7b3cda"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser)
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
    promise.catch(function (error) {
        if (error.message === 'The email address is badly formatted.') {
            M.toast({ html: 'The email provided is not a valid email address.' })

        } else if (error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
            M.toast({ html: 'The entered email address is incorrect.' })

        } else if (error.message === 'The password is invalid or the user does not have a password.') {
            M.toast({ html: 'The entered password is incorrect.' })

        }
    });
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