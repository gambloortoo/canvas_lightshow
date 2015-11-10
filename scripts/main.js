$(document).ready(function () {
    // Set up canvas and ratio
    var canvas    = document.getElementById("canvas");
    var ctx       = canvas.getContext('2d');
    var container = $(canvas).parent();
    var ratio     = canvas.width / canvas.height;

    // Run function when browser resizes
    $(window).resize(respondCanvas);

    function respondCanvas() {
        // c.attr("width",  $(container).width()); // max width
        // c.attr("height", $(container).width() / ratio);         // max height
        canvas.width  = $(container).width();
        canvas.height = $(container).width() / ratio;
    }

    // Initial call
    respondCanvas();

    /* ---------- Program Logic ---------- */

    function update() {

        setTimeout(update, 1000 / 60);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        window.requestAnimationFrame(draw);
    }

    update();
    draw();

    /* ----------------------------------- */
});