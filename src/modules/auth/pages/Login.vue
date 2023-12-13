<template>
  <div class="min-h-screen flex items-center justify-center px-4 md:px-0">
    <div class="flex flex-wrap w-full max-w-4xl">
      <div
        class="hidden md:block md:w-1/2 bg-white rounded-tl-lg rounded-bl-lg shadow-xl"
      >
        <img
          src="@/assets/images/ayuntamiento.jpg"
          alt="Descriptive text"
          class="object-contain w-full h-full"
        />
      </div>

      <div
        class="w-full md:w-1/2 max-w-md mx-auto bg-white p-6 md:p-10 rounded-lg md:rounded-tl-none md:rounded-bl-none shadow-xl"
      >
        <div class="space-y-6">
          <h2 class="text-3xl font-bold text-gray-900 text-center">
            Inicio de sesión
          </h2>
          <p class="text-gray-600 text-center">
            Bienvenido! Inicia sesión para gestionar las donaciones.
          </p>
          <Form @form-submit="handleLogin">
            <div class="mb-4">
              <div class="flex flex-col items-center justify-center">
                <div class="mb-6">
                  <Input
                    required
                    noWhiteSpace
                    :label="'Correo'"
                    v-model.email="user.email"
                    @clean="user.email = null"
                  />
                </div>
                <div class="mb-6">
                  <Input
                    required
                    noWhiteSpace
                    :label="'Contraseña'"
                    v-model="user.password"
                    @clean="user.password = null"
                    type="password"
                  />
                </div>
                <div class="mb-6">
                  <Btn
                    type="submit"
                    :text="'Iniciar sesión'"
                    darkColor="dark:bg-primary"
                  />
                </div>
              </div>
            </div>
          </Form>
          <div class="text-sm text-center">
            ¿Olvidaste tu contraseña?
            <a href="#" class="text-blue-500">Recuperar</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/config/stores/auth";

const showMsg = inject("showMsg", () => {});
const router = useRouter();

const user = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  console.log(user.value);
  try {
    const data = await login(user.value.email, user.value.password);
    if (data && data.statusCode === 200) {
      showMsg("success", "Bienvenido");
      router.push({ name: "queryUser" });
    }
  } catch (error) {
    console.error(error);
    if (error.code == "ERR_NETWORK") {
      showMsg("error", "Error de conexión");
    } else if (error.code == "ERR_BAD_REQUEST") {
      showMsg("error", error.response.data.message);
    } else {
      console.error(error);
      showMsg("error", "Error interno del servidor");
    }
  }
};
</script>
