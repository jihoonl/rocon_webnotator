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

  this.rootObject.addEventListener('mousedown',function(event) {
    // convert to ROS coordinates
    var pose = getPose(event);
    var mouse_ondrag = false;

    event.onMouseMove = function(move_event) {
      var move_pose = getPose(event);

      mouse_ondrag = true;
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
