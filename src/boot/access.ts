import router from "../config/router/index";
import { useAccessAuthStore } from "../config/stores/auth";
import { notify } from "../kernel/components/notify";

router.beforeResolve(async (to, from, next) => {
  const accessAuth = useAccessAuthStore();
  try {
    if (to.meta.privilege) {
      if (accessAuth.isValid === null) {
        await accessAuth.setValidation();
      }
      if (accessAuth.isValid) {
        next();
      } else {
        if (from.fullPath == "/") {
          next();
        } else {
          notify.show("error", "No cuentas con acceso");
          next({ name: "Login" });
        }
      }
    } else {
      next();
    }
  } catch (error) {
    notify.show("error", "No cuentas con acceso");
    next({ name: "Login" });
  }
});
