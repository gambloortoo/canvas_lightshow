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
            threads[i].update();
        }

        window.setTimeout(update, 1000 / 60);
    }

    function draw() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = "black";
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
            threads[i].draw(ctx);
        }

        window.requestAnimFrame(draw);
    }

    function reset(options) {
        threads = [];

        for (var i = 0; i < options.trails; ++i) {
            threads.push(Thread.create({
                spring    : options.spring + 0.025 * (i / options.trails),
                tension   : options.tension,
                friction  : options.friction + 0.4,
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


    // ------ Event listeners ------
    canvas.addEventListener('mousemove', mousemove, false);

    function controlToggle() {
        $(this).siblings('div').toggle();
    }
    $('fieldset.ctrl_fieldset legend').on('click', controlToggle);

    // Color Events
    document.getElementById('sat_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('sat_text').defaultValue = this.defaultValue   = value;
        document.getElementById('sat_text').value        = settings.saturation = value;
    }, false);

    document.getElementById('sat_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0 <= value) && (value <= 100)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('sat_slider').value = settings.saturation = value;
        document.getElementById('sat_text').value   = value;
    }, false);

    document.getElementById('light_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('light_text').defaultValue = this.defaultValue  = value;
        document.getElementById('light_text').value        = settings.lightness = value;
    }, false);

    document.getElementById('light_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0 <= value) && (value <= 100)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('light_slider').value = settings.lightness = value;
        document.getElementById('light_text').value   = value;
    }, false);

    document.getElementById('alpha_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('alpha_text').defaultValue = this.defaultValue  = value;
        document.getElementById('alpha_text').value        = settings.alpha     = value;
    }, false);

    document.getElementById('alpha_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0 <= value) && (value <= 1)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('alpha_slider').value = settings.alpha = value;
        document.getElementById('alpha_text').value   = value;
    }, false);


    // Oscillator Events
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
        if (typeof value === "number" && (1 <= value) && (value <= 100)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('offset_slider').value = hue.offset = value;
        document.getElementById('offset_text').value   = value;
    }, false);

    // Thread Events
    // Trail
    document.getElementById('trail_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('trail_text').defaultValue = this.defaultValue = value;
        document.getElementById('trail_text').value        = settings.trails   = value;
        reset(settings);
    }, false);

    document.getElementById('trail_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (1 <= value) && (value <= 50)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('trail_slider').value = settings.trails = value;
        document.getElementById('trail_text').value   = value;
        reset(settings);
    }, false);

    // Length
    document.getElementById('length_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('length_text').defaultValue = this.defaultValue = value;
        document.getElementById('length_text').value        = settings.size     = value;
        reset(settings);
    }, false);

    document.getElementById('length_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (3 <= value) && (value <= 100)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('length_slider').value = settings.size = value;
        document.getElementById('length_text').value   = value;
        reset(settings);
    }, false);

    // Physics Events
    // Spring
    document.getElementById('spring_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('spring_text').defaultValue = this.defaultValue = value;
        document.getElementById('spring_text').value        = settings.spring   = value;
        reset(settings);
    }, false);

    document.getElementById('spring_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0.1 <= value) && (value <= 1.0)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('spring_slider').value = settings.spring = value;
        document.getElementById('spring_text').value   = value;
        reset(settings);
    }, false);

    // Friction
    document.getElementById('friction_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('friction_text').defaultValue = this.defaultValue = value;
        document.getElementById('friction_text').value        = settings.friction = value;
        reset(settings);
    }, false);

    document.getElementById('friction_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0 <= value) && (value <= 0.2)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('friction_slider').value = settings.friction = value;
        document.getElementById('friction_text').value   = value;
        reset(settings);
    }, false);

    // Tension
    document.getElementById('tension_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('tension_text').defaultValue = this.defaultValue = value;
        document.getElementById('tension_text').value        = settings.tension = value;
        reset(settings);
    }, false);

    document.getElementById('tension_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0.01 <= value) && (value <= 1.0)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('tension_slider').value = settings.tension = value;
        document.getElementById('tension_text').value   = value;
        reset(settings);
    }, false);

    // Dampening
    document.getElementById('damp_slider').addEventListener('change', function() {
        var value = Number(this.value);
        document.getElementById('damp_text').defaultValue = this.defaultValue = value;
        document.getElementById('damp_text').value        = settings.dampening = value;
        reset(settings);
    }, false);

    document.getElementById('damp_text').addEventListener('change', function() {
        var value = Number(this.value);
        if (typeof value === "number" && (0.01 <= value) && (value <= 1.0)) {
            this.defaultValue = value;
        } else {
            value = Number(this.defaultValue);
        }
        document.getElementById('damp_slider').value = settings.dampening = value;
        document.getElementById('damp_text').value   = value;
        reset(settings);
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