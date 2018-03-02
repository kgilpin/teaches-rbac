var roleMemberhips = {
  "Alice": [ "engineering" ],
  "Bob": [ "operations" ],
  "Carol": [ "operations", "support" ],
  "engineering": [ "employees" ],
  "operations": [ "employees" ],
  "support": [ "employees" ],
  "employees": [],
}

function render() {
  {
    RBAC.translateTo(-3);
    RBAC.role("Alice", { member: false });
    
    {
      RBAC.translateTo(0, -3);
      RBAC.role("engineering");
      {
        RBAC.translateTo(3, -3);
        RBAC.roleMember();
        RBAC.popMove();
      }
      RBAC.popMove();
    }  
    
    {
      RBAC.translateTo(3, -3);
      RBAC.role("operations", { member: false });
      {
        RBAC.translateTo(0, -3);
        RBAC.role("employees");

        {
          RBAC.translateTo(5, 0);
          RBAC.resource("door", { privilege: "open" });
          RBAC.popMove();
        }
          
        RBAC.popMove();
      }  
      RBAC.popMove();
    }
    
    RBAC.popMove();
  }
  
  {
    RBAC.translateTo(0);
    RBAC.role("Bob", { member: false });
    
    {
      RBAC.translateTo(0, -3);
      RBAC.roleMember();
      RBAC.popMove();
    }
    
    RBAC.popMove();
  }
  
  {
    RBAC.translateTo(3);
    RBAC.role("Carol", { member: false });
    
    {
      RBAC.translateTo(-3, -3);
      RBAC.roleMember();
      RBAC.popMove();
    }
    
    {
      RBAC.translateTo(0, -3);
      RBAC.role("support");
      {
        RBAC.translateTo(-3, -3);
        RBAC.roleMember();
        RBAC.popMove();
      }
      RBAC.popMove();
    }
    
    RBAC.popMove();
  }
}

function findRole(roleName) {
  for ( var i = 0; i < RBAC.runtime.scene.children.length; i++ ) {
    var child = RBAC.runtime.scene.children[i];
    if ( child.rbac && child.rbac.label == roleName ) {
      return child;
    }
  }
  return null;
}

function highlightRole(roleName, point) {
  object = findRole(roleName);
  object.material.color.set(RBAC.colors.roleHighlight);
  object.rbac.intersect = point;

  roleMemberhips[roleName].forEach(r => {
    highlightRole(r, point);
  });
}

function trackMouse() {
  var scene = RBAC.runtime.scene;
  
  if ( mouse ) {
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, RBAC.runtime.camera );
    
    var intersects = raycaster.intersectObjects(scene.children);
    for ( var i = 0; i < scene.children.length; i++ ) {
      var child = scene.children[i];
      if ( child.rbac && child.rbac.intersect ) {
        child.rbac.intersect = null;
      }
    }
    for ( var i = 0; i < intersects.length; i++ ) {
      var intersect = intersects[i];
      if ( intersect.object.rbac && intersect.object.rbac.label ) {
        highlightRole(intersect.object.rbac.label, intersect.point);
      }
    }  
    for ( var i = 0; i < scene.children.length; i++ ) {
      var child = scene.children[i];
      if ( child.rbac && child.rbac.intersect === null && !child.material.color.equals(new THREE.Color(RBAC.colors.role)) ) {
        child.material.color.set(RBAC.colors.role);
      }
    }
    RBAC.runtime.renderer.render(RBAC.runtime.scene, RBAC.runtime.camera);
  }
  setTimeout(() => { requestAnimationFrame(trackMouse) }, 50);
}

function animate() {
  render();
  RBAC.runtime.renderer.render(RBAC.runtime.scene, RBAC.runtime.camera);
  setTimeout(() => { requestAnimationFrame(trackMouse) }, 1000);
}

var renderer;
var raycaster;
var mouse;

window.onload = function() {
  RBAC.initialize(() => {
    RBAC.translateTo(1, -3.25, 0)
    RBAC.viewpoint("home", RBAC.scale, 0, RBAC.scale * 6.5);
    RBAC.lookNow("home");
    RBAC.popMove();
    
    raycaster = new THREE.Raycaster();
    
    function onMouseMove( event ) {
      if ( !mouse ) {
        mouse = new THREE.Vector2();
      }
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
    
    window.addEventListener( 'mousemove', onMouseMove, false );
    
    requestAnimationFrame(animate);
  });
};
