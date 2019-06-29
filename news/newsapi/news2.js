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
    queryURL =
      "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
      query +
      "&api-key=AXZRvJ0jreBWRHyR70GN1GaADEpWHywa" +
      "&page=" +
      pageNum +
      "&limit=10";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      if (response.symbol === "hey") {
        M.toast({
          html: "It appears that you entered an invalid ticker symbol."
        });
      } else {
        for (i = 0; i < response.response.docs.length; i++) {
          $("#locationForCards").prepend(`
                <div id=${
                  response.response.docs[i].headline.main
                } class="col s12 m6">
                    <!--Card start-->
                    <div class="card">
                        <div class="card-content" style='height: 300px; overflow: scroll'>
                            <span class="card-title">${
                              response.response.docs[i].headline.main
                            }</span>
                            <small>Published 
                                ${response.response.docs[i].pub_date[0]}${
            response.response.docs[i].pub_date[1]
          }${response.response.docs[i].pub_date[2]}${
            response.response.docs[i].pub_date[3]
          }${response.response.docs[i].pub_date[4]}${
            response.response.docs[i].pub_date[5]
          }${response.response.docs[i].pub_date[6]}${
            response.response.docs[i].pub_date[7]
          }${response.response.docs[i].pub_date[8]}${
            response.response.docs[i].pub_date[9]
          }
                            </small>
                            <br/>
                            <br/>
                            <span>${
                              response.response.docs[i].abstract
                            }  </span><a href=${
            response.response.docs[i].web_url
          }>Read more.</a>
                        </div>
                        <div class="card-action">
                            <a id='${
                              response.response.docs[i].headline.main
                            }' class='cardDeleteButton'>Remove</a>
                        </div>
                    </div>
                    <!--Card end-->
                </div>
            `);
        }
        //var user = firebase.auth().currentUser.uid;
        //console.log(user);

        // database.ref(`/${user}/news/`).update({
        //     [response.name]: response.name
        // });
      }
    });

    $("#previous").on("click", function() {
      if (pageNum > 1) {
        clear();
        $("#errorDiv").empty();
        $("#errorDiv").hide();
        console.log(pageNum);
        pageNum--;
        queryURL =
          "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
          query +
          "&api-key=AXZRvJ0jreBWRHyR70GN1GaADEpWHywa" +
          "&page=" +
          pageNum +
          "&limit=10";
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
          console.log(response);
          if (response.symbol === "hey") {
            M.toast({
              html: "It appears that you entered an invalid ticker symbol."
            });
          } else {
            for (i = 0; i < response.response.docs.length; i++) {
              $("#locationForCards").prepend(`
                <div id=${
                  response.response.docs[i].headline.main
                } class="col s12 m6">
                    <!--Card start-->
                    <div class="card">
                        <div class="card-content" style='height: 300px; overflow: scroll'>
                            <span class="card-title">${
                              response.response.docs[i].headline.main
                            }</span>
                            <small>Published 
                                ${response.response.docs[i].pub_date[0]}${
                response.response.docs[i].pub_date[1]
              }${response.response.docs[i].pub_date[2]}${
                response.response.docs[i].pub_date[3]
              }${response.response.docs[i].pub_date[4]}${
                response.response.docs[i].pub_date[5]
              }${response.response.docs[i].pub_date[6]}${
                response.response.docs[i].pub_date[7]
              }${response.response.docs[i].pub_date[8]}${
                response.response.docs[i].pub_date[9]
              }
                            </small>
                            <br/>
                            <br/>
                            <span>${
                              response.response.docs[i].abstract
                            }  </span><a href=${
                response.response.docs[i].web_url
              }>Read more.</a>
                        </div>
                        <div class="card-action">
                            <a id='${
                              response.response.docs[i].headline.main
                            }' class='cardDeleteButton'>Remove</a>
                        </div>
                    </div>
                    <!--Card end-->
                </div>
            `);
            }
            //var user = firebase.auth().currentUser.uid;
            //console.log(user);

            // database.ref(`/${user}/news/`).update({
            //     [response.name]: response.name
            // });
          }
        });
      }
    });
  });

  $("#search-term").keypress(function(event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
      $("#errorDiv").empty();
      $("#errorDiv").hide();
      event.preventDefault();
      clear();
      pageNum = 1;
      query = $("#search-term")
        .val()
        .trim();
      queryURL =
        "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
        query +
        "&api-key=AXZRvJ0jreBWRHyR70GN1GaADEpWHywa" +
        "&page=" +
        pageNum +
        "&limit=10";
      console.log(queryURL);
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        if (response.symbol === "hey") {
          M.toast({
            html: "It appears that you entered an invalid ticker symbol."
          });
        } else {
          for (i = 0; i < response.response.docs.length; i++) {
            $("#locationForCards").prepend(`
                <div id=${
                  response.response.docs[i].headline.main
                } class="col s12 m6">
                    <!--Card start-->
                    <div class="card">
                        <div class="card-content" style='height: 300px; overflow: scroll'>
                            <span class="card-title">${
                              response.response.docs[i].headline.main
                            }</span>
                            <small>Published 
                                ${response.response.docs[i].pub_date[0]}${
              response.response.docs[i].pub_date[1]
            }${response.response.docs[i].pub_date[2]}${
              response.response.docs[i].pub_date[3]
            }${response.response.docs[i].pub_date[4]}${
              response.response.docs[i].pub_date[5]
            }${response.response.docs[i].pub_date[6]}${
              response.response.docs[i].pub_date[7]
            }${response.response.docs[i].pub_date[8]}${
              response.response.docs[i].pub_date[9]
            }
                            </small>
                            <br/>
                            <br/>
                            <span>${
                              response.response.docs[i].abstract
                            }  </span><a href=${
              response.response.docs[i].web_url
            }>Read more.</a>
                        </div>
                        <div class="card-action">
                            <a id='${
                              response.response.docs[i].headline.main
                            }' class='cardDeleteButton'>Remove</a>
                        </div>
                    </div>
                    <!--Card end-->
                </div>
            `);
          }
          //var user = firebase.auth().currentUser.uid;
          //console.log(user);

          // database.ref(`/${user}/news/`).update({
          //     [response.name]: response.name
          // });
        }
      });
    }
  });

  function clear() {
    $("#locationForCards").empty();
  }

  $("#clear-all").on("click", function() {
    clear();
  });
});

$("#errorDiv").hide();
$("#page-number").hide();
