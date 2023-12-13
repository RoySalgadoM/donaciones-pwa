<template>
  <ContentSection>
    <template #title> Tiendas </template>
    <template #contentOptions>
      <Input noWhiteSpace :label="'Buscar...'" v-model="filter" @clean="() => {
        handleSearchInput();
        filter = null;
      }
        " @update:modelValue="handleSearchInput" />
      <div class="ml-4">
        <Btn type="submit" color="bg-primary" hoverColor="hover:bg-primary" rounded>
          <template #icon>
            <div class="flex justify-center" @click="modalAdd = true">
              <span class="material-icons"> add_business </span>
            </div>
          </template>
        </Btn>
      </div>
    </template>
    <template #content>
      <div v-if="stores.length === 0">
        <div class="flex justify-center">
          <div class="mt-10 mb-5 text-gray-500 text-2xl">
            No hay tiendas registradas
          </div>
        </div>
      </div>

      <div v-if="stores.length > 0" class="grid grid-cols-12 gap-4 px-2 items-stretch">
        <Collapse v-for="store in stores" :key="store.id">
          <template #content>
            <div class="bg-white p-2 shadow-md flex flex-col rounded-lg rounded-collapse-top">
              <div class="flex flex-row shrink-0 mr-2 items-center justify-center">
                <span class="material-icons text-primary" style="font-size: 4rem">storefront</span>
                <div class="ml-2 flex-grow min-w-0">
                  <div class="font-semibold break-words truncate">
                    {{ store.name }}
                  </div>
                  <div class="text-gray-600 break-words truncate">
                    {{ "Responsable: " + store.nameLinkPerson }}
                  </div>
                  <span v-if="store.status"
                    class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                    Activo
                  </span>
                  <span v-else
                    class="bg-red-200 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                    Inactivo
                  </span>
                </div>
              </div>

              <div class="flex-shrink-0 flex justify-end items-end space-x-2 buttons-container">
                <Btn color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="showModalEdit(store)">
                  <template #icon>
                    <span class="material-icons">edit</span>
                  </template>
                </Btn>
                <Btn type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="selectedRow(store)">
                  <template #icon>
                    <span class="material-icons">info</span>
                  </template>
                </Btn>
                <Btn v-if="store.status" type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded
                  @click="showModalConfirm(store.id, store.status)" title="Desactivar">
                  <template #icon>
                    <span class="material-icons">close</span>
                  </template>
                </Btn>
                <Btn v-else type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded title="Activar"
                  @click="showModalConfirm(store.id, store.status)">
                  <template #icon>
                    <span class="material-icons">done</span>
                  </template>
                </Btn>
              </div>
            </div>
          </template>
          <template #contentCollapse>
            <div class="bg-white pr-4 pb-4 shadow-md flex justify-end rounded-collapse-bottom hide-options">
              <div class="flex-shrink-0 flex space-x-2">
                <Btn color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="showModalEdit(store)">
                  <template #icon>
                    <span class="material-icons">edit</span>
                  </template>
                </Btn>
                <Btn type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="selectedRow(store)">
                  <template #icon>
                    <span class="material-icons">info</span>
                  </template>
                </Btn>
                <Btn v-if="store.status" type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded
                  @click="showModalConfirm(store.id, store.status)">
                  <template #icon>
                    <span class="material-icons">close</span>
                  </template>
                </Btn>
                <Btn v-else type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded
                  @click="showModalConfirm(store.id, store.status)">
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

  <!-- Modal para agregar tienda -->
  <Dialog :show="modalAdd" @update:show="modalAdd = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-gray-900">Agregar tienda</h2>
      </div>
    </template>
    <template #content>
      <div class="flex items-center">
        <Form class="pt-5 mb-4" @formSubmit="handleAdd">
          <div class="flex flex-col gap-4">
            <div class="mb-4">
              <Input required :label="'Nombre'" v-model.alfaNumChar="store.name" @clean="store.name = null" />
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <div class="mb-4">
              <Input required :label="'Persona responsable'" v-model.alfa="store.nameLinkPerson"
                @clean="store.nameLinkPerson = null" />
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <div class="mb-4">
              <Input required :label="'Dirección'" v-model.alfaNumChar="store.address" @clean="store.address = null" />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row sm:gap-4">
            <div class="mb-4">
              <Input required noWhiteSpace :label="'Teléfono'" v-model.integer="phones.phone" @clean="phones.phone = null"
                :rules="[
                  (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                ]" />
            </div>
            <div class="mb-4">
              <Input noWhiteSpace :label="'Teléfono respaldo'" v-model.integer="phones.secondphone"
                @clean="phones.secondphone = null" :rules="[
                  (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                ]" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 mt-5">
            <div class="flex-grow">
              <Btn color="bg-primary" hoverColor="hover:bg-primary" text="Guardar" rounded>
                <template #icon>
                  <span class="material-icons">save</span>
                </template>
              </Btn>
            </div>
            <Btn type="button" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="modalAdd = false">
              <template #icon>
                <span class="material-icons">close</span>
              </template>
            </Btn>
          </div>
        </Form>
      </div>
    </template>
  </Dialog>

  <!-- Modal para editar tienda -->
  <Dialog :show="modalEdit" @update:show="modalEdit = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-black">Editar tienda</h2>
      </div>
    </template>
    <template #content>
      <div class="flex items-center">
        <Form class="pt-5 mb-4" @formSubmit="handleUpdate">
          <div class="flex flex-col gap-4">
            <div class="mb-4">
              <Input required :label="'Nombre'" v-model.alfaNumChar="storeEdit.name" @clean="storeEdit.name = null" />
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <div class="mb-4">
              <Input required :label="'Persona responsable'" v-model.alfa="storeEdit.nameLinkPerson"
                @clean="storeEdit.nameLinkPerson = null" />
            </div>
          </div>
          <div class="flex flex-col grid-cols-12 gap-4">
            <div class="mb-4">
              <Input required :label="'Dirección'" v-model.alfa="storeEdit.address" @clean="storeEdit.address = null" />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row sm:gap-4">
            <div class="mb-4">
              <Input required noWhiteSpace :label="'Teléfono'" v-model.integer="editPhones.phone"
                @clean="editPhones.phone = null" :rules="[
                  (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                ]" />
            </div>
            <div class="mb-4">
              <Input noWhiteSpace :label="'Teléfono respaldo'" v-model.integer="editPhones.secondphone"
                @clean="editPhones.secondphone = null" :rules="[
                  (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                ]" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 mt-5">
            <div class="flex-grow">
              <Btn color="bg-primary" hoverColor="hover:bg-primary" text="Guardar" rounded>
                <template #icon>
                  <span class="material-icons">save</span>
                </template>
              </Btn>
            </div>
            <Btn type="button" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="modalAdd = false">
              <template #icon>
                <span class="material-icons">close</span>
              </template>
            </Btn>
          </div>
        </Form>
      </div>
    </template>
  </Dialog>

  <!-- Modal para ver información tienda -->
  <Dialog :show="modalInfo" @update:show="modalInfo = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-gray-900">Información de tienda</h2>
      </div>
    </template>
    <template #content>
      <div class="grid grid-cols-12 items-center justify-center w-5/6 gap-6 mt-5 mb-5">
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Nombre</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              storeEdit ? storeEdit.name : "Nombre"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Nombre del responsable</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              storeEdit ? storeEdit.nameLinkPerson : "Responsable"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Dirección</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              storeEdit ? storeEdit.address : "Dirección"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Teléfonos</label>
            <label v-for="phone in storeEdit.phones" :key="phone" class="text-black dark:text-white text-lg font-title">
              {{ phone }}</label>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Estado</label>
            <div class="min-w-0">
              <span v-if="storeEdit.status"
                class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                Activo
              </span>
              <span v-else class="bg-red-200 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
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
            <Btn color="bg-primary" hoverColor="hover:bg-primary" text="Sí" rounded @click="() => handleChangeStatus()">
              <template #icon>
                <span class="material-icons">check</span>
              </template>
            </Btn>
          </div>
          <div class="col-span-6">
            <Btn type="button" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded text="No"
              @click="() => (modalConfirm = false)">
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
import { useStoresStore } from "@/modules/stores/stores/store";
import { storeToRefs } from "pinia";
import { loading } from "@/kernel/components/loading";

const showMsg = inject("showMsg", () => { });
const timeout = ref(null);
const filter = ref("");
const modalAdd = ref(false);
const modalEdit = ref(false);
const modalInfo = ref(false);
const modalConfirm = ref(false);
const storesStore = useStoresStore();
const { stores } = storeToRefs(storesStore);

const pag = ref({
  rowsPerPage: 100,
  page: 1,
});
let pendientRequest = [];
let isOnline = navigator.onLine;

const store = ref({
  name: null,
  address: null,
  nameLinkPerson: null,
  phones: [],
});

const phones = ref({
  phone: null,
  secondphone: null,
});

const storeEdit = ref({
  id: null,
  name: null,
  address: null,
  nameLinkPerson: null,
  phones: [],
});

const editPhones = ref({
  phone: null,
  secondphone: null,
});

const handleStores = async () => {
  if (filter.value !== "" && !isOnline) {
    showMsg("error", "Lo sentimos, no puedes realizar una búsqueda sin conexión");
  } else {
    try {
      loading.show();
      let payload = {
        query: {
          filter: filter.value,
          filterBy: "name",
          ...pag.value,
        },
      };
      let res = await storesStore.getStores(payload);
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
  }

};

const handleSearchInput = async (props) => {
  try {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(async () => {
      handleStores();
    }, 900);
  } catch (error) {
    showMsg("error", error);
  }
};

const handleAdd = async () => {
  try {
    let aux = [phones.value.phone];
    if (phones.value.secondphone != null) {
      aux.push(phones.value.secondphone);
    }
    let payload = {
      body: {
        ...store.value,
        phones: aux,
      },
    };
    if (!isOnline) {
      pendientRequest.push(() => storesStore.addStore(payload));
      showMsg("success", "La petición será enviada cuando se restablezca la conexión a Internet.");
      modalAdd.value = false;
    } else {
      let res = await storesStore.addStore(payload);
      if (res.data.statusCode == 200) {
        showMsg("success", "Tienda agregada correctamente");
        modalAdd.value = false;
        handleStores();
      }
    }
    store.value = {
      name: null,
      address: null,
      nameLinkPerson: null,
      phones: [],
    };
    phones.value = {
      phone: null,
      secondphone: null,
    };
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

const showModalEdit = async (store) => {
  try {
    storeEdit.value = {
      id: store.id,
      name: store.name,
      address: store.address,
      nameLinkPerson: store.nameLinkPerson,
      phones: [],
    };
    editPhones.value = {
      phone: store.phones[0],
      secondphone: store.phones[1] ? store.phones[1] : null,
    };
    modalEdit.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleUpdate = async () => {
  try {
    let aux = [editPhones.value.phone];
    if (editPhones.value.secondphone != null) {
      aux.push(editPhones.value.secondphone);
    }
    let payload = {
      id: storeEdit.value.id,
      body: {
        name: storeEdit.value.name,
        address: storeEdit.value.address,
        nameLinkPerson: storeEdit.value.nameLinkPerson,
        phones: aux,
      },
    };
    if (!isOnline) {
      pendientRequest.push(() => storesStore.updateStore(payload));
      showMsg("success", "La petición será enviada cuando se restablezca la conexión a Internet.");
      modalEdit.value = false;
    } else {
      let res = await storesStore.updateStore(payload);
      if (res.data.statusCode == 200) {
        showMsg("success", "Tienda actualizada correctamente");
        modalEdit.value = false;
        handleStores();
      }
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
    storeEdit.value = {
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
    if (!isOnline) {
      pendientRequest.push(() => storesStore.changeStatus(storeEdit.value.id, !storeEdit.value.status));
      showMsg("success", "La petición será enviada cuando se restablezca la conexión a Internet.");
      modalConfirm.value = false;
    } else {
      loading.show();
      let res = await storesStore.changeStatus(storeEdit.value.id, !storeEdit.value.status);

      if (res.data.statusCode == 200) {
        showMsg("success", res.data.message);
        modalConfirm.value = false;
        handleStores();
      }
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

const selectedRow = async (store) => {
  try {
    storeEdit.value = {
      id: store.id,
      name: store.name,
      address: store.address,
      nameLinkPerson: store.nameLinkPerson,
      status: store.status,
      phones: store.phones,
    };
    modalInfo.value = true;
  } catch (error) {
    console.log(error);
  }
};

const showOnlineAlert = async () => {
  showMsg("success", "La conexión a Internet ha sido restablecida.");
  isOnline = true;
  await Promise.all(pendientRequest.map(async (request) => {
    await request();
  }));
  pendientRequest = [];
  await handleStores();
}
const showOfflineAlert = () => {
  showMsg("error", "La conexión a Internet se ha perdido.");
  isOnline = false;
}

onMounted(() => {
  window.addEventListener('online', showOnlineAlert);
  window.addEventListener('offline', showOfflineAlert);
  handleStores();
});
</script>