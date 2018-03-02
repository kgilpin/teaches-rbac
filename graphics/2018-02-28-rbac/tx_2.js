var cameraDistance = 1;

function render() {
  RBAC.translateTo(0, 1);
  
  RBAC.translateTo(-4, 0);
  RBAC.role("Alice", { member: false });

  {
    RBAC.translateTo(4, 0);
    RBAC.resource("front\ndoor", { privilege: "open" });
    RBAC.popMove();
  }  
    
  RBAC.popMove();

  RBAC.translateTo(0, -2.5);

  RBAC.translateTo(-4, 0);
  RBAC.role("IRS", { member: false });

  {
    RBAC.translateTo(4, 0);
    RBAC.resource("money", { privilege: "withdraw" });
    RBAC.popMove();
  }  
    
  RBAC.popMove();

  return false;
}
