function render() {
  {
    RBAC.translateTo(0, -3);
    RBAC.role("employees", { member: false });

    {
      RBAC.translateTo(0, -3);
      RBAC.role("openers");
      
      {
        RBAC.translateTo(5, 0);
        RBAC.resource("door", { privilege: "open" });
        RBAC.popMove();
      }

      RBAC.popMove();
    }
      
    RBAC.popMove();
  }
  

  {
    RBAC.translateTo(-3);
    RBAC.role("Charlie", { member: false }); // , roleType: "person" });

    {
      RBAC.translateTo(0, -3);
      RBAC.role("contractors");

      {
        RBAC.translateTo(3, -3);
        RBAC.roleMember();
        RBAC.popMove();
      }

      RBAC.popMove();
    }

    RBAC.popMove();
  }
}

window.onload = function() {
  RBAC.initialize(() => {
    RBAC.translateTo(1, -3.25, 0)
    RBAC.viewpoint("home", RBAC.scale, 0, RBAC.scale * 6.5);
    RBAC.lookNow("home");
    RBAC.popMove();
    
    requestAnimationFrame(RBAC.animate);
  });
};
