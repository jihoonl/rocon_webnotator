/*
   Jihoon Lee

   Circle Visualizor
 */

REGIONVIZ.Circle = function(options) {
  var that = this;

  options = options || {};
  that.rootObject = options.rootObject;
  var map_origin = options.map_origin;
  that.instance_tags = options.instance_tags;
  that.color = "blue";
  that.worldlib = options.worldlib || new Worldlib({ ros: options.ros});
  that.circles = {};
  that.new_circles = {};

  var stage;
  if (that.rootObject instanceof createjs.Stage) {
    stage = that.rootObject;
  } else {
    stage = that.rootObject.getStage();
  }

  var createCircle = function(x,y,radius) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill(that.color).drawCircle(0,0,radius);
    circle.x = x;
    circle.y = y;

    return circle;
  }

  var updates = function() {
    that.worldlib.worldObjectInstanceTagSearch(that.instance_tags,
      function(instances)
      {
        for(var i in instances) {
          
          var func = new ParseDescription(instances[i]);

          that.worldlib.getWorldObjectDescription(instances[i].description_id,func.parse);
        }
      }
    );
  }

  var ParseDescription = function(instance) {
    var parse_desc = this;
    this.instance = instance;

    this.parse = function(description) {
      var instance = parse_desc.instance;
      var region = JSON.parse(description.descriptors[0].data);
      var radius = region['radius'];
      var xy = stage.rosToGlobal(instance.pose.pose.pose.position.x, instance.pose.pose.pose.position.y);
      var x = instance.pose.pose.pose.position.x;
      var y = instance.pose.pose.pose.position.y;
       
      that.new_circles[instance.instance_id] = createCircle(x,y,radius);
    }
  }

  var cleanup = function() {
    console.log(that.circles);
    for(var c in that.circles)
    {
      that.rootObject.removeChild(that.circles[c]);
    }
    for(var c in that.new_circles)
    {
      that.new_circles[c].x = that.new_circles[c].x  - map_origin.position.x;
      that.new_circles[c].y = -(that.new_circles[c].y - map_origin.position.y);
      that.new_circles[c].rotation = stage.rosQuaternionToGlobalTheta({x:0,y:0,z:0,w:1});

      that.rootObject.addChild(that.new_circles[c]);
    }
    that.circles = that.new_circles;
    that.new_circles = {};
  }

  window.setInterval(updates,1000);
  window.setInterval(cleanup,1000);
};
