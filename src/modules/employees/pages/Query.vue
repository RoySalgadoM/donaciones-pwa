<template>
  <ContentSection>
    <template #title> Usuarios </template>
    <template #contentOptions>
      <Input
        noWhiteSpace
        :label="'Buscar...'"
        v-model="filter"
        @clean="
          () => {
            handleSearchInput();
            filter = null;
          }
        "
        @update:modelValue="handleSearchInput"
      />
      <div class="ml-4">
        <Btn
          type="submit"
          color="bg-primary"
          hoverColor="hover:bg-primary"
          rounded
        >
          <template #icon>
            <div class="flex justify-center" @click="modalAdd = true">
              <span class="material-icons">person_add</span>
            </div>
          </template>
        </Btn>
      </div>
    </template>
    <template #content>
      <div v-if="users.length === 0">
        <div class="flex justify-center">
          <div class="mt-10 mb-5 text-gray-500 text-2xl">
            No hay usuarios registrados
          </div>
        </div>
      </div>

      <div
        v-if="users.length > 0"
        class="grid grid-cols-12 gap-4 px-2 items-stretch"
      >
        <Collapse v-for="user in users" :key="user.id">
          <template #content>
            <div
              class="bg-white p-2 shadow-md flex flex-col rounded-lg rounded-collapse-top"
            >
              <div
                class="flex flex-row shrink-0 mr-2 items-center justify-center"
              >
                <span
                  class="material-icons text-primary"
                  style="font-size: 4rem"
                  >account_circle</span
                >
                <div class="ml-2 flex-grow min-w-0">
                  <div class="font-semibold break-words truncate">
                    {{
                      user.name +
                      " " +
                      user.lastname +
                      " " +
                      (user.secondSurname ? user.secondSurname : "")
                    }}
                  </div>
                  <div class="text-gray-600 break-words truncate">
                    {{ user.email }}
                  </div>
                  <span
                    v-if="user.status"
                    class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900"
                  >
                    Activo
                  </span>
                  <span
                    v-else
                    class="bg-red-200 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900"
                  >
                    Inactivo
                  </span>
                </div>
              </div>

              <div
                class="flex-shrink-0 flex justify-end items-end space-x-2 buttons-container"
              >
                <Btn
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalEdit(user)"
                >
                  <template #icon>
                    <span class="material-icons">edit</span>
                  </template>
                </Btn>
                <Btn
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="selectedRow(user)"
                >
                  <template #icon>
                    <span class="material-icons">info</span>
                  </template>
                </Btn>
                <Btn
                  v-if="user.status"
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalConfirm(user.id, user.status)"
                >
                  <template #icon>
                    <span class="material-icons">close</span>
                  </template>
                </Btn>
                <Btn
                  v-else
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalConfirm(user.id, user.status)"
                >
                  <template #icon>
                    <span class="material-icons">done</span>
                  </template>
                </Btn>
              </div>
            </div>
          </template>
          <template #contentCollapse>
            <div
              class="bg-white pr-4 pb-4 shadow-md flex justify-end rounded-collapse-bottom hide-options"
            >
              <div class="flex-shrink-0 flex space-x-2">
                <Btn
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalEdit(user)"
                >
                  <template #icon>
                    <span class="material-icons">edit</span>
                  </template>
                </Btn>
                <Btn
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="selectedRow(user)"
                >
                  <template #icon>
                    <span class="material-icons">info</span>
                  </template>
                </Btn>
                <Btn
                  v-if="user.status"
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalConfirm(user.id, user.status)"
                >
                  <template #icon>
                    <span class="material-icons">close</span>
                  </template>
                </Btn>
                <Btn
                  v-else
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalConfirm(user.id, user.status)"
                >
                  <template #icon>
                    <span class="material-icons">done</span>
                  </template>
                </Btn>
              </div>
            </div>
          </template>
        </Collapse>
      </div>
    </template>
  </ContentSection>

  <!-- Modal para agregar usuario -->
  <Dialog :show="modalAdd" @update:show="modalAdd = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-gray-900">Agregar usuario</h2>
      </div>
    </template>
    <template #content>
      <div class="flex items-center">
        <Form class="pt-5 mb-4" @formSubmit="handleAdd">
          <div class="flex flex-col sm:flex-row sm:gap-4">
            <div class="mb-4">
              <Input
                required
                :label="'Nombre'"
                v-model.alfa="user.name"
                @clean="user.name = null"
              />
            </div>
            <div class="mb-4">
              <Input
                required
                :label="'Apellido'"
                v-model.alfa="user.lastname"
                @clean="user.lastname = null"
              />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row sm:gap-4">
            <div class="mb-4">
              <Input
                :label="'Segundo apellido'"
                v-model.alfa="user.secondSurname"
                @clean="user.secondSurname = null"
              />
            </div>
            <div class="mb-4">
              <Input
                required
                noWhiteSpace
                :label="'Correo'"
                v-model.email="user.email"
                @clean="user.email = null"
              />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row sm:gap-4">
            <div class="mb-4">
              <Input
                required
                noWhiteSpace
                :label="'Teléfono'"
                v-model.integer="user.phone"
                @clean="user.phone = null"
                :rules="[
                  (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                ]"
              />
            </div>
            <div class="mb-4 flex-grow">
              <Select
                v-model="user.role"
                @clean="user.role = null"
                required
                :label="'Rol'"
                :options="selectRoles"
                :loading="selectRoles === null"
              />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row sm:gap-4">
            <div class="mb-4">
              <Input
                required
                noWhiteSpace
                :label="'Contraseña'"
                v-model="user.password"
                @clean="user.password = null"
                type="password"
              />
            </div>
            <div class="mb-4">
              <Input
                required
                noWhiteSpace
                :label="'Confirmar contraseña'"
                v-model="password_confirmation"
                @clean="password_confirmation = null"
                :rules="[
                  (val) =>
                    user.password === val || 'Las contraseñas no coinciden',
                ]"
                type="password"
              />
            </div>
          </div>
          <div class="flex items-center justify-end gap-2">
            <div class="flex-grow">
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
            <Btn
              type="button"
              color="bg-gray-200"
              hoverColor="hover:bg-gray-200"
              rounded
              @click="modalAdd = false"
            >
              <template #icon>
                <span class="material-icons">close</span>
              </template>
            </Btn>
          </div>
        </Form>
      </div>
    </template>
  </Dialog>

  <!-- Modal para editar usuario -->
  <Dialog :show="modalEdit" @update:show="modalEdit = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-black">Editar usuario</h2>
      </div>
    </template>
    <template #content>
      <div class="flex items-center">
        <Form class="pt-5 mb-4" @formSubmit="handleUpdate">
          <div class="flex flex-col sm:flex-row sm:gap-4">
            <div class="mb-4">
              <Input
                required
                :label="'Nombre'"
                v-model.alfa="userEdit.name"
                @clean="userEdit.name = null"
              />
            </div>
            <div class="mb-4">
              <Input
                required
                :label="'Apellido'"
                v-model.alfa="userEdit.lastname"
                @clean="userEdit.lastname = null"
              />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row sm:gap-4">
            <div class="mb-4">
              <Input
                :label="'Segundo apellido'"
                v-model.alfa="userEdit.secondSurname"
                @clean="userEdit.secondSurname = null"
              />
            </div>
            <div class="mb-4">
              <Input
                required
                noWhiteSpace
                :label="'Teléfono'"
                v-model.integer="userEdit.phone"
                @clean="userEdit.phone = null"
                :rules="[
                  (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                ]"
              />
            </div>
          </div>
          <div class="flex flex-col sm:grid sm:grid-cols-2 gap-4">
            <div class="mb-4">
              <Select
                v-model="userEdit.role"
                @clean="userEdit.role = null"
                required
                :label="'Rol'"
                :options="selectRoles"
                :loading="selectRoles === null"
              />
            </div>
          </div>
          <div class="flex items-center justify-end gap-2">
            <div class="flex-grow">
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
            <Btn
              type="button"
              color="bg-gray-200"
              hoverColor="hover:bg-gray-200"
              rounded
              @click="modalEdit = false"
            >
              <template #icon>
                <span class="material-icons">close</span>
              </template>
            </Btn>
          </div>
        </Form>
      </div>
    </template>
  </Dialog>

  <!-- Modal para ver información usuario -->
  <Dialog :show="modalInfo" @update:show="modalInfo = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-gray-900">Información de usuario</h2>
      </div>
    </template>
    <template #content>
      <div
        class="grid grid-cols-12 items-center justify-center w-5/6 gap-6 mt-5 mb-5"
      >
        <div class="col-span-12 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title"
              >Nombre completo</label
            >
            <label class="text-black dark:text-white text-lg font-title">{{
              userEdit
                ? userEdit.name +
                  " " +
                  userEdit.lastname +
                  " " +
                  (userEdit.secondSurname ? userEdit.secondSurname : "")
                : "Nombre de usuario"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Correo</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              userEdit ? userEdit.email : "Correo"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Teléfono</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              userEdit ? userEdit.phone : "Teléfono"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Rol</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              userEdit ? userEdit.role : "Rol"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Estado</label>
            <div class="min-w-0">
              <span
                v-if="userEdit.status"
                class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
              >
                Activo
              </span>
              <span v-else
                class="bg-red-200 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
              >
                Inactivo
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Dialog>

  <!-- Modal para confirmar acción -->
  <Modal size="sm" :show="modalConfirm" @update:show="modalConfirm = $event">
    <template #content>
      <div class="flex flex-col justify-center items-center p-2">
        <div>
          <img src="@/assets/images/ask.png" width="120" height="120" alt="" />
        </div>
        <div class="text-center mb-6">
          <span class="text-xl font-bold text-black">
            ¿Estás seguro de cambiar el estado?
          </span>
        </div>
        <div class="grid grid-cols-12 gap-1">
          <div class="col-span-6">
            <Btn
              color="bg-primary"
              hoverColor="hover:bg-primary"
              text="Sí"
              rounded
              @click="() => handleChangeStatus()"
            >
              <template #icon>
                <span class="material-icons">check</span>
              </template>
            </Btn>
          </div>
          <div class="col-span-6">
            <Btn
              type="button"
              color="bg-gray-200"
              hoverColor="hover:bg-gray-200"
              rounded
              text="No"
              @click="() => (modalConfirm = false)"
            >
              <template #icon>
                <span class="material-icons">close</span>
              </template>
            </Btn>
          </div>
        </div>
      </div>
    </template>
  </Modal>

</template>
  
<script setup>
import { inject, reactive, ref, onMounted } from "vue";
import { useUsersStore } from "@/modules/employees/stores/user";
import { storeToRefs } from "pinia";
import { loading } from "@/kernel/components/loading";

const showMsg = inject("showMsg", () => {});
const timeout = ref(null);
const filter = ref("");
const modalAdd = ref(false);
const modalEdit = ref(false);
const modalInfo = ref(false);
const modalConfirm = ref(false);
const usersStore = useUsersStore();
const { users, pagination } = storeToRefs(usersStore);

const selectRoles = reactive([
  { value: "Administrador", label: "Administrador" },
  { value: "Empleado", label: "Empleado" },
]);

const pag = ref({
  rowsPerPage: 100,
  page: 1,
});

const user = ref({
  name: "",
  lastname: "",
  secondSurname: "",
  email: "",
  password: "",
  role: "",
  phone: "",
});

const userEdit = ref({
  id: "",
  name: "",
  lastname: "",
  secondSurname: "",
  role: "",
  phone: "",
  email: "",
});

const password_confirmation = ref("");

const handleUsers = async () => {
  try {
    loading.show();
    let payload = {
      query: {
        filter: filter.value,
        ...pag.value,
      },
    };
    let res = await usersStore.getUsers(payload);
  } catch (error) {
    if (error.code == "ERR_NETWORK") {
      showMsg("error", "Error de conexión");
    } else {
      console.log(error);
      showMsg("error", "Error interno del servidor");
    }
  } finally {
    loading.hide();
  }
};

const handleSearchInput = async (props) => {
  try {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(async () => {
      handleUsers();
    }, 900);
  } catch (error) {
    showMsg("error", error);
  }
};

const handleAdd = async () => {
  try {
    let payload = {
      body: {
        ...user.value,
      },
    };
    let res = await usersStore.addUser(payload);
    if (res.data.statusCode == 200) {
      showMsg("success", "Usuario agregado correctamente");
      modalAdd.value = false;
      user.value = {
        name: "",
        lastname: "",
        secondSurname: "",
        email: "",
        password: "",
        role: "",
        phone: "",
      };
      password_confirmation.value = "";
      handleUsers();
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
  }
};

const showModalEdit = async (user) => {
  try {
    userEdit.value = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      secondSurname: user.secondSurname,
      role: user.role,
      phone: user.phone,
    };
    modalEdit.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleUpdate = async () => {
  try {
    let payload = {
      id: userEdit.value.id,
      body: {
        name: userEdit.value.name,
        lastname: userEdit.value.lastname,
        secondSurname: userEdit.value.secondSurname,
        phone: userEdit.value.phone,
        role: userEdit.value.role,
      },
    };
    let res = await usersStore.updateUser(payload);
    if (res.data.statusCode == 200) {
      showMsg("success", "Usuario actualizado correctamente");
      modalEdit.value = false;
      handleUsers();
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
  }
};

const showModalConfirm = async (id, status) => {
  try {
    userEdit.value = {
      id: id,
      status: status,
    };
    modalConfirm.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleChangeStatus = async () => {
  try {
    loading.show();
    let res = await usersStore.changeStatus(userEdit.value.id, !userEdit.value.status);
    if (res.data.statusCode == 200) {
      showMsg("success", "Estado actualizado correctamente");
      modalConfirm.value = false;
      handleUsers();
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
  }finally {
    loading.hide();
  }
};

const selectedRow = async (user) => {
  try {
    userEdit.value = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      secondSurname: user.secondSurname,
      role: user.role,
      phone: user.phone,
      email: user.email,
      status: user.status,
    };
    modalInfo.value = true;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  handleUsers();
});
</script>