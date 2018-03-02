var RBAC = {}

RBAC.scale = 0.25;
RBAC.yunit = new THREE.Vector3(0, 1, 0);
RBAC.dimensions = {
  role: {
    radius: 1,
    thickness: 0.20
  },
  resource: {
    width: 2,
    height: 2,
    thickness: 0.20
  },
  member_arrow: {
    radius: 0.1
  },
  privilege_arrow: {
    radius: 0.1
  }
}
RBAC.colors = {
  role: 0x00dd22,
  roleHighlight: 0x77ee77,
  resource: 0xff0000,
  member: 0x0000ff,
  privilege: 0x00ffff,
}

RBAC.images = {
  person: new THREE.TextureLoader().load('/icons/person.png')
}

RBAC.images.person.rotation = Math.PI / 2;
RBAC.images.person.center = new THREE.Vector2(0.5, 0.5);

RBAC.runtime = {}

RBAC.initialize = function(cb) {
  RBAC.runtime.renderer = new THREE.WebGLRenderer({antialias: true});
  RBAC.runtime.renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( RBAC.runtime.renderer.domElement );
  
  RBAC.runtime.scene = new THREE.Scene();
  RBAC.runtime.scene.background = new THREE.Color("#cccccc");
  
  RBAC.runtime.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  {
    var light = new THREE.DirectionalLight( 0xffffff, 0.60 );
    light.position.set( 20, 20, 50 );
    RBAC.runtime.scene.add( light );
  }
  {
    var light = new THREE.DirectionalLight( 0xffffff, 0.60 );
    light.position.set( -20, 20, 50 );
    RBAC.runtime.scene.add( light );
  }
 
  var loader = new THREE.FontLoader();
  loader.load('/js/lib/fonts/helvetiker_regular.typeface.json', function (theFont) {
    RBAC.runtime.font = theFont;
    cb();
  });
}

RBAC.animate = function() {
  render();
  RBAC.runtime.renderer.render( RBAC.runtime.scene, RBAC.runtime.camera );
}

RBAC.reconfigure = function() {
  RBAC.roleGeometry = new THREE.CylinderGeometry(RBAC.scale * RBAC.dimensions.role.radius, 
    RBAC.scale * RBAC.dimensions.role.radius,
    RBAC.scale * RBAC.dimensions.role.thickness,
    100);

  RBAC.roleMaterial = function(roleType) {
    if ( roleType == "person" ) {
      return new THREE.MeshStandardMaterial({ 
        metalness: 0, 
        roughness: 0.5, 
        color: RBAC.colors.role,
        map: RBAC.images.person,
        transparent: true 
      });
    }
    else {
      return new THREE.MeshStandardMaterial({ 
        metalness: 0, 
        roughness: 0.5, 
        color: RBAC.colors.role,
      });
    }
  }

  RBAC.resourceGeometry = new THREE.BoxGeometry(RBAC.scale * RBAC.dimensions.resource.width, 
    RBAC.scale * RBAC.dimensions.resource.thickness, 
    RBAC.scale * RBAC.dimensions.resource.height, 
    100);
  RBAC.resourceMaterial = new THREE.MeshStandardMaterial( { metalness: 0, roughness: 0.5, color: RBAC.colors.resource } );
  
  RBAC.memberMaterial = new THREE.MeshStandardMaterial( { metalness: 0, roughness: 0.5, color: RBAC.colors.member } );  

  RBAC.privilegeMaterial = new THREE.MeshStandardMaterial( { metalness: 0, roughness: 0.5, color: RBAC.colors.privilege } );  
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

RBAC.viewpoint = function(name, offsetX = 1, offsetY = 0, offsetZ = 2.5) {
  var lookAt = RBAC.positionStack[RBAC.positionStack.length - 1].clone();
  
  var lookFrom = lookAt.clone();
  lookFrom.x += offsetX;
  lookFrom.y += offsetY;
  lookFrom.z += offsetZ;

  var view = {
    lookFrom: lookFrom,
    lookAt: lookAt.clone()
  };
  
  RBAC.viewpoints[name] = view;
  RBAC.viewpointsList.push(view);
}

// Move the camera immediately to RBAC.currentViewIndex.
RBAC._lookAtNow = function() {
  var view = RBAC.viewpointsList[RBAC.currentViewIndex];

  RBAC.runtime.camera.position.x = view.lookFrom.x;
  RBAC.runtime.camera.position.y = view.lookFrom.y;
  RBAC.runtime.camera.position.z = view.lookFrom.z;
  
  RBAC.runtime.camera.lookAt(view.lookAt);
}

// Animate to viewpoint RBAC.currentViewIndex.
RBAC._lookAt = function() {
  var view = RBAC.viewpointsList[RBAC.currentViewIndex];
  
  var startPosition = RBAC.runtime.camera.position.clone();
  var startOrientation = RBAC.runtime.camera.quaternion.clone();

  var endPosition = view.lookFrom.clone();

  var endOrientation = new THREE.Quaternion();
  var endOrientationMatrix = new THREE.Matrix4();
  endOrientationMatrix.lookAt(view.lookFrom, view.lookAt, RBAC.runtime.camera.up);
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
      RBAC.runtime.camera.position.copy(position);
    }
    {
      var orientation = startOrientation.clone();
      orientation.slerp(endOrientation, t);
      RBAC.runtime.camera.quaternion.copy(orientation.normalize());
    }
    renderer.render(RBAC.runtime.scene, RBAC.runtime.camera);
    requestAnimationFrame(update);
  }
  update();
}

RBAC.lookNow = function(name) {
  RBAC.look(name, { now: true })
}

RBAC.look = function(name, options = {}) {
  var view = RBAC.viewpoints[name];
  RBAC.currentViewIndex = RBAC.viewpointsList.indexOf(view);
  if ( options.now === true )
    RBAC._lookAtNow();
  else
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

RBAC.translateTo = function(x = 0, y = 0, z = 0) {
  RBAC.moveTo(new THREE.Vector3(x, y, z));
}

RBAC.moveTo = function(translation, rotation = new THREE.Quaternion()) {
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
