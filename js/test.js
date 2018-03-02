function render() {
  {
    RBAC.moveTo(new THREE.Vector3( -3, -3, 0 ), new THREE.Quaternion());
    RBAC.role("admin", { member: false })
    RBAC.popMove();
  }
  
  {
    RBAC.moveTo(new THREE.Vector3( 0, -3, 0 ), new THREE.Quaternion());
    RBAC.role("n_00", { member: false });
    {
      RBAC.moveTo(new THREE.Vector3( 0, -3, 0 ), new THREE.Quaternion());
      RBAC.role("n_10");
      RBAC.popMove();  
    }
    {
      RBAC.moveTo(new THREE.Vector3( 3, -3, 0 ), new THREE.Quaternion());
      RBAC.role();
      RBAC.popMove();  
    }
    {
      RBAC.moveTo(new THREE.Vector3( -3, -3, 0 ), new THREE.Quaternion());
      RBAC.role("not_a_member", { member: false });
      RBAC.viewpoint("not_a_member");
      RBAC.popMove();  
    }
    RBAC.popMove();
  }
  
  {
    RBAC.moveTo(new THREE.Vector3( 6, -3, 0 ), new THREE.Quaternion());
    RBAC.resource("r_00");
    RBAC.viewpoint("r_00");
    RBAC.popMove();
  }
  
  
  animate();
}

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}

var scene;
var font;
var camera;
var renderer;

window.onload = function() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#cccccc");
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  console.log(camera.position);
  
  RBAC.moveTo(new THREE.Vector3( 0, -3, 0 ), new THREE.Quaternion());
  RBAC.viewpoint("home");
  RBAC.popMove();
  
  RBAC.look("home");
  
  {
    var light = new THREE.DirectionalLight( 0xffffff, 0.60 );
    light.position.set( 20, 20, 50 );
    scene.add( light );
  }
  {
    var light = new THREE.DirectionalLight( 0xffffff, 0.60 );
    light.position.set( -20, 20, 50 );
    scene.add( light );
  }
  
  var loader = new THREE.FontLoader();
  loader.crossOrigin = '';
  loader.load('lib/fonts/helvetiker_regular.typeface.json', function (theFont) {
    font = theFont;
    render();
    animate();
  });
}
