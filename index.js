function render() {
  RBAC.role("admin")
  
  {
    RBAC.moveTo(new THREE.Vector3( 0, -3, 0 ), new THREE.Quaternion());
    RBAC.role("managers");
    RBAC.popMove();
  }
  
  {
    RBAC.moveTo(new THREE.Vector3( 3, -3, 0 ), new THREE.Quaternion());
    RBAC.role("engineers");
    
    {
      RBAC.moveTo(new THREE.Vector3( 3, 0, 0 ), new THREE.Quaternion());
      RBAC.resource("code");
      RBAC.viewpoint("code");
      RBAC.popMove();
    }
    
    
    {
      RBAC.moveTo(new THREE.Vector3( 0, -3, 0 ), new THREE.Quaternion());
      RBAC.role("alice");
      RBAC.popMove();
    }
    {
      RBAC.moveTo(new THREE.Vector3( 3, -3, 0 ), new THREE.Quaternion());
      RBAC.role("bob");
      RBAC.popMove();
    }
    {
      RBAC.moveTo(new THREE.Vector3( -3, -3, 0 ), new THREE.Quaternion());
      RBAC.role("dan");
      RBAC.popMove();
    }
    
    {
      {
        RBAC.moveTo(new THREE.Vector3( 0, -3, -3, ), new THREE.Quaternion());
        RBAC.role();
        RBAC.popMove();
      }
      {
        RBAC.moveTo(new THREE.Vector3( 3, -3, -3 ), new THREE.Quaternion());
        RBAC.role();
        RBAC.popMove();
      }
      {
        RBAC.moveTo(new THREE.Vector3( -3, -3, -3 ), new THREE.Quaternion());
        RBAC.role();
        RBAC.popMove();
      }
    }
    {
      {
        RBAC.moveTo(new THREE.Vector3( 0, -3, -6, ), new THREE.Quaternion());
        RBAC.role();
        RBAC.popMove();
      }
      {
        RBAC.moveTo(new THREE.Vector3( 3, -3, -6 ), new THREE.Quaternion());
        RBAC.role();
        RBAC.popMove();
      }
      {
        RBAC.moveTo(new THREE.Vector3( -3, -3, -6 ), new THREE.Quaternion());
        RBAC.role();
        RBAC.popMove();
      }
    }
    
    RBAC.popMove();
  }
  
  {
    RBAC.moveTo(new THREE.Vector3( -3, -3, 0 ), new THREE.Quaternion());
    RBAC.role("operations");
    
    {
      RBAC.moveTo(new THREE.Vector3( -3, 0, 0 ), new THREE.Quaternion());
      RBAC.resource("servers");
      RBAC.viewpoint("servers");
      RBAC.popMove();
    }
    
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
