$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();

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
      let latitude = response.results[0].geometry.location.lat;
      let longitude = response.results[0].geometry.location.lng;

      // yelp search radius input is in meters- we need some maths here...
      // Izzy says: I added this function to allow us to put in miles, since I do not think in meters
      let initialRadius = parseInt($("#radius").val());
      let searchRadius = Math.round(initialRadius / 0.00062137);
      // let searchRadius = parseInt($("#radius").val());

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

        console.log(response.businesses[0].name);
        console.log(response.businesses[0].location.address1);
        console.log(response.businesses[0].location.city);

        console.log(response.businesses[0].phone);
        console.log(response.businesses[0].categories[0].title);

        // var overTable = $("<table>");
        // overTable.addClass("table");
        var overHead = $("<thead>");
        var overTr = $("<tr>");
        var overBody = $("<tbody>");

        overTr.append($("<th>").text("Name"));
        overTr.append($("<th>").text("Address"));
        overTr.append($("<th>").text("City"));
        overTr.append($("<th>").text("Phone No."));
        overTr.append($("<th>").text("Cuisine"));
        overTr.append($("<th>"));
        overHead.append(overTr);
        // overTable.append(overHead);

        for (var i = 0; i < response.businesses.length; i++) {
          var innerTr = $("<tr>");

          // izzy says: if you hover over the name of the restaurant, the image pops up
          // izzy says: for Ky - define the class I gave to the image, so that the image is smaller.
          var imageTd = $("<td>");
          imageTd
            .text(response.businesses[i].name)
            .attr("data-toggle", "tooltip")
            .tooltip({
              html: true,
              title:
                "<img class='img-thumbnail' src=" +
                response.businesses[i].image_url +
                ">"
            });
          innerTr.append(imageTd);
          innerTr.append(
            $("<td>").text(response.businesses[i].location.address1)
          );
          innerTr.append($("<td>").text(response.businesses[i].location.city));
          innerTr.append($("<td>").text(response.businesses[i].phone));
          innerTr.append(
            $("<td>").text(response.businesses[i].categories[0].title)
          );
          innerTr.append(
            $("<td>").append(
              $("<button>")
                .text("give me directions")
                .attr("id", `id${i}`)
                .addClass("btn btn-outline-light btn-sm")
            )
          );
          overBody.append(innerTr);
        }
        $("#results-div").append(overHead, overBody);
      });
    });
  });
});
