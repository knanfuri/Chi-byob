$(document).ready(function () {

    $("#hover-element").hover(
        function () {
            $(this).append($("<img>").attr("src", "https://66.media.tumblr.com/35c7436e5dc3ec83c58d3f0b0656e7a7/tumblr_po86srMgbe1qjs67jo1_1280.png"));

        },
        function () {
            $(this).find("img:last").remove();
        }
    )



})