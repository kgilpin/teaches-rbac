function render() {
  {
    RBAC.translateTo(-3);
    RBAC.role("Alice", { member: false });
  
    {
      RBAC.translateTo(3, -3);
      RBAC.role("employees");

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
    RBAC.translateTo(0);
    RBAC.role("Bob", { member: false });
  
    {
      RBAC.translateTo(0, -3);
      RBAC.role();
      RBAC.popMove();
    }

    RBAC.popMove();
  }

  {
    RBAC.translateTo(3);
    RBAC.role("Carol", { member: false });
  
    {
      RBAC.translateTo(-3, -3);
      RBAC.role();
      RBAC.popMove();
    }

    RBAC.popMove();
  }
}

window.onload = function() {
  RBAC.initialize(() => {

    RBAC.scale = 0.25;
    RBAC.translateTo(2, -1.5, 0)
    RBAC.viewpoint("home", RBAC.scale, 0, RBAC.scale * 6);
    RBAC.lookNow("home");
    RBAC.popMove();

    requestAnimationFrame(RBAC.animate);
  });
}
