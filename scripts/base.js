
////////////////////////////////////////////////////////////////////////////////
//   Classical OOP Pattern
//
////////////////////////////////////////////////////////////////////////////////

function defclass(prototype) {
  var constructor = prototype.constructor;
  var instance = prototype.instance = function() {};
  constructor.prototype = instance.prototype = prototype;
  return constructor;
}

function extend(parent, keys) {
  var supertype = keys.parent = parent.prototype;
  var prototype = new supertype.instance;
  for (var key in keys) prototype[key] = keys[key];
  return defclass(prototype);
}

/* Classical Example:

var Bird = defclass({
  constructor: function(type, flightless) {
    this.type = type;
    this.flightless = flightless;
  },
  describe: function() {
    if (this.flightless)
      alert(this.type + " can't fly.");
    else alert(this.type + " can fly.");
  }
});

var Penguin = extend(Bird, {
  constructor: function(name) {
    this.parent.constructor.call(this, "Penguins", true);
    this.name = name;
  },
  describe: function() {
    alert(this.name + " is a Penguin.");
    this.parent.describe.call(this);
    alert("However they can swim.");
  }
});

var tux = new Penguin("Tux");

*/


////////////////////////////////////////////////////////////////////////////////
//   Prototypal OOP Pattern
//
////////////////////////////////////////////////////////////////////////////////

function baseType(prototype) {
  var instance = prototype.instance = function() {};
  instance.prototype = prototype;
  return prototype;
}

var Base = baseType({
  create: function() {
    var instance = new this.instance;
    this.init.apply(instance, arguments);
    return instance;
  },
  extend: function(keys) {
    var parent = keys.parent = this;
    var prototype = new parent.instance;
    for (var key in keys) prototype[key] = keys[key];
    return baseType(prototype);
  }
});

/* Prototypal Example

var bird = object.extend({
  init: function(type, flightless) {
    this.type = type;
    this.flightless = flightless;
  },
  describe: function() {
    if (this.flightless)
      alert(this.type + " can't fly.");
    else alert(this.type + " can fly.");
  }
});

var penguin = bird.extend({
  init: function(name) {
    this.parent.init.call(this, "Penguins", true);
    this.name = name;
  },
  describe: function() {
    alert(this.name + " is a Penguin.");
    this.parent.describe.call(this);
    alert("However they can swim.");
  }
});

var tux = penguin.create("Tux");

*/