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

function stockSearch(ticker) {
    $.ajax({
        url: `https://financialmodelingprep.com/api/v3/stock/real-time-price/${ticker}`,
        method: 'GET',
        dataType: 'json',
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
            <div id=${response.symbol} class="col s6 m4">
                <!--Card start-->
                <div class="card">
                    <div class="card-content" style='position: relative'>
                        <a onclick="historySearch('${ticker}')" class="btn-floating pulse modal-trigger" href="#modal1" style='position: absolute; right: 10px; top: 10px'><i class="material-icons">multiline_chart</i></a>
                        <span class="card-title">${response.symbol}</span>
                        <p>$${response.price}/share</p>
                        <i>As of ${(moment().format("h:mm A"))}</i>
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
};

function historySearch(ticker) {

    //Empty old data from the modal, implement progress bar during wait
    $('.modal-content').empty()
    $('.modal-content').append(`<div class="progress"><div class="indeterminate"></div></div>`)

    //Make the API call
    $.ajax({
        url: `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line`,
        method: 'GET',
        dataType: 'json',
        error: function (err) {
            console.log(err)
            M.toast({ html: `Our sources cannot provide information for ${ticker.toUpperCase()} at this time. Try again later.` })
        }
    }).then(function (response) {
        let gatheredClosingValues = []
        let gatheredClosingDates = []
        console.log(response)
        console.log(response.historical.length)
        for (i = 0; i < response.historical.length; i += 30) {
            gatheredClosingValues.push(response.historical[i].close)
            gatheredClosingDates.push(response.historical[i].date)
        };
        console.log(gatheredClosingValues)

        //Prepare the modal for new data
        $('.modal-content').empty()
        $('.modal-content').append(`<h5 id='companyForHistory'>Historical Values for ${ticker}</h5>`)
        $('.modal-content').append(`<canvas id="myChart"></canvas>`)

        //Create the new chart
        var ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: gatheredClosingDates,
                datasets: [{
                    label: 'Share Value',
                    data: gatheredClosingValues,
                    backgroundColor: [
                        'rgba(13, 193, 175, 0.5)'
                    ],
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    })
};

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
    $(this).parent().parent().parent().fadeOut()
})