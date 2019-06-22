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

const txtEmail = document.getElementById('txtEmail')
const txtPassword = document.getElementById('txtPassword')
const btnLogin = document.getElementById('btnLogin')
const btnSignUp = document.getElementById('btnSignUp')
const btnLogout = document.getElementById('btnLogout')

//Login
btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
})

//Sign up
btnSignUp.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise
        //.then(user => console.log(user))
        .catch(e => console.log(e.message));
})

//Log out
btnLogout.addEventListener('click', e => {
    firebase.auth().signOut()
})

//Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log(firebaseUser)
        window.location.replace("file:///Users/Developer/Dropbox/UNC-Project01/stocks/stocks.html");
        btnLogout.classList.remove('hide')
    } else {
        console.log('not logged in')
        //window.location.replace("file:///Users/Developer/Dropbox/UNC-Project01/stocks/login.html");
        btnLogout.classList.add('hide')
    }
})

//#######################################################################################
//#######################################################################################
//#######################################################################################
//#######################################################################################
//#######################################################################################
//#######################################################################################

M.AutoInit();

function stockSearch(ticker) {
    $.ajax({
        url: `https://financialmodelingprep.com/api/v3/stock/real-time-price/${ticker}`,
        method: 'GET',
        dataType: 'json', //Seems to workaround the CORS issue
        error: function (err) {
            console.log(err)
            M.toast({ html: `Our sources cannot provide information ${ticker.toUpperCase()} at this time. Try again later.` })
        }
    }).then(function (response) {
        console.log(response)
        if (response.symbol === undefined) {
            M.toast({ html: 'It appears that you entered an invalid ticker symbol.' })
        } else {
            $('#locationForCards').prepend(`
            <div class="col s12 m3">
                <!--Card start-->
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">${response.symbol}</span>
                        <p>$${response.price}/share</p>
                    </div>
                    <div class="card-action">
                        <a href="#">Remove</a>
                    </div>
                </div>
                <!--Card end-->
            </div>
        `);
        }
    })
}

//Event listeners
$(document).on("click", "#stockGrabButton", function () {
    event.preventDefault()
    let sym = $('#tickerToGrab').val().toUpperCase()
    console.log(sym)
    stockSearch(sym)
    $('#queryStockForm').trigger('reset')
})

$(document).ready(function () {
    $('.tap-target').tapTarget();
});

$(document).ready(function () {
    $('.modal').modal();
});

$(document).ready(function () {
    $('.sidenav').sidenav();
});

let stockSymbols = ['AAPL']

for (var symbol = 0; symbol < stockSymbols.length; symbol++) {
    stockSearch(stockSymbols[symbol])
}



$(document).on('submit', '#searchStockForm', function () {
    event.preventDefault()
    let enteredValue = $('#stockToSearch').val()
    stockSearch(enteredValue.toUpperCase())
    $('#searchStockForm').trigger('reset')
});

