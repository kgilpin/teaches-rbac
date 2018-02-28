RBAC.resource = function(resourceName) {
  {
    var resource = new THREE.Mesh( RBAC.resourceGeometry, RBAC.resourceMaterial );        
    resource.position.copy(RBAC.positionStack[RBAC.positionStack.length - 1]);
    resource.quaternion.copy(RBAC.rotationStack[RBAC.rotationStack.length - 1]);
    scene.add(resource);
    
    if ( resourceName ) {
      var geometry = new THREE.TextGeometry( resourceName, {
        font: font,
        size: 0.07,
        height: 0
      });
      geometry.computeBoundingBox();
      var xOffset = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
      var yOffset = -0.5 * ( geometry.boundingBox.max.y - geometry.boundingBox.min.y );
      var materials = [
      new THREE.MeshBasicMaterial( { color: 0x223322, overdraw: 0.5 } ),
      new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: 0.5 } ),
      ];
      var mesh = new THREE.Mesh( geometry, materials );
      mesh.position.x = resource.position.x + xOffset;
      mesh.position.y = resource.position.y + yOffset;
      mesh.position.z = resource.position.z + 0.03;
      mesh.rotation.x = 0;
      mesh.rotation.y = Math.PI * 2;
      
      scene.add(mesh);
    }
  }  
}
