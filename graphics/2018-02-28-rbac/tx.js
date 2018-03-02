function animate() {
  var done = !render();
  RBAC.runtime.renderer.render( RBAC.runtime.scene, RBAC.runtime.camera );
  if ( done ) {
    window.clearInterval(intervalId)
  }
}

var startTime = Date.now();
var intervalId;

window.onload = function() {
  RBAC.initialize(() => {
    RBAC.translateTo(-6 * RBAC.scale, 0, 0)
    RBAC.viewpoint("home", 0, 0, 4 * RBAC.scale * cameraDistance);
    RBAC.lookNow("home");
    RBAC.popMove();
      
    requestAnimationFrame(animate);
    intervalId = setInterval( function () {
      if ( !document.webkitHidden )
        requestAnimationFrame(animate);
    }, 1000 / 4 );
  });
}
