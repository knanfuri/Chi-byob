<<<<<<< HEAD
$(document).ready(function () {

    $('[data-toggle="tooltip"]').tooltip();

    $("#doItGeocode").on("click", function () {
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
        }).then(function (response) {
            let latitude = response.results[0].geometry.location.lat;
            let longitude = response.results[0].geometry.location.lng;

            // yelp search radius input is in meters- we need some maths here...
            // Izzy says: I added this function to allow us to put in miles, since I do not think in meters
            let initialRadius = parseInt($("#radius").val());
            let searchRadius = Math.round(initialRadius / 0.00062137)
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
            }).then(function (response) {
                console.log(response);

                console.log(response.businesses[0].name);
                console.log(response.businesses[0].location.address1);
                console.log(response.businesses[0].location.city);

                console.log(response.businesses[0].phone);
                console.log(response.businesses[0].categories[0].title);



                var overTable = $("<table>");
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
                overTable.append(overHead);


                for (var i = 0; i < response.businesses.length; i++) {

                    var innerTr = $("<tr>");
                    var hiddenTr = $("<tr>");
                    // izzy says: if you hover over the name of the restaurant, the image pops up
                    // izzy says: for Ky - define the class I gave to the image, so that the image is smaller. 
                    var imageTd = $("<td>");
                    imageTd.text(response.businesses[i].name)
                        .attr("data-toggle", "tooltip")
                        .tooltip({
                            html: true,
                            title: "<img class='response-image' src=" + response.businesses[i].image_url + ">",

                        });
                    innerTr.append(imageTd);
                    innerTr.append($("<td>").text(response.businesses[i].location.address1));
                    innerTr.append($("<td>").text(response.businesses[i].location.city));
                    innerTr.append($("<td>").text(response.businesses[i].phone));
                    innerTr.append($("<td>").text(response.businesses[i].categories[0].title));
                    innerTr.append($("<td>").append($("<button>").text("give me directions").attr("id", `id${i}`)));
                    hiddenTr.text("test");
                    overBody.append(innerTr, hiddenTr);

                }
                $("#results-div").append(overHead, overBody);

=======
$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();

  $("#doItGeocode").on("click", function() {
    let address = $("#startAddress")
      .val()
      .split(" ")
      .join("+");

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
        var overTable = $("<table>");
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
        overTable.append(overHead);

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
                "<img class='response-image' src=" +
                response.businesses[i].image_url +
                ">"
>>>>>>> master
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
                .addClass("directionsButton")
            )
          );
          overBody.append(innerTr);
        }
        $("#results-div").append(overHead, overBody);
        // gets button clicks introduce
        $(document).on("click", ".directionsButton", function() {
          let buttonId = $(this).attr("id");
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

          $(`#${buttonId}`).append(
            `<iframe width='600'  height='450'  frameborder='0' style='border:0'  src=${queryDirUrl} allowfullscreen></iframe>`
          );
        });
      });
    });
  });
});
