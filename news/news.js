//#######################################################################################
//###############################               #########################################
//###############################    GLOBAL     #########################################
//###############################               #########################################
//#######################################################################################

//FIREBASE SETUP#########################################################################
//#######################################################################################

//var firebaseConfig = {
//apiKey: "AIzaSyBAFakhuIZwevHjyCyEFia2vW4j5DPOom4",
//authDomain: "project1dashboard.firebaseapp.com",
//databaseURL: "https://project1dashboard.firebaseio.com",
//projectId: "project1dashboard",
//storageBucket: "",
//messagingSenderId: "629434949340",
//appId: "1:629434949340:web:5e49ca8bcf7b3cda"
//};

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);

//Realtime listener for authentication
//firebase.auth().onAuthStateChanged(firebaseUser => {
//if (firebaseUser) {
//console.log(firebaseUser);
//$("#loggedInUserEmail").text(`${firebaseUser.email}`);

// database.ref(`/${firebaseUser.uid}/news`).once('value').then(function (snapshot) {
//     let newsArr = Object.keys(snapshot.val())
//     for (var i = 0; i < newsArr.length; i++) {
//         newsSearch(newsArr[i])
//     }
// });
//} else {
//console.log("Logged out.");
//window.location.replace("../index.html");
//}
//});

// Reference to the database
//var database = firebase.database();

//MATERIALIZE INITIALIZATION#############################################################
//#######################################################################################

M.AutoInit();

//EVENT LISTENERS########################################################################
//#######################################################################################

//Log out
//logoutButton.addEventListener("click", e => {
//firebase.auth().signOut();
//window.location.replace("../index.html");
//});

//#######################################################################################
//###############################               #########################################
//############################### PAGE SPECIFIC #########################################
//###############################               #########################################
//#######################################################################################

//FUNCTIONS##############################################################################
//#######################################################################################
var queryURL = "";
var page = 1;
var limit = "";
var pageNum = "";

$("#next").on("click", function() {
  if (page > 1) {
    page--;
    queryURL =
      ("https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
        searchTerm +
        "&api-key=" +
        apiKey) &
      ("page=" + page + "&limit=" + limit);
    $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "json" //Seems to workaround the CORS issue
    }).then(function(response) {
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
    });
  } else {
    var error = $("#errorDiv").append(
      "<p>You are already on the first page</p>"
    );
    $("#errorDiv").show();
  }
});

$("#next").on("click", function() {
  page++;
  queryURL =
    ("https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
      searchTerm +
      "&api-key=" +
      apiKey) &
    ("page=" + page + "&limit=" + limit);
  $.ajax({
    url: queryURL,
    method: "GET",
    dataType: "json" //Seems to workaround the CORS issue
  }).then(function(response) {
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
  });
});

function newsSearch(searchTerm) {
  apiKey = "AXZRvJ0jreBWRHyR70GN1GaADEpWHywa";
  page = 1;
  limit = 10;
  queryURL =
    ("https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
      searchTerm +
      "&api-key=" +
      apiKey) &
    ("page=" + page + "&limit=" + limit);
  $.ajax({
    url: queryURL,
    method: "GET",
    dataType: "json" //Seems to workaround the CORS issue
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

//EVENT LISTENERS########################################################################
//#######################################################################################

$(document).on("click", "#newsGrabButton", function() {
  event.preventDefault();
  let topic = $("#searchTerm")
    .val()
    .toUpperCase();
  console.log(topic);
  newsSearch(topic);
  $("#queryNewsForm").trigger("reset");
});

$(document).on("submit", "#searchNewsForm", function() {
  event.preventDefault();
  let enteredValue = $("#newsToSearch").val();
  newsSearch(enteredValue.toUpperCase());
  $("#searchNewsForm").trigger("reset");
});

// $(document).on("click", ".cardDeleteButton", function () {
//     let docID = ($(this).attr('id'))
//     var user = firebase.auth().currentUser.uid;
//     database.ref(`/${user}/news/${docID}`).remove()
//     $(this).parent().parent().parent().fadeOut()
// })
