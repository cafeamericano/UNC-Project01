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

//Realtime listener for authentication
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser)
        $('#loggedInUserEmail').text(`${firebaseUser.email}`)

        database.ref(`/${firebaseUser.uid}/cryptocurrency`).once('value').then(function (snapshot) {
            let cryptoArr = Object.keys(snapshot.val())
            for (var symbol = 0; symbol < cryptoArr.length; symbol++) {
                cryptoSearch(cryptoArr[symbol])
            }
        });

    } else {
        console.log('Logged out.')
        window.location.replace("../index.html");
    }
})

// Reference to the database
var database = firebase.database();

//MATERIALIZE INITIALIZATION#############################################################
//#######################################################################################

M.AutoInit();

//EVENT LISTENERS########################################################################
//#######################################################################################

//Log out
logoutButton.addEventListener('click', e => {
    firebase.auth().signOut()
    window.location.replace("../index.html");
})

//#######################################################################################
//###############################               #########################################
//############################### PAGE SPECIFIC #########################################
//###############################               #########################################
//#######################################################################################


//FUNCTIONS##############################################################################
//#######################################################################################

function cryptoSearch(ticker) {
    $.ajax({
        url: `https://financialmodelingprep.com/api/v3/cryptocurrency/${ticker}`,
        method: 'GET',
        dataType: 'json',
        error: function (err) {
            console.log(err)
            M.toast({ html: `Our sources cannot provide information for ${ticker.toUpperCase()} at this time. Try again later.` })
        }
    }).then(function (response) {
        console.log(response)
        if (response.name === undefined) {
            M.toast({ html: 'It appears that you entered an invalid ticker symbol.' })
        } else {
            $('#locationForCards').prepend(`
            <div id=${response.name} class="col s12 m4 l3">
                <!--Card start-->
                <div class="card">
                    <div class="card-content" style='position: relative'>
                        <span class="card-title">${response.name}</span>
                        <p>$${response.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} / ${response.name}</p>
                        <p>24hr Change : $${response.changes}</p>
                    </div>
                    <div class="card-action">
                        <a id='${response.name}' class='cardDeleteButton'>Remove</a>
                    </div>
                </div>
                <!--Card end-->
            </div>
        `);
             var user = firebase.auth().currentUser.uid;
             console.log(user)
             database.ref(`/${user}/cryptocurrency/`).update({
                 [ticker]: ticker
             });
        }
    })
};



//EVENT LISTENERS########################################################################
//#######################################################################################

$(document).on('submit', '#searchCryptoForm', function () {
    event.preventDefault()
    let enteredValue = $('#cryptoToSearch').val()
    cryptoSearch(enteredValue.toUpperCase())
    $('#searchCryptoForm').trigger('reset')
});

$(document).on("click", ".cardDeleteButton", function () {
    let docID = ($(this).attr('id'))
    var user = firebase.auth().currentUser.uid;
    database.ref(`/${user}/cryptocurrency/${docID}`).remove()
    $(this).parent().parent().parent().fadeOut()
})