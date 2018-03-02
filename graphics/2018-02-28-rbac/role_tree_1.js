function render() {
  RBAC.translateTo(0);
  RBAC.role("A", { member: false });

  {
    RBAC.translateTo(-1.5, -3);
    RBAC.role("B");

    {
      RBAC.translateTo(-6, -3);
      RBAC.role("P");
      RBAC.popMove();
        
      RBAC.translateTo(-3, -3);
      RBAC.role("Q");
      RBAC.popMove();

      RBAC.translateTo(0, -3);
      RBAC.role("R");
      RBAC.popMove();
    }

    RBAC.popMove();  
  }
  {
    RBAC.translateTo(1.5, -3);
    RBAC.role("C");

    {
      RBAC.translateTo(0, -3);
      RBAC.role("S");
      RBAC.popMove();
        
      RBAC.translateTo(3, -3);
      RBAC.role("T");
      RBAC.popMove();

      RBAC.translateTo(6, -3);
      RBAC.role("U");
      RBAC.popMove();
    }

    RBAC.popMove();  
  }
  
  RBAC.popMove();
}

window.onload = function() {
  RBAC.initialize(() => {

    RBAC.scale = 0.25;
    RBAC.translateTo(0, -3, 0)
    RBAC.viewpoint("home", RBAC.scale, 0, RBAC.scale * 8);
    RBAC.lookNow("home");
    RBAC.popMove();

    requestAnimationFrame(RBAC.animate);
  });
}
