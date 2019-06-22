M.AutoInit();

M.toast({ html: 'Welcome to the finance and business dashboard!' })


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