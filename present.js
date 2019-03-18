$(document).ready(function() {
  //   $('[data-toggle="tooltip"]').tooltip();

  $("#doItGeocode").on("click", function() {
    let address = $("#startAddress")
      .val()
      .split(" ")
      .join("+");
    console.log(address);

    $("#form-input").hide();

    let qaddress = `address=${address}`;
    let googApiKey = `&key=AIzaSyCzZNcykfia8yZWraDJE98aLEGuNw3V4Ro`;
    let queryGeoUrl = `https://maps.googleapis.com/maps/api/geocode/json?${qaddress}${googApiKey}`;
    // the google geocode ajax call
    $.ajax({
      url: queryGeoUrl,
      method: "GET"
    }).then(function(response) {
      let startLatitude = response.results[0].geometry.location.lat;
      let startLongitude = response.results[0].geometry.location.lng;

      // yelp search radius input is in meters- we need some maths here...
      // Izzy says: I added this function to allow us to put in miles, since I do not think in meters
      let initialRadius = parseInt($("#radius").val());
      let searchRadius = Math.round(initialRadius / 0.00062137);
      let yelpApiKey =
        "iXz6CphpOprm4NkabLwuanwM8yIEQhqd2GYhVMHIep1SNAVRfRKKGl9N8DS7jXHxuOowfKm1kplvxQYV__DC74XDrxf-BshhyNj_j8_X0bpIgErelHgQTUvj6YaBXHYx";
      // i hope term=byob works for us!-some false positives >:^(
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
        let yelpObject = response;

        for (var i = 0; i < response.businesses.length; i++) {
          $("#results-div").append(`
            
        <div class="row display-row">
            <div class="col-4">
                <img class="smallImg" src="${response.businesses[i].image_url}">
            </div>
            <div class="col-8">
                <div class="row">
                    <div class="col">
                        <div class="row">
                            <h4>${response.businesses[i].name}</h4>
                            <br>
                            <h4>${response.businesses[i].location.address1}, ${
            response.businesses[i].location.city
          }</h4>

                        </div>
                        <div class="row">Phone No: ${
                          response.businesses[i].phone
                        }</div>
                        <div class="row">${
                          response.businesses[i].categories[0].title
                        }</div>

                    </div>
                </div>
                <div class="row">
                    <div class="col-6"><button class="directionsButton" id='id${i}'>Give me directions</button></div>
                    <div class="col-6"><button class="denialButton" id="notid${i}">Not BYOB? Click here.</button></div>
                </div>
            </div>
        </div>
    `);
        }

        $(document).on("click", ".directionsButton", function() {
          let buttonId = $(this).attr("id");
          console.log($(this));

          let index = $(this)
            .attr("id")
            .substr(2);
          console.log(index);

          let destinationLatitude =
            yelpObject.businesses[index].coordinates.latitude;
          let destinationLongitude =
            yelpObject.businesses[index].coordinates.longitude;
          // google directions ajax call
          let queryDirUrl = `https://www.google.com/maps/embed/v1/directions?origin=${startLatitude},${startLongitude}&destination=${destinationLatitude},${destinationLongitude}${googApiKey}`;

          $(`#modalMap`)
            .modal("toggle")
            .html(
              `<iframe width='600'  height='450'  frameborder='0' style='border:0'  src=${queryDirUrl} allowfullscreen></iframe>`
            );
        });
        $(document).on("click", ".denialButton", function() {
          let denialId = $(this).attr("id");
          console.log(denialId + "is not a BYOB");

          let denialIndex = $(this)
            .attr("id")
            .substr(5);
          console.log(yelpObject.businesses[denialIndex].name);
        });
      });
    });
  });
});
