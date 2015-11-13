$(document).ready(function () {
    // Set up canvas and ratio
    var canvas    = document.getElementById("canvas");
    var ctx       = canvas.getContext('2d');
    var container = $(canvas).parent();
    var ratio     = canvas.width / canvas.height;

    // Run function when browser resizes
    $(window).resize(respondCanvas);

    function respondCanvas() {
        canvas.width  = $(container).width();
        canvas.height = $(container).width() / ratio;
    }

    // Initial call
    respondCanvas();

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame 
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || function (fn) { window.setTimeout(fn, 1000 / 60) };
    })();

    /* ---------- Program Logic ---------- */

    function update() {
        for (var i = 0; i < settings.trails; ++i) {
            tendrils[i].update();
        }

        window.setTimeout(update, 1000 / 60);
    }

    function draw() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(8, 5, 16, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'hsla(' + Math.round(hue.update()) + ',' 
                                  + settings.saturation      + '%,' 
                                  + settings.lightness       + '%,'
                                  + settings.alpha + ')';
        ctx.lineWidth = 2;

        for (var i = 0; i < settings.trails; ++i) {
            tendrils[i].draw(ctx);
        }

        window.requestAnimFrame(draw);
    }

    function reset(options) {
        tendrils = [];

        for (var i = 0; i < options.trails; ++i) {
            tendrils.push(Tendril.create({
                spring    : options.spring + 0.025 * (i / options.trails),
                tension   : options.tension,
                friction  : options.friction,
                dampening : options.dampening,
                size      : options.size,
            }));
        }
    }

    function mousemove(event) {
        var rect = canvas.getBoundingClientRect();
        target.x = (event.clientX - rect.left);// / (rect.right  - rect.left) * canvas.width;
        target.y = (event.clientY - rect.top );// / (rect.bottom - rect.top ) * canvas.height;
    }


    hue = Oscillator.create(settings);

    canvas.addEventListener('mousemove', mousemove, false);
    target.x = canvas.width  / 2;
    target.y = canvas.height / 2;
    reset(settings);
    update();
    draw();

    /* ----------------------------------- */
});