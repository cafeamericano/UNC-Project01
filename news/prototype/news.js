$("#run-search").on("click", function(event) {
  event.preventDefault();
  clear();
  var query = $("#search-term")
    .val()
    .trim();
  var scope = $("#scope").val();
  var category = $("#category").val();
  var categoryURL = "";
  if (category !== "") {
    categoryURL = "category=" + $("#category").val() + "&";
  }
  var queryURL =
    "https://newsapi.org/v2/" +
    scope +
    "?q=" +
    query +
    "&" +
    categoryURL +
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
      <div id=${latestNews[i].title} class="col s12 m6">
          <!--Card start-->
          <div class="card">
              <div class="card-content>
                  <span class="card-title">${latestNews[i].title}</span>
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
                  }' class='cardDeleteButton'>Remove</button>
              </div>
              <div class="card-action">
                  <button id= ${
                    latestNews[i].title
                  }' class='cardBookmark'>Bookmark</button>
              </div>
          </div>
          <!--Card end-->
      </div>
  `);
  }
}

function clear() {
  $("#locationForCards").empty();
}

$("#clear-all").on("click", function() {
  clear();
});
