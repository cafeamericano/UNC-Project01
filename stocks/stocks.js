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


        database.ref(`/${firebaseUser.uid}/stocks`).once('value').then(function (snapshot) {
            let stockSymbols = Object.keys(snapshot.val())
            for (var symbol = 0; symbol < stockSymbols.length; symbol++) {
                stockSearch(stockSymbols[symbol])
            }
        });

    } else {
        console.log('Logged out.')
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
    window.location.replace("../login/login.html");
})

//#######################################################################################
//###############################               #########################################
//############################### PAGE SPECIFIC #########################################
//###############################               #########################################
//#######################################################################################


//FUNCTIONS##############################################################################
//#######################################################################################

function stockSearch(ticker) {
    $.ajax({
        url: `https://financialmodelingprep.com/api/v3/stock/real-time-price/${ticker}`,
        method: 'GET',
        dataType: 'json', //Seems to workaround the CORS issue
        error: function (err) {
            console.log(err)
            M.toast({ html: `Our sources cannot provide information for ${ticker.toUpperCase()} at this time. Try again later.` })
        }
    }).then(function (response) {
        console.log(response)
        if (response.symbol === undefined) {
            M.toast({ html: 'It appears that you entered an invalid ticker symbol.' })
        } else {
            $('#locationForCards').prepend(`
            <div id=${response.symbol} class="col s12 m3">
                <!--Card start-->
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">${response.symbol}</span>
                        <p>$${response.price}/share</p>
                    </div>
                    <div class="card-action">
                        <a id='${response.symbol}' class='cardDeleteButton'>Remove</a>
                    </div>
                </div>
                <!--Card end-->
            </div>
        `);
            var user = firebase.auth().currentUser.uid;
            console.log(user)
            database.ref(`/${user}/stocks/`).update({
                [ticker]: ticker
            });
        }
    })
}

//EVENT LISTENERS########################################################################
//#######################################################################################

$(document).on("click", "#stockGrabButton", function () {
    event.preventDefault()
    let sym = $('#tickerToGrab').val().toUpperCase()
    console.log(sym)
    stockSearch(sym)
    $('#queryStockForm').trigger('reset')
})

$(document).on('submit', '#searchStockForm', function () {
    event.preventDefault()
    let enteredValue = $('#stockToSearch').val()
    stockSearch(enteredValue.toUpperCase())
    $('#searchStockForm').trigger('reset')
});

$(document).on("click", ".cardDeleteButton", function () {
    let docID = ($(this).attr('id'))
    var user = firebase.auth().currentUser.uid;
    database.ref(`/${user}/stocks/${docID}`).remove()
    $(this).parent().parent().parent().remove()
})