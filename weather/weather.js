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

        
        database.ref(`/${firebaseUser.uid}/weather`).once('value').then(function (snapshot) {
            let weatherArr = Object.keys(snapshot.val())
            for (var i = 0; i < weatherArr.length; i++) {
                weatherSearch(weatherArr[i])
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

function weatherSearch(city) {
    let apiKey =`4a664ff6f42237f34b83ba782227b041`;
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`,
        method: 'GET',
        dataType: 'json', //Seems to workaround the CORS issue
        error: function (err) {
            console.log(err)
            M.toast({ html: `Our sources cannot provide information for ${city} at this time. Try again later.` })
        }
    }).then(function (response) {
        console.log(response)
        if (response.symbol === 'hey') {
            M.toast({ html: 'It appears that you entered an invalid ticker symbol.' })
        } else {
            $('#locationForCards').prepend(`
            <div id=${response.name} class="col s12 m3">
                <!--Card start-->
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">${response.name}</span>
                        <p>${((response.main.temp - 273.15) * 9 / 5 + 32).toFixed(0)}℉</p>
                        <p>${response.weather[0].main}</p>
                        <p>${response.weather[0].icon}</p>
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
            
            database.ref(`/${user}/weather/`).update({
                [response.name]: response.name
            });
            
        }
    })
}

//EVENT LISTENERS########################################################################
//#######################################################################################

$(document).on("click", "#weatherGrabButton", function () {
    event.preventDefault()
    let sym = $('#tickerToGrab').val().toUpperCase()
    console.log(sym)
    weatherSearch(sym)
    $('#queryWeatherForm').trigger('reset')
})

$(document).on('submit', '#searchWeatherForm', function () {
    event.preventDefault()
    let enteredValue = $('#weatherToSearch').val()
    weatherSearch(enteredValue.toUpperCase())
    $('#searchWeatherForm').trigger('reset')
});

$(document).on("click", ".cardDeleteButton", function () {
    let docID = ($(this).attr('id'))
    var user = firebase.auth().currentUser.uid;
    database.ref(`/${user}/weather/${docID}`).remove()
    $(this).parent().parent().parent().fadeOut()
})
