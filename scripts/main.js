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
        if (settings.glow) {
            ctx.globalCompositeOperation = 'lighter';
        }
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




    // Event listeners
    canvas.addEventListener('mousemove', mousemove, false);

    document.getElementById('freq_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('freq_text').defaultValue = this.defaultValue = value;
        document.getElementById('freq_text').value        = hue.frequency     = value;
    }, false);

    document.getElementById('freq_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0.001 <= value) && (value <= 0.1)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('freq_slider').value = hue.frequency = value;
        document.getElementById('freq_text').value   = value;
    }, false);


    document.getElementById('amp_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('amp_text').defaultValue = this.defaultValue = value;
        document.getElementById('amp_text').value        = hue.amplitude     = value;
    }, false);

    document.getElementById('amp_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0 <= value) && (value <= 360)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('amp_slider').value = hue.amplitude = value;
        document.getElementById('amp_text').value   = value;
    }, false);

    document.getElementById('offset_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('offset_text').defaultValue = this.defaultValue = value;
        document.getElementById('offset_text').value        = hue.offset        = value;
    }, false);

    document.getElementById('offset_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0 <= value) && (value <= 360)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('offset_slider').value = hue.offset = value;
        document.getElementById('offset_text').value   = value;
    }, false);

    // Initial state
    hue = Oscillator.create(settings);
    target.x = canvas.width  / 2;
    target.y = canvas.height / 2;
    reset(settings);
    update();
    draw();

    /* ----------------------------------- */
});