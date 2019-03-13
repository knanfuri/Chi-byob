$(document).ready(function() {
  $("#doItGeocode").on("click", function() {
    let address = $("#startAddress")
      .val()
      .split(" ")
      .join("+");
    console.log(address);

    let qaddress = `address=${address}`;
    let myApiKey = `&key=AIzaSyCzZNcykfia8yZWraDJE98aLEGuNw3V4Ro`;
    let queryUrl = `https://maps.googleapis.com/maps/api/geocode/json?${qaddress}${myApiKey}`;
    console.log(queryUrl);
    //   });
    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then(function(response) {
      let latitude = response.results[0].geometry.location.lat;
      let longitude = response.results[0].geometry.location.lng;
      $("#latLng")
        .append($("<p>").text(`latitude: ${latitude}`))
        .append($("<p>").text(`longitude: ${longitude}`));
    });
  });
});
