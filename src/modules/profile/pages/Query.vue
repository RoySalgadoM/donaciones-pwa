<template>
  <ContentSection>
    <template #title> Perfil </template>
    <template #content>
      <div class="grid grid-cols-12">
        <div class="col-span-12 md:col-span-3">
          <div class="flex flex-row items-center justify-center">
            <span class="material-icons text-primary" style="font-size: 8rem"
              >account_circle</span
            >
          </div>
        </div>
        <div class="col-span-12 md:col-span-9">
          <div
            class="text-lg md:text-xl font-semibold break-words truncate mb-2"
          >
            {{ "Miriam Guadalupe Saucedo Bustamante" }}
          </div>
          <div class="text-md md:text-lg font-normal break-words truncate mb-2">
            {{ "Correo electrónico: miriam@gmail.com" }}
          </div>
          <div class="text-md md:text-lg font-normal break-words truncate mb-2">
            {{ "Teléfono: 7771888263" }}
          </div>
          <div class="text-md md:text-lg font-normal break-words truncate mb-2">
            {{ "Rol: Administrador" }}
          </div>
        </div>
      </div>
      <hr
        class="w-48 h-1 mx-auto my-2 bg-gray-100 border-0 rounded md:my-5 dark:bg-gray-700"
      />
      <Form @formSubmit="changePassword">
        <div class="grid grid-cols-12 gap-4 lg:mx-40">
          <div class="mb-4 col-span-12">
            <div class="flex flex-row items-center justify-center">
              <div
                class="text-lg md:text-xl font-semibold break-words truncate mb-2"
              >
                {{ "Cambiar contraseña" }}
              </div>
            </div>
          </div>
          <div class="mb-4 col-span-12 sm:col-span-6 md:col-span-4">
            <Input
              required
              noWhiteSpace
              :label="'Contraseña actual'"
              v-model="user.password"
              @clean="user.password = null"
              type="password"
            />
          </div>
          <div class="mb-4 col-span-12 sm:col-span-6 md:col-span-4">
            <Input
              required
              noWhiteSpace
              :label="'Contraseña nueva'"
              v-model="user.newPassword"
              @clean="user.newPassword = null"
              type="password"
            />
          </div>
          <div class="mb-4 col-span-12 sm:col-span-6 md:col-span-4">
            <Input
              required
              noWhiteSpace
              :label="'Confirmar contraseña'"
              v-model="confirmPassword"
              @clean="confirmPassword = null"
              :rules="[
                (v) => v === user.newPassword || 'Las contraseñas no coinciden',
              ]"
              type="password"
            />
          </div>
          <div
            class="mb-4 col-span-12 sm:col-span-6 md:col-span-4 md:col-start-9"
          >
            <div class="flex items-center justify-end">
              <Btn
                color="bg-primary"
                hoverColor="hover:bg-primary"
                text="Guardar"
                rounded
              >
                <template #icon>
                  <span class="material-icons">save</span>
                </template>
              </Btn>
            </div>
          </div>
        </div>
      </Form>
    </template>
  </ContentSection>
</template>
      
    <script setup>
import { inject } from "vue";
import { ref, onMounted } from "vue";
import { useProductsStore } from "@/modules/products/stores/product";
import { useProfileStore } from "../stores/profile";
import { storeToRefs } from "pinia";
import { loading } from "@/kernel/components/loading";

const showMsg = inject("showMsg", () => {});
const productsStore = useProductsStore();
const profileStore = useProfileStore();

const user = ref({
  password: null,
  newPassword: null,
});

const confirmPassword = ref(null);

const changePassword = async () => {
  try {
    loading.show();
    let payload = {
      body: {
        password: user.value.password,
        newPassword: user.value.newPassword,
      }
    };
    let res = await profileStore.changePassword(payload);
    if (res.data.statusCode === 200) {
      showMsg("success",res.data.message);
      user.value.password = null;
      user.value.newPassword = null;
      confirmPassword.value = null;
    }
  } catch (error) {
    if (error.code == "ERR_NETWORK") {
      showMsg("error", "Error de conexión");
    } else if (error.code == "ERR_BAD_REQUEST") {
      showMsg("error", error.response.data.message);
    } else {
      console.error(error);
      showMsg("error", "Error interno del servidor");
    }
  } finally {
    loading.hide();
  }
};

onMounted(() => {});
</script>