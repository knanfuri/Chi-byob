$(document).ready(function() {
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
      let latitude = response.results[0].geometry.location.lat;
      let longitude = response.results[0].geometry.location.lng;
      $("#latLng")
        .append($("<p>").text(`latitude: ${latitude}`))
        .append($("<p>").text(`longitude: ${longitude}`));

      // yelp search radius input is in meters- we need some maths here...
      let searchRadius = $("#radius").val();
      let yelpApiKey =
        "iXz6CphpOprm4NkabLwuanwM8yIEQhqd2GYhVMHIep1SNAVRfRKKGl9N8DS7jXHxuOowfKm1kplvxQYV__DC74XDrxf-BshhyNj_j8_X0bpIgErelHgQTUvj6YaBXHYx";
      // i hope term=byob works for us!
      let queryYelpUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=byob&latitude=${latitude}&longitude=${longitude}&radius=${searchRadius}&api_key=${yelpApiKey}&open_now=true`;
      // the yelp ajax call
      //   we will need cors implementation
      $.ajax({
        url: queryYelpUrl,
        method: "GET"
      }).then(function(response) {
        console.log(response);
      });
    });
  });
});
