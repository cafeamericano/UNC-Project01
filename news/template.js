M.AutoInit();

M.toast({ html: "Welcome to the finance and business dashboard!" });

function stockSearch(ticker) {
  $.ajax({
    url: `https://financialmodelingprep.com/api/v3/stock/real-time-price/${ticker}`,
    method: "GET",
    dataType: "json", //Seems to workaround the CORS issue
    error: function(err) {
      console.log(err);
      M.toast({
        html: `Our sources cannot provide information ${ticker.toUpperCase()} at this time. Try again later.`
      });
    }
  }).then(function(response) {
    console.log(response);
    if (response.symbol === undefined) {
      M.toast({
        html: "It appears that you entered an invalid ticker symbol."
      });
    } else {
      $("#locationForCards").append(`
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
  });
}

//Event listeners
$(document).on("click", "#stockGrabButton", function() {
  event.preventDefault();
  let sym = $("#tickerToGrab")
    .val()
    .toUpperCase();
  console.log(sym);
  stockSearch(sym);
  $("#queryStockForm").trigger("reset");
});

$(document).ready(function() {
  $(".tap-target").tapTarget();
});

$(document).ready(function() {
  $(".modal").modal();
});

$(document).ready(function() {
  $(".sidenav").sidenav();
});

let stockSymbols = ["AAPL"];

for (var symbol = 0; symbol < stockSymbols.length; symbol++) {
  stockSearch(stockSymbols[symbol]);
}

$(document).on("submit", "#searchStockForm", function() {
  event.preventDefault();
  let enteredValue = $("#stockToSearch").val();
  stockSearch(enteredValue.toUpperCase());
  $("#searchStockForm").trigger("reset");
});

// Code for News
function buildQueryURL() {
  var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  var queryParams = { "api-key": "oKetD5ZJwGfQipOtvljlopGuAnQbqdfs" };

  queryParams.q = $("#search-term")
    .val()
    .trim();
  var startYear = $("#start-year")
    .val()
    .trim();
  if (parseInt(startYear)) {
    queryParams.begin_date = startYear + "0101";
  }

  var endYear = $("#end-year")
    .val()
    .trim();
  if (parseInt(endYear)) {
    queryParams.end_date = endYear + "0101";
  }

  console.log("---------------\nURL: " + queryURL + "\n---------------");
  console.log(queryURL + $.param(queryParams));
  return queryURL + $.param(queryParams);
}

function updatePage(NYTData) {
  var numArticles = $("#article-count").val();

  console.log(NYTData);
  console.log("------------------------------------");

  for (var i = 0; i < numArticles; i++) {
    // Get specific article info for current index
    var article = NYTData.response.docs[i];

    // Increase the articleCount (track article # - starting at 1)
    var articleCount = i + 1;

    // Create the  list group to contain the articles and add the article content for each
    var $articleList = $("<ul>");
    $articleList.addClass("list-group");

    // Add the newly created element to the DOM
    $("#article-section").append($articleList);

    // If the article has a headline, log and append to $articleList
    var headline = article.headline;
    var $articleListItem = $("<li class='list-group-item articleHeadline'>");

    if (headline && headline.main) {
      console.log(headline.main);
      $articleListItem.append(
        "<span class='label label-primary'>" +
          articleCount +
          "</span>" +
          "<strong> " +
          headline.main +
          "</strong>"
      );
    }

    var byline = article.byline;

    if (byline && byline.original) {
      console.log(byline.original);
      $articleListItem.append("<h5>" + byline.original + "</h5>");
    }

    var section = article.section_name;
    console.log(article.section_name);
    if (section) {
      $articleListItem.append("<h5>Section: " + section + "</h5>");
    }

    var pubDate = article.pub_date;
    console.log(article.pub_date);
    if (pubDate) {
      $articleListItem.append("<h5>" + article.pub_date + "</h5>");
    }

    $articleListItem.append(
      "<a href='" + article.web_url + "'>" + article.web_url + "</a>"
    );
    console.log(article.web_url);

    $articleList.append($articleListItem);
  }
}

function clear() {
  $("#article-section").empty();
}

$("#run-search").on("click", function(event) {
  event.preventDefault();
  clear();
  var queryURL = buildQueryURL();
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);
});
on;
$("#clear-all").on("click", clear);
