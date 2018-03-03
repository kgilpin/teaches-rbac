function render() {
  {
    RBAC.translateTo(0, -3);
    RBAC.role("alice", { member: false });

    {
      RBAC.translateTo(0, -3);
      RBAC.role("viewers");
      
      {
        RBAC.translateTo(4, 0, -RBAC.dimensions.role.thickness);
        RBAC.resource("alice", { privilege: "view" });
        RBAC.popMove();
      }
      {
        RBAC.translateTo(4, -3, -RBAC.dimensions.role.thickness);
        RBAC.resource("bob", { privilege: "view" });
        RBAC.popMove();
      }

      RBAC.popMove();
    }

    RBAC.popMove();
  }
}

window.onload = function() {
  RBAC.initialize(() => {
    RBAC.translateTo(2, -6.5, 0)
    RBAC.viewpoint("home", RBAC.scale, 0, RBAC.scale * 6);
    RBAC.lookNow("home");
    RBAC.popMove();
    
    requestAnimationFrame(RBAC.animate);
  });
};
