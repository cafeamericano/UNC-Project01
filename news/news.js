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
    console.log(firebaseUser);
    $("#loggedInUserEmail").text(`${firebaseUser.email}`);

    // database.ref(`/${firebaseUser.uid}/news`).once('value').then(function (snapshot) {
    //     let newsArr = Object.keys(snapshot.val())
    //     for (var i = 0; i < newsArr.length; i++) {
    //         newsSearch(newsArr[i])
    //     }
    // });
  } else {
    console.log("Logged out.");
    window.location.replace("../index.html");
  }
});

// Reference to the database
var database = firebase.database();

//MATERIALIZE INITIALIZATION#############################################################
//#######################################################################################

M.AutoInit();

//EVENT LISTENERS########################################################################
//#######################################################################################

//Log out
logoutButton.addEventListener("click", e => {
  firebase.auth().signOut();
  window.location.replace("../index.html");
});

//#######################################################################################
//###############################               #########################################
//############################### PAGE SPECIFIC #########################################
//###############################               #########################################
//#######################################################################################

//FUNCTIONS##############################################################################
//#######################################################################################
let apiKey = "AXZRvJ0jreBWRHyR70GN1GaADEpWHywa";
let page = 0;
var queryURL = "";
var topic = "";
var enteredValue = "";
var mostView = true;
var mostViewedURL = "";
function mostViewed() {
  mostViewedURL =
    "https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?&api-key=AXZRvJ0jreBWRHyR70GN1GaADEpWHywa&page=" +
    page +
    "&limit=5";
  $.ajax({
    url: mostViewedURL,
    method: "GET",
    dataType: "json" //Seems to workaround the CORS issue
  }).then(function(response) {
    console.log(mostViewedURL);
    if (response.symbol === "hey") {
      M.toast({
        html: "It appears that you entered an invalid ticker symbol."
      });
    } else {
      console.log(response.num_results);

      for (i = 0; i < response.results.length; i++) {
        console.log(response.results[i].title);
        $("#locationForCards").append(`
                <div id=${response.results[i].title} class="col s12 m6">
                    <!--Card start-->
                    <div class="card">
                        <div class="card-content" style='height: 300px; overflow: scroll'>
                            <span class="card-title">${
                              response.results[i].title
                            }</span>
                            <small>Published 
                                ${response.results[i].published_date}
                            </small>
                            <br/>
                            <br/>
                            <span>${
                              response.results[i].abstract
                            }  </span><a href=${
          response.results[i].url
        }>Read more.</a>
                        </div>
                        <div class="card-action">
                            <a id='${
                              response.results[i].title
                            }' class='cardDeleteButton'>Remove</a>
                        </div>
                    </div>
                    <!--Card end-->
                </div>
            `);
      }
      var user = firebase.auth().currentUser.uid;
      console.log(user);

      // database.ref(`/${user}/news/`).update({
      //     [response.name]: response.name
      // });
    }
  });
}

function newsSearch(searchTerm) {
  $("#pageUp").show();
  $("#pageDown").show();
  mostview = false;
  queryURL =
    "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
    searchTerm +
    "&api-key=" +
    apiKey +
    "&page=" +
    page +
    "&limit=5";
  $.ajax({
    url: queryURL,
    method: "GET",
    dataType: "json" //Seems to workaround the CORS issue
  }).then(function(response) {
    console.log(response);
    console.log(queryURL);
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
      var user = firebase.auth().currentUser.uid;
      console.log(user);

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
  topic = $("#searchTerm")
    .val()
    .toUpperCase();
  console.log(topic);
  newsSearch(topic);
  $("#queryNewsForm").trigger("reset");
});

$(document).on("submit", "#searchNewsForm", function() {
  mostView = false;
  page = 0;
  event.preventDefault();
  enteredValue = $("#newsToSearch")
    .val()
    .toUpperCase();
  newsSearch(enteredValue);
  $("#searchNewsForm").trigger("reset");
});

$(document).on("click", ".cardDeleteButton", function() {
  //     var user = firebase.auth().currentUser.uid;
  //     database.ref(`/${user}/news/${docID}`).remove()
  $(this)
    .parent()
    .parent()
    .parent()
    .fadeOut();
});

$(document).on("click", "#pageUp", function() {
  if (enteredValue !== "" && mostView === false) {
    if (page < 10) {
      event.preventDefault();
      page++;
      newsSearch(enteredValue);
    }
  }
});

$(document).on("click", "#pageDown", function() {
  if (page > 0 && mostView === false) {
    event.preventDefault();
    page = page - 1;
    newsSearch(enteredValue);
  }
});

$("#pageUp").hide();
$("#pageDown").hide();
mostViewed();
