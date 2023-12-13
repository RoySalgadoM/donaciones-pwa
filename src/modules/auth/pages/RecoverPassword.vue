<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-primary to-secondary">
    <div
      class="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl"
    >
      <div class="space-y-6">
        <h2 class="text-3xl font-bold text-gray-900 text-center">
          Recuperar contraseña
        </h2>
        <div v-if="!isSendEmail">
          <p class="text-gray-600 text-center mb-3">
            Se enviará un correo con un enlace para restablecer tu contraseña.
          </p>
          <Form @formSubmit="handleSendEmail">
            <div class="mb-4">
              <div class="flex flex-col items-center justify-center">
                <div class="mb-6">
                  <Input
                    required
                    noWhiteSpace
                    :label="'Correo'"
                    v-model.email="email"
                    @clean="email = null"
                  />
                </div>
                <div class="mb-6">
                  <Btn
                    type="submit"
                    :text="'Enviar correo'"
                    darkColor="dark:bg-primary"
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div v-if="isSendEmail">
          <p class="text-gray-600 text-center mb-3">
            Ingresa el código que se envió a tun correo electrónico.
          </p>
          <Form @formSubmit="handleRecoverPassword">
            <div class="mb-4">
              <div class="flex flex-col items-center justify-center">
                <div class="mb-6">
                  <Input
                    required
                    noWhiteSpace
                    :label="'Código de recuperación'"
                    v-model.integer="recover.recoverCode"
                    @clean="recover.recoverCode = null"
                  />
                </div>
                <div class="mb-6">
                  <Input
                    required
                    noWhiteSpace
                    :label="'Contraseña'"
                    v-model="recover.password"
                    @clean="recover.password = null"
                    type="password"
                  />
                </div>
                <div class="mb-6">
                  <Input
                    required
                    noWhiteSpace
                    :label="'Confirmar contraseña'"
                    v-model="confirmPassword"
                    @clean="confirmPassword = null"
                    type="password"
                  />
                </div>
                <div class="mb-6">
                  <Btn
                    type="submit"
                    :text="'Enviar correo'"
                    darkColor="dark:bg-primary"
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div class="text-sm text-center">
          ¿Ya tienes una cuenta?
          <a href="/" class="text-blue-500">Iniciar sesión</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import {useAccessAuthStore} from "@/config/stores/auth";
import { loading } from "@/kernel/components/loading";

const showMsg = inject("showMsg", () => {});
const router = useRouter();
const useAuthStore = useAccessAuthStore();

const email = ref(null);
const isSendEmail = ref(false);

const recover = ref({
  recoverCode: null,
  password: null,
});

const confirmPassword = ref(null);

const handleRecoverPassword = async () => {
  console.log(email.value);
};

const handleSendEmail = async () => {
  try {
    loading.show();
    let res = await useAuthStore.reqRecoverPassword(email.value);
    console.log(res);
    if(res.data.statusCode == 200){
        isSendEmail.value = true;
        showMsg("success", res.data.message);
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
  }finally{
    loading.hide();
  }
};
</script>