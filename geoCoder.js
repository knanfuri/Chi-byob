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
      let searchRadius = parseInt($("#radius").val());
      console.log(searchRadius);
      let yelpApiKey =
        "iXz6CphpOprm4NkabLwuanwM8yIEQhqd2GYhVMHIep1SNAVRfRKKGl9N8DS7jXHxuOowfKm1kplvxQYV__DC74XDrxf-BshhyNj_j8_X0bpIgErelHgQTUvj6YaBXHYx";
      // i hope term=byob works for us!
      let queryYelpUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=byob&latitude=${latitude}&longitude=${longitude}&radius=${searchRadius}&api_key=${yelpApiKey}&open_now=true`;
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
      });
    });
  });
});
// suggestions for Izzy dynamic html generation
// firstPlace.append($("<p>").text(xxx.name));
// firstPlace.append($("<p>").text(xxx.date));
// firstPlace.append($("<p>").text(xxx.address));
// firstPlace.append($("<p>").text(xxx.name));
// firstPlace.append($("<p>").text(xxx.name));
// firstPlace.append(
//   $("<button>")
//     .text("give me directions")
//     .attr("id", `id${i}`)
// );

// $("#location").append(firstPlace);

fi;
