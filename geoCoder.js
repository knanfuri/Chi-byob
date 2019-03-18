$(document).ready(function() {
  let startLatitude;
  let startLongitude;

  $("#doItGeocode").on("click", function() {
    let address = $("#startAddress")
      .val()
      .split(" ")
      .join("+");
    console.log(address);

    let qaddress = `address=${address}`;
    let googApiKey = `&key=AIzaSyCzZNcykfia8yZWraDJE98aLEGuNw3V4Ro`;
    let queryGeoUrl = `https://maps.googleapis.com/maps/api/geocode/json?${qaddress}${googApiKey}`;
    // the google geocode ajax call
    $.ajax({
      url: queryGeoUrl,
      method: "GET"
    }).then(function(response) {
      startLatitude = response.results[0].geometry.location.lat;
      startLongitude = response.results[0].geometry.location.lng;
      $("#latLng")
        .append($("<p>").text(`latitude: ${startLatitude}`))
        .append($("<p>").text(`longitude: ${startLongitude}`));

      // yelp search radius input is in meters- we need some maths here...I think izzy took care of it
      let searchRadius = parseInt($("#radius").val());
      console.log(searchRadius);
      let yelpApiKey =
        "iXz6CphpOprm4NkabLwuanwM8yIEQhqd2GYhVMHIep1SNAVRfRKKGl9N8DS7jXHxuOowfKm1kplvxQYV__DC74XDrxf-BshhyNj_j8_X0bpIgErelHgQTUvj6YaBXHYx";
      // i hope term=byob works for us!
      let queryYelpUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=byob&latitude=${startLatitude}&longitude=${startLongitude}&radius=${searchRadius}&api_key=${yelpApiKey}&open_now=true`;
      //   we will need cors implementation- thanks to TA Michael for the headerParams tip
      const headerParams = {
        Authorization:
          "bearer iXz6CphpOprm4NkabLwuanwM8yIEQhqd2GYhVMHIep1SNAVRfRKKGl9N8DS7jXHxuOowfKm1kplvxQYV__DC74XDrxf-BshhyNj_j8_X0bpIgErelHgQTUvj6YaBXHYx"
      };
      // the yelp ajax call
      $.ajax({
        url: queryYelpUrl,
        method: "GET",
        headers: headerParams
      }).then(function(response) {
        console.log(response);
        // this part will need to be replaced by a selection mechanism rather than just giving directions for the first response,
        // or a loop if we want to include all the
        let destinationLatitude = response.businesses[0].coordinates.latitude;
        let destinationLongitude = response.businesses[0].coordinates.longitude;
        console.log(destinationLatitude);
        console.log(destinationLongitude);

        // google directions ajax call
        let queryDirUrl = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=${startLatitude},${startLongitude}&destination=${destinationLatitude},${destinationLongitude}${googApiKey}`;

        $.ajax({
          url: queryDirUrl,
          method: "GET"
        }).then(function(response) {
          console.log(response);
        });
      });
    });
  });
});
