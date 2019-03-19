$(document).ready(function() {
  //set up database for yelp-emergency situation
  var config = {
    apiKey: "AIzaSyDl3XzwDijfsqFMchoEqe-rBCqVfgbggIs",
    authDomain: "nuchibootcamper.firebaseapp.com",
    databaseURL: "https://nuchibootcamper.firebaseio.com",
    projectId: "nuchibootcamper",
    storageBucket: "nuchibootcamper.appspot.com",
    messagingSenderId: "348555228882"
  };
  firebase.initializeApp(config);

  const dB = firebase.database();
  const yelpBackup = dB.ref("yelpBackup");
  // global flags
  let startLatitude;
  let startLongitude;
  let yelpObject;
  let googApiKey;

  // our first major component is geocoding to transform an address into latitude and longitude
  geocodeAddress();
  function geocodeAddress() {
    $("#doItGeocode").on("click", function() {
      let address = $("#startAddress")
        .val()
        .split(" ")
        .join("+");
      // console.log(address);

      $("#form-input").hide();
      $("#loading-icon").append(`<h1 class="ml1">
    <span class="text-wrapper">
        <span class="line line1"></span>
        <span class="letters">LOADING</span>
        <span class="line line2"></span>
      </span>
    </h1>`);

      $(".ml1 .letters").each(function() {
        $(this).html(
          $(this)
            .text()
            .replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>")
        );
      });

      anime
        .timeline({ loop: true })
        .add({
          targets: ".ml1 .letter",
          scale: [0.3, 1],
          opacity: [0, 1],
          translateZ: 0,
          easing: "easeOutExpo",
          duration: 600,
          delay: function(el, i) {
            return 70 * (i + 1);
          }
        })
        .add({
          targets: ".ml1 .line",
          scaleX: [0, 1],
          opacity: [0.5, 1],
          easing: "easeOutExpo",
          duration: 700,
          offset: "-=875",
          delay: function(el, i, l) {
            return 80 * (l - i);
          }
        })
        .add({
          targets: ".ml1",
          opacity: 0,
          duration: 1000,
          easing: "easeOutExpo",
          delay: 1000
        });
      // set up the google geocoding ajax call
      let qaddress = `address=${address}`;
      googApiKey = `&key=AIzaSyCzZNcykfia8yZWraDJE98aLEGuNw3V4Ro`;
      let queryGeoUrl = `https://maps.googleapis.com/maps/api/geocode/json?${qaddress}${googApiKey}`;
      // the google geocode ajax call
      $.ajax({
        url: queryGeoUrl,
        method: "GET"
      })
        .then(function(response) {
          startLatitude = response.results[0].geometry.location.lat;
          startLongitude = response.results[0].geometry.location.lng;
          doYelp();
        })
        .catch(function(err) {
          console.log("geocode error", err);
          startLatitude = 41.8957828;
          startLongitude = -87.6377203;
          doYelp();
        });
    });
  }
  // our second major component is getting a list of nearby byob restaurants from yelp
  function doYelp() {
    // yelp search radius input in miles..
    let initialRadius = parseInt($("#radius").val());
    let searchRadius = Math.round(initialRadius / 0.00062137);
    let yelpApiKey =
      "iXz6CphpOprm4NkabLwuanwM8yIEQhqd2GYhVMHIep1SNAVRfRKKGl9N8DS7jXHxuOowfKm1kplvxQYV__DC74XDrxf-BshhyNj_j8_X0bpIgErelHgQTUvj6YaBXHYx";
    // i hope term=byob works for us!-but we get some false positives
    let queryYelpUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=byob&latitude=${startLatitude}&longitude=${startLongitude}&radius=${searchRadius}&api_key=${yelpApiKey}&open_now=true`;
    //   we need cors implementation- thanks to TA Michael for the headerParams tip
    const headerParams = {
      Authorization:
        "bearer iXz6CphpOprm4NkabLwuanwM8yIEQhqd2GYhVMHIep1SNAVRfRKKGl9N8DS7jXHxuOowfKm1kplvxQYV__DC74XDrxf-BshhyNj_j8_X0bpIgErelHgQTUvj6YaBXHYx"
    };
    // the yelp ajax call
    $.ajax({
      url: queryYelpUrl,
      method: "GET",
      headers: headerParams
    })
      .then(function(response) {
        // the yelpObject and yelpBackup are for presentation contingency that we are having server side errors from yelp
        yelpObject = response;
        // only push to yelpBackup to save a search result in database
        // yelpBackup.push(yelpObject);
        renderYelp(response);
      })
      // This catches the potential yelp error and instead loads from our database of pre-searched yelp objects
      .catch(function(err) {
        console.log("yelp error", err);
        yelpBackup.orderByChild("businesses").on("child_added", function(snap) {
          let response = snap.val();
          yelpObject = response;

          renderYelp(response);
          console.log(snap.val());
        });
      });
    function renderYelp(response) {
      $("body").addClass("second");
      for (var i = 0; i < response.businesses.length; i++) {
        $("#loading-icon").hide();
        $("#results-div").append(`
      
      <div class="card mb-3" style="max-width: 800px;">
      <div class="row no-gutters">
          <div class="col-md-4">
              <img class="smallImg img-fluid" src="${
                response.businesses[i].image_url
              }">
          </div>
          <div class="col-md-8">
          <div class="card-body">
                  <div class="col">
                      <div class="row">
                          <h4 class="card-title">${
                            response.businesses[i].name
                          }</h4>
                          </div>
                          
                          <div class="row">
                          <div class="card-text">${
                            response.businesses[i].location.address1
                          }, ${response.businesses[i].location.city}</div>

                      </div>
                      <div class="row">Phone No: ${
                        response.businesses[i].phone
                      }</div>
                      <div class="row food-type">${
                        response.businesses[i].categories[0].title
                      }</div>
                      <div class="row">

                      <div class="col-6"><button class="directionsButton inside btn btn-dark" id='id${i}' data-toggle="modal" data-target="#myModal">Give me directions</button></div>
                      <div class="col-6"><button class="inside btn btn-dark denialButton" id='notid${i}'>Not BYOB? Click here.</button></div>
                  </div>
                  </div>
              </div>
          
              </div>
          </div>
      </div>
      </div>
  `);
      }
    }
  }

  // handles the directions buttons
  $(document).on("click", ".directionsButton", function() {
    let buttonId = $(this).attr("id");
    console.log($(this));

    let index = $(this)
      .attr("id")
      .substr(2);
    console.log(index);

    let destinationLatitude = yelpObject.businesses[index].coordinates.latitude;
    let destinationLongitude =
      yelpObject.businesses[index].coordinates.longitude;
    // google directions ajax call
    let queryDirUrl = `https://www.google.com/maps/embed/v1/directions?origin=${startLatitude},${startLongitude}&destination=${destinationLatitude},${destinationLongitude}${googApiKey}`;
    $(".location-map").html(
      `<iframe width='760'  height='450'  frameborder='0' style='border:0'  src=${queryDirUrl} allowfullscreen></iframe>`
    );
    $("#myModalLabel").text(
      `Directions to ${yelpObject.businesses[index].name}`
    );
  });

  // Handle the denial buttons
  $(document).on("click", ".denialButton", function() {
    let denialId = $(this).attr("id");
    console.log(denialId + "is not a BYOB");

    let denialIndex = $(this)
      .attr("id")
      .substr(5);
    console.log(yelpObject.businesses[denialIndex].name);
  });
});
