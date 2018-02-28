/**
 * Renders a role.
 * @param {string} roleName 
 * @param {object} options - member: (true|false)
 */
RBAC.role = function(roleName, options = {}) {
  if (RBAC.positionStack.length > 1 && options.member !== false ) {
    // Construct a cylinder and pointer from the +last+ role to the +current+ role
    
    var last = RBAC.positionStack[RBAC.positionStack.length - 2];
    var current = RBAC.positionStack[RBAC.positionStack.length - 1];
    
    var memberRotation = new THREE.Quaternion();
    memberRotation.setFromUnitVectors(RBAC.yunit, current.clone().sub(last).normalize());
    var memberLength = ( last.distanceTo(current) - RBAC.scale * 2 );
    var halfwayPosition = last.clone();
    {
      var delta = current.clone();
      delta.sub(last);
      delta.multiplyScalar(0.50);
      halfwayPosition.add(delta);
    }
    
    {
      // The cylinder center is stepped back 5% from halfway position
      var memberPosition = halfwayPosition.clone();
      memberPosition.add(RBAC.yunit.clone().applyQuaternion(memberRotation).multiplyScalar(-memberLength * 0.05));
      
      var memberGeometry = new THREE.CylinderGeometry( RBAC.scale * 0.05, RBAC.scale * 0.05, memberLength * 0.9, 20 );        
      var member = new THREE.Mesh( memberGeometry, RBAC.memberMaterial );          
      member.position.copy(memberPosition);
      member.quaternion.copy(memberRotation);
      
      scene.add(member);
    }
    {
      // The pointer center is forward 45% from halfway position
      var pointerPosition = halfwayPosition.clone();
      pointerPosition.add(RBAC.yunit.clone().applyQuaternion(memberRotation).multiplyScalar(memberLength * 0.45));
      
      var pointerGeometry = new THREE.ConeGeometry(RBAC.scale * RBAC.dimensions.member_arrow.radius, 
        memberLength * 0.1, 
        20); // r, h, radialSegments
      var pointer = new THREE.Mesh( pointerGeometry, RBAC.memberMaterial );          
      pointer.position.copy(pointerPosition);
      pointer.quaternion.copy(memberRotation);
      
      scene.add(pointer);
    }
  }
  {
    var role = new THREE.Mesh( RBAC.roleGeometry, RBAC.roleMaterial );        
    role.position.copy(RBAC.positionStack[RBAC.positionStack.length - 1]);
    role.quaternion.copy(RBAC.rotationStack[RBAC.rotationStack.length - 1]);
    scene.add(role);
    
    if ( roleName ) {
      var geometry = new THREE.TextGeometry( roleName, {
        font: font,
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
      var mesh = new THREE.Mesh( geometry, materials );
      mesh.position.x = role.position.x + xOffset;
      mesh.position.y = role.position.y + yOffset;
      mesh.position.z = role.position.z + 0.03;
      mesh.rotation.x = 0;
      mesh.rotation.y = Math.PI * 2;
      
      scene.add(mesh);
    }
  }
}
