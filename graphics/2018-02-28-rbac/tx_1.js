var cameraDistance = 0.6;

function render() {
  RBAC.translateTo(-4, 0);
  RBAC.role("role", { member: false });

  var elapsed = Date.now() - startTime;

  if ( elapsed >= 2000 ) {
    var options = {}
    if ( elapsed > 4000 ) {
      options.privilege = "privilege";
    }
    RBAC.translateTo(4, 0);
    RBAC.resource("resource", options);
    RBAC.popMove();
  }  
    
  RBAC.popMove();

  return elapsed <= 6000;
}
