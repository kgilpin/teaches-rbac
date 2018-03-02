/**
 * Renders a resource.
 * 
 * @param {string} resourceName 
 * @param {object} options - privilege: string; whether to draw a privilege, and what to call it.
 */
RBAC.resource = function(resourceName, options = {}) {
  {
    var resource = new THREE.Mesh( RBAC.resourceGeometry, RBAC.resourceMaterial );        
    resource.position.copy(RBAC.positionStack[RBAC.positionStack.length - 1]);
    resource.quaternion.copy(RBAC.rotationStack[RBAC.rotationStack.length - 1]);
    RBAC.runtime.scene.add(resource);
    
    if ( resourceName ) {
      var geometry = new THREE.TextGeometry( resourceName, {
        font: RBAC.runtime.font,
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
      mesh.position.y = resource.position.y;
      mesh.position.z = resource.position.z + 0.03;
      mesh.rotation.x = 0;
      mesh.rotation.y = Math.PI * 2;
      
      RBAC.runtime.scene.add(mesh);
    }
  }  

  if (RBAC.positionStack.length > 1 && options.privilege !== undefined ) {
    // Construct a cylinder from the +last+ role to the +current+ resource.
    
    var last = RBAC.positionStack[RBAC.positionStack.length - 2];
    var current = RBAC.positionStack[RBAC.positionStack.length - 1];
    
    var privilegeRotation = new THREE.Quaternion();
    privilegeRotation.setFromUnitVectors(RBAC.yunit, current.clone().sub(last).normalize());
    var privilegeLength = ( last.distanceTo(current) );
    var halfwayPosition = last.clone();
    {
      var delta = current.clone();
      delta.sub(last);
      delta.multiplyScalar(0.50);
      halfwayPosition.add(delta);
    }
    
    {
      var privilegeGeometry = new THREE.CylinderGeometry( RBAC.scale * 0.05, RBAC.scale * 0.05, privilegeLength, 20 );        
      var privilege = new THREE.Mesh( privilegeGeometry, RBAC.privilegeMaterial );          
      privilege.position.copy(halfwayPosition);
      privilege.quaternion.copy(privilegeRotation);
      
      RBAC.runtime.scene.add(privilege);
    }
    if ( typeof options.privilege === "string" ) {
      var labelBoxSize = RBAC.scale * RBAC.dimensions.resource.width / 1.5;
      var labelGeometry = new THREE.BoxGeometry(labelBoxSize, 
        RBAC.scale * RBAC.dimensions.resource.thickness / 4, 
        labelBoxSize, 
        100)
      var labelRotation = privilegeRotation.clone();
      labelRotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), - Math.PI / 2));
      var label = new THREE.Mesh( labelGeometry, RBAC.privilegeMaterial );
      var labelPosition = halfwayPosition.clone();
      labelPosition.y -= RBAC.scale * RBAC.dimensions.resource.height / 4;
      label.position.copy(labelPosition);
      label.quaternion.copy(labelRotation);
      RBAC.runtime.scene.add(label);

      var geometry = new THREE.TextGeometry( options.privilege, {
        font: RBAC.runtime.font,
        size: 0.05,
        height: 0.0
      });
      geometry.computeBoundingBox();
      var xOffset = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
      var yOffset = -0.5 * ( geometry.boundingBox.max.y - geometry.boundingBox.min.y );
      var materials = [
        new THREE.MeshBasicMaterial( { color: 0x223322, overdraw: 0.5 } ),
        new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: 0.5 } ),
      ];
      var txt = new THREE.Mesh( geometry, materials );
      txt.position.x = label.position.x + xOffset;
      txt.position.y = label.position.y + yOffset;
      txt.position.z = label.position.z + 0.03;
      
      RBAC.runtime.scene.add(txt);
    }
  }  
}
