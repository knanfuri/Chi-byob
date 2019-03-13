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
  });
});
// $.ajax({
//   url: queryURL,
//   method: "GET"
// }).then(function(response) {
//   console.log(response);
// });
// })
