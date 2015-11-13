var hue,
    target   = {},
    tendrils = [];

var settings = {
    // Colors
    saturation : 90,
    lightness  : 50,
    alpha      : 0.5,

    // Oscillator
    phase     : 0,
    offset    : 128,
    frequency : 0.05,
    amplitude : 128,

    // Tendril
    spring    : 0.45,
    tension   : 0.98,
    friction  : 0.5,
    dampening : 0.25,
    trails    : 10,
    size      : 60,
};

var Oscillator = Base.extend({
    init : function (options) {
        this.phase     = options.phase     || 0;
        this.offset    = options.offset    || 128;
        this.frequency = options.frequency || 0.001;
        this.amplitude = options.amplitude || 128;
        this.value     = 0;
    },
    update : function () {
        this.phase += this.frequency; // Clamp?
        value = this.offset + Math.sin(this.phase) * this.amplitude;
        return value;
    },
});

var Tendril = Base.extend({
    init : function (options) {
        this.spring    = options.spring   + (Math.random() * 0.1 ) - 0.05;
        this.friction  = options.friction + (Math.random() * 0.01) - 0.005;
        this.tension   = options.tension
        this.dampening = options.dampening;
        this.nodes     = [];

        for (var i = 0; i < options.size; ++i) {
            var node = this.createNode(target.x, target.y);
            this.nodes.push(node);
        }
    },
    update : function () {
        var spring = this.spring;
        var node   = this.nodes[0];
        // console.log(node);
        node.vx += (target.x - node.x) * spring;
        node.vy += (target.y - node.y) * spring;

        for (var i = 0; i < this.nodes.length; ++i) {
            node = this.nodes[i];
            if (i > 0) {
                var prev = this.nodes[i - 1];
                node.vx += (prev.x - node.x) * spring;
                node.vy += (prev.y - node.y) * spring;
                node.vx += prev.vx * this.dampening;
                node.vy += prev.vy * this.dampening;
            }
            node.vx *= this.friction;
            node.vy *= this.friction;
            node.x  += node.vx;
            node.y  += node.vy;
            spring  *= this.tension;
        }

    },
    draw : function (ctx) {
        var x = this.nodes[0].x;
        var y = this.nodes[0].y;
        var a, b;
        ctx.beginPath();
        ctx.moveTo(x, y);

        for (var i = 1; i < this.nodes.length - 2; ++i) {
            a = this.nodes[i];
            b = this.nodes[i + 1];
            x = (a.x + b.x) * 0.5;
            y = (a.y + b.y) * 0.5;
            ctx.quadraticCurveTo(a.x, a.y, x, y);
        }

        a = this.nodes[i];
        b = this.nodes[i + 1];
        ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
        ctx.stroke();
        ctx.closePath();
    },
    createNode : function (x, y) {
        return {
            x  : x,
            y  : y,
            vx : 0,
            vy : 0
        };
    },
});