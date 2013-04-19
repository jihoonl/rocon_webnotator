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
    console.log(pose);
  });

  this.rootObject.addEventListener('mousemove',function(event) {
    var pose = getPose(event);
    console.log('move',pose);
  });

  this.rootObject.addEventListener('mouseup',function(event) {
    var pose = getPose(event);
    console.log('up',pose);
  });
}
