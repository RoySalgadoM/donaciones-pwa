import router from "../config/router/index";
import { useAccessAuthStore } from "../config/stores/auth";
import { notify } from "../kernel/components/notify";

router.beforeResolve(async (to, from, next) => {
  const accessAuth = useAccessAuthStore();
  try {
    console.log("to", to);
    await accessAuth.setValidation();
    if (to.meta.privilege) {
      if (accessAuth.isValid) {
        next();
      } else {
        notify.show("error", "No cuentas con acceso");
        next({ name: "Login" });
      }
    } else {
      if (accessAuth.isValid) {
        console.log("from", from);
        next(from.name ? { name: from.name } : { name: "queryUser" }); 
      }else{
        next();
      }
    }
  } catch (error) {
    notify.show("error", "No cuentas con acceso, ocurrió un error");
    next({ name: "Login" });
  }
});
