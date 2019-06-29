$(document).ready(function() {
  var pageNum = 1;
  var queryURL = "";
  var page = "";
  var scope = "";
  var countryURL = "";

  $("#next").on("click", function() {
    clear();
    $("#errorDiv").empty();
    $("#errorDiv").hide();
    pageNum++;
    page = "page=" + pageNum + "&";
    queryURL =
      "https://newsapi.org/v2/" +
      scope +
      "?q=" +
      query +
      "&" +
      +page +
      "apiKey=d5a51f0326f74bd683a2c573c8562424";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(newsApp);
  });

  $("#previous").on("click", function() {
    if (pageNum > 1) {
      clear();
      $("#errorDiv").empty();
      $("#errorDiv").hide();
      console.log(pageNum);
      pageNum--;
      page = "page=" + pageNum + "&";
      queryURL =
        "https://newsapi.org/v2/" +
        scope +
        "?q=" +
        query +
        "&" +
        +page +
        "apiKey=d5a51f0326f74bd683a2c573c8562424";
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(newsApp);
    } else {
      $("#errorDiv").append("<p>You're on the first page already.</p>");
      $("#errorDiv").show();
    }
  });

  $("#search-term").keypress(function(event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
      $("#errorDiv").empty();
      $("#errorDiv").hide();
      event.preventDefault();
      clear();
      query = $("#search-term")
        .val()
        .trim();
      scope = $("#scope").val();
      if (scope == "everything") {
        countryURL = "";
      }
      countryURL = "";
      if (scope == "top-headlines") {
        countryURL = "country=us&";
      } else {
        countryURL = "";
      }
      if (scope == "top-headlines") {
        page = "";
      } else {
        page = "page=" + pageNum + "&";
      }
      queryURL =
        "https://newsapi.org/v2/" +
        scope +
        "?q=" +
        query +
        "&" +
        countryURL +
        page +
        "apiKey=d5a51f0326f74bd683a2c573c8562424";
      console.log(queryURL);
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(newsApp);
    }
  });

  function newsApp(news) {
    var newsCard = "";
    var latestNews = news.articles;
    console.log(latestNews.length);
    if (latestNews.length === 0) {
      var errorTop = $("<p>Error: No articles on your topic.</p>");
      $("#errorDiv").append(errorTop);
      $("#errorDiv").show();
    } else {
      for (i = 0; i < latestNews.length; i++) {
        newsCard = $("#locationForCards").append(`
      <div id='${i}-card' class="col s12 m6 news-card-containers">
          <!--Card start-->
          <div class="card newz">
              <div class="card-content>
                  <h5 class="card-title new2"><strong>${
                    latestNews[i].title
                  }</strong></h5>
                  <p>Description: ${latestNews[i].description}</p>
                  <img src="${latestNews[i].urlToImage}" class="responsive-img">
                  <p>Written By: ${latestNews[i].author}</p>
                
                  <p>Published on: ${latestNews[i].publishedAt}</p>
                  
              </div>
              
              <div class="card-action news-action" style="position:absolute">
              <a href="${latestNews[i].url}" class="btn">Full Article
    </a>
                  <button id='${i}-remove' class='cardDeleteButton1 btn'>Remove</button>
              </div>
          </div>
          <!--Card end-->
      </div>
  `);
        $(".cardDeleteButton1").on("click", function() {
          $(this)
            .parent()
            .parent()
            .parent()
            .fadeOut();
        });
      }
    }
  }

  function clear() {
    $("#locationForCards").empty();
  }

  $("#clear-all").on("click", function() {
    clear();
  });
});

$("#errorDiv").hide();
$("#page-number").hide();
