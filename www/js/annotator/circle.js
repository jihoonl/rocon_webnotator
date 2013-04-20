/*
   Jihoon Lee

  Circle Annotator 
  - OccupancyGridClient
  - Annotator

 */

ANNOTATOR.Circle= function(options) {
  var that = this;
  var ros = options.ros;
  var map_origin = options.map_origin;
  this.rootObject = options.rootObject || new createjs.Container();


  var stage;
  if (that.rootObject instanceof createjs.Stage) {
    stage = that.rootObject;
  } else {
    stage = that.rootObject.getStage();
  }

  var getPose = function(event) {
    var coords = stage.globalToRos(event.stageX,event.stageY);
    var pose = new ROSLIB.Pose({
        position : new ROSLIB.Vector3(coords)
      });

    pose.position.x = pose.position.x + map_origin.position.x;
    pose.position.y = pose.position.y + map_origin.position.y;

    return pose;
  }

  var createCircle = function(x,y,radius) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0,0,radius);
    circle.x = x;
    circle.y = y;

    return circle;
  }

  this.rootObject.addEventListener('mousedown',function(event) {
    // convert to ROS coordinates
    var pose = getPose(event);
    var mouse_ondrag = false;
    var circle;

    event.onMouseMove = function(move_event) {
      var move_pose = getPose(move_event);

      move_pose.position.subtract(pose.position);
      var mag = Math.sqrt(move_pose.position.x * move_pose.position.x  + move_pose.position.y * move_pose.position.y);

      if(mouse_ondrag) {
        circle.graphics.beginFill("red").drawCircle(0,0,mag);
        circle.x = pose.position.x - map_origin.position.x;
        circle.y = -(pose.position.y - map_origin.position.y);
      }
      else {
        var x = pose.position.x - map_origin.position.x;
        var y = -(pose.position.y - map_origin.position.y);
        circle = createCircle(x,y,mag);
        mouse_ondrag = true;
        that.rootObject.addChild(circle);
      }
      console.log('move');

    }
    event.onMouseUp = function(up_event) {

      if(mouse_ondrag) {
        console.log('up');
      }
    }


  });


  this.rootObject.addEventListener('mouseup',function(event) {
  });
}
