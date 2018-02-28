var RBAC = {}

RBAC.scale = 0.25;
RBAC.yunit = new THREE.Vector3(0, 1, 0);
RBAC.dimensions = {
  role: {
    radius: 1,
    thickness: 0.20
  },
  resource: {
    width: 1.5,
    height: 1.5,
    thickness: 0.20
  },
  member_arrow: {
    radius: 0.1
  }
}
RBAC.colors = {
  role: 0x00ff00,
  resource: 0xff0000,
  member: 0x0000ff,
}

RBAC.reconfigure = function() {
  RBAC.roleGeometry = new THREE.CylinderGeometry(RBAC.scale * RBAC.dimensions.role.radius, 
    RBAC.scale * RBAC.dimensions.role.radius,
    RBAC.scale * RBAC.dimensions.role.thickness,
    100);
  RBAC.roleMaterial = new THREE.MeshStandardMaterial( { metalness: 0, roughness: 0.5, color: RBAC.colors.role } );
  
  RBAC.resourceGeometry = new THREE.BoxGeometry(RBAC.scale * RBAC.dimensions.resource.width, 
    RBAC.scale * RBAC.dimensions.resource.thickness, 
    RBAC.scale * RBAC.dimensions.resource.height, 
    100);
  RBAC.resourceMaterial = new THREE.MeshStandardMaterial( { metalness: 0, roughness: 0.5, color: RBAC.colors.resource } );
  
  RBAC.memberMaterial = new THREE.MeshStandardMaterial( { metalness: 0, roughness: 0.5, color: RBAC.colors.member } );  
}
    
RBAC.positionStack = [];
RBAC.rotationStack = [];
{
  var quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI / 2 );
  
  RBAC.positionStack.push(new THREE.Vector3());
  RBAC.rotationStack.push(quaternion);
}

RBAC.viewpoints = {};
RBAC.viewpointsList = []

RBAC.viewpoint = function(name) {
  var lookAt = RBAC.positionStack[RBAC.positionStack.length - 1].clone();
  
  var lookFrom = lookAt.clone();
  lookFrom.x += 1;
  lookFrom.z += 2.5;
  
  var view = {
    lookFrom: lookFrom,
    lookAt: lookAt.clone()
  };
  
  RBAC.viewpoints[name] = view;
  RBAC.viewpointsList.push(view);
}

RBAC._staticLookAt = function() {
  var view = RBAC.viewpointsList[RBAC.currentViewIndex];

  camera.position.x = view.lookFrom.x;
  camera.position.y = view.lookFrom.y;
  camera.position.z = view.lookFrom.z;
  
  camera.lookAt(view.lookAt);
}

// Select viewpoint RBAC.currentViewIndex
RBAC._lookAt = function() {
  // return RBAC._staticLookAt();

  var view = RBAC.viewpointsList[RBAC.currentViewIndex];
  
  var startPosition = camera.position.clone();
  var startOrientation = camera.quaternion.clone();

  var endPosition = view.lookFrom.clone();

  var endOrientation = new THREE.Quaternion();
  var endOrientationMatrix = new THREE.Matrix4();
  endOrientationMatrix.lookAt(view.lookFrom, view.lookAt, camera.up);
  endOrientation.setFromRotationMatrix(endOrientationMatrix);

  var startTime = Date.now();
  var animationPeriod = 1000.0;
  function update() {
    var currentTime = Date.now();
    var elapsed = ( currentTime - startTime );
    if ( elapsed > animationPeriod ) {
      requestAnimationFrame(animate);
      return;
    }
    
    var t = elapsed / animationPeriod;
    {
      var position = startPosition.clone();
      position.lerp(endPosition, t);
      camera.position.copy(position);
    }
    {
      var orientation = startOrientation.clone();
      orientation.slerp(endOrientation, t);
      camera.quaternion.copy(orientation.normalize());
    }
    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }
  update();
}

RBAC.look = function(name) {
  var view = RBAC.viewpoints[name];
  RBAC.currentViewIndex = RBAC.viewpointsList.indexOf(view);
  RBAC._lookAt();
}

RBAC.lookNext = function() {
  RBAC.currentViewIndex = ( RBAC.currentViewIndex + 1 ) % RBAC.viewpointsList.length;
  RBAC._lookAt();  
}

RBAC.lookPrevious = function() {
  RBAC.currentViewIndex = RBAC.currentViewIndex - 1;
  if ( RBAC.currentViewIndex < 0 ) {
    RBAC.currentViewIndex = RBAC.viewpointsList.length - 1;
  }
  RBAC._lookAt();  
}

RBAC.moveTo = function(translation, rotation) {
  {
    var top = RBAC.positionStack[RBAC.positionStack.length - 1];
    var vec = top.clone();
    var tx = translation.clone();
    tx.multiplyScalar(RBAC.scale);
    vec.add(tx);
    RBAC.positionStack.push(vec);
  }
  {
    var top = RBAC.rotationStack[RBAC.rotationStack.length - 1];
    var rot = top.clone();
    rot.multiply(rotation);
    RBAC.rotationStack.push(rot);        
  }
}

RBAC.popMove = function() {
  RBAC.positionStack.pop();
  RBAC.rotationStack.pop();
}

RBAC.reconfigure();

function onDocumentKeyDown( event ) {
  switch( event.keyCode ) {
    // 'h'
    case 72:
    RBAC.look("home");
    break;
    // 'n'
    case 78:
    RBAC.lookNext();
    break;
    // 'p'
    case 80:
    RBAC.lookPrevious();
    break;
  }
}

document.addEventListener( 'keydown', onDocumentKeyDown, false );
