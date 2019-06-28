var pageNum = 1;
var queryURL = "";
var page = "";

$("#next").on("click", function() {
  clear();
  pageNum++;
  page = "page=" + pageNum + "&";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(newsApp);
});

$("#previous").on("click", function() {
  if (pageNum > 1) {
    clear();
    pageNum--;
    page = "page=" + pageNum + "&";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(newsApp);
  } else {
    $("#goHere").text("<h3>You're on the first page already.</h3>");
  }
});

$("#run-search").on("click", function(event) {
  event.preventDefault();
  clear();
  query = $("#search-term")
    .val()
    .trim();
  var scope = $("#scope").val();

  var category = $("#category").val();
  var categoryURL = "";
  if (category !== "" && scope == "top-headlines") {
    categoryURL = "category=" + $("#category").val() + "&";
  } else {
    categoryURL = "";
  }
  if (scope == "everything") {
    categoryURL = "";
    countryURL = "";
  }
  var country = $("#country").val();
  var countryURL = "";
  if (country !== "" && scope == "top-headlines") {
    countryURL = "country=" + country + "&";
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
    categoryURL +
    page +
    "apiKey=d5a51f0326f74bd683a2c573c8562424";
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(newsApp);
});

function newsApp(news) {
  var newsCard = "";
  var latestNews = news.articles;

  for (var i in latestNews) {
    newsCard = $("#locationForCards").append(`
      <div id='${latestNews[i].title}-card' class="col s12 m6">
          <!--Card start-->
          <div class="card newz">
              <div class="card-content>
                  <h5 class="card-title new2"><strong>${
                    latestNews[i].title
                  }</strong></h5>
                  <p>Description: ${latestNews[i].description}</p>
                  <img src="${latestNews[i].urlToImage}" class="responsive-img">
                  <p>Written By: ${latestNews[i].author}</p>
                  <p>${latestNews[i].content}</p>
                  <p>Published on: ${latestNews[i].publishedAt}</p>
                  <br>
                  <a href="${latestNews[i].url}" class="btn">Full Article
    </a>
              </div>
              <div class="card-action">
                  <button id='${
                    latestNews[i].title
                  }-remove' class='cardDeleteButton btn'>Remove</button>
              </div>
              <div class="card-action">
                  <button id= ${
                    latestNews[i].title
                  }-add' class='cardBookmark btn'>Bookmark</button>
              </div>
          </div>
          <!--Card end-->
      </div>
  `);
    $("cardDeleteButton").on("click", function() {
      $("#" + latestNews[i].title + "-card").hide();
    });
  }
}

function clear() {
  $("#locationForCards").empty();
}

$("#clear-all").on("click", function() {
  clear();
});
