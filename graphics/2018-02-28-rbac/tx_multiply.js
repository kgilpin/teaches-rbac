var loop_max = 0;

function render() {
  var i = loop_max % 12;

  if ( i === 0 ) {
    RBAC.translateTo(0, 0, 1);
    RBAC.role(null, { member: false });
  }

  var x = Math.cos(i / 12.0 * 2 * Math.PI);
  var y = Math.sin(i / 12.0 * 2 * Math.PI);

  RBAC.translateTo(x * 5, y * 5, -Math.round(loop_max / 12) + 6);
  RBAC.resource(null, { privilege: true });
  RBAC.popMove();

  loop_max += 1;
  return loop_max < 12 * 12;
}

function animate() {
  var done = !render();
  RBAC.runtime.renderer.render( RBAC.runtime.scene, RBAC.runtime.camera );
  if ( !done ) {
    requestAnimationFrame(animate);
  }
}

var startTime = Date.now();
var intervalId;

window.onload = function() {
  RBAC.initialize(() => {
    RBAC.translateTo(-3, 1, 0)
    RBAC.viewpoint("home", .5, .5, 4 * RBAC.scale * 1.75);
    RBAC.lookNow("home");
    RBAC.popMove();

    RBAC.translateTo(-4, 0, -8);

    requestAnimationFrame(animate);
  });
}
