<template>
    <ContentSection>
      <template #title> Colonias </template>
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
                <span class="material-icons">  other_houses </span>
              </div>
            </template>
          </Btn>
        </div>
      </template>
      <template #content>
        <div v-if="neighborhoods.length === 0">
          <div class="flex justify-center">
            <div class="mt-10 mb-5 text-gray-500 text-2xl">
              No hay colonias registradas
            </div>
          </div>
        </div>
  
        <div
          v-if="neighborhoods.length > 0"
          class="grid grid-cols-12 gap-4 px-2 items-stretch"
        >
          <Collapse v-for="neighborhood in neighborhoods" :key="neighborhood.id">
            <template #content>
              <div
                class="bg-white p-2 shadow-md flex flex-col rounded-lg rounded-collapse-top"
              >
                <div class="flex flex-row shrink-0 mr-2 items-center justify-center">
                  <span
                    class="material-icons text-primary"
                    style="font-size: 4rem"
                    > other_houses</span
                  >
                  <div class="ml-2 flex-grow min-w-0">
                  <div class="font-semibold break-words truncate">
                    {{ neighborhood.name }}
                  </div>
                  <div class="text-gray-600 break-words truncate">
                    {{ "Responsable: " + neighborhood.nameLinkPerson }}
                  </div>
                  <span
                    v-if="neighborhood.status"
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
                    @click="showModalEdit(neighborhood)"
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
                    @click="selectedRow(neighborhood)"
                  >
                    <template #icon>
                      <span class="material-icons">info</span>
                    </template>
                  </Btn>
                  <Btn
                    v-if="neighborhood.status"
                    type="submit"
                    color="bg-gray-200"
                    hoverColor="hover:bg-gray-200"
                    rounded
                    @click="handleChangeStatus(neighborhood.id, neighborhood.status)"
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
                    @click="handleChangeStatus(neighborhood.id, neighborhood.status)"
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
                    @click="showModalEdit(neighborhood)"
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
                    @click="selectedRow(neighborhood)"
                  >
                    <template #icon>
                      <span class="material-icons">info</span>
                    </template>
                  </Btn>
                  <Btn
                    v-if="neighborhood.status"
                    type="submit"
                    color="bg-gray-200"
                    hoverColor="hover:bg-gray-200"
                    rounded
                    @click="handleChangeStatus(neighborhood.id, neighborhood.status)"
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
                    @click="handleChangeStatus(neighborhood.id, neighborhood.status)"
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
  
    <!-- Modal para agregar colonia -->
    <Dialog :show="modalAdd" @update:show="modalAdd = $event">
      <template #title>
        <div class="flex justify-center">
          <h2 class="text-2xl font-bold text-gray-900">Agregar colonia</h2>
        </div>
      </template>
      <template #content>
        <div class="flex items-center">
          <Form class="pt-5 mb-4" @formSubmit="handleAdd">
            <div class="flex flex-col gap-4">
              <div class="mb-4">
                <Input
                  required
                  :label="'Nombre'"
                  v-model.alfa="neighborhood.name"
                  @clean="neighborhood.name = null"
                />
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <div class="mb-4">
                <Input
                  required
                  :label="'Persona responsable'"
                  v-model.alfa="neighborhood.nameLinkPerson"
                  @clean="neighborhood.nameLinkPerson = null"
                />
              </div>
            </div>
            <div class="flex flex-col grid-cols-12 gap-4">
              <div class="mb-4">
                <Input
                  required
                  :label="'Dirección'"
                  v-model.alfaNumChar="neighborhood.reference"
                  @clean="neighborhood.reference = null"
                />
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:gap-4">
              <div class="mb-4">
                <Input
                  required
                  noWhiteSpace
                  :label="'Teléfono'"
                  v-model.integer="phones.phone"
                  @clean="phones.phone = null"
                  :rules="[
                    (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                  ]"
                />
              </div>
              <div class="mb-4">
                <Input
                  noWhiteSpace
                  :label="'Teléfono respaldo'"
                  v-model.integer="phones.secondphone"
                  @clean="phones.secondphone = null"
                  :rules="[
                    (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                  ]"
                />
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 mt-5">
              <Btn color="bg-primary" hoverColor="hover:bg-primary" rounded>
                <template #icon>
                  <span class="material-icons">save</span>
                </template>
              </Btn>
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
  
    <!-- Modal para editar colonia -->
    <Dialog :show="modalEdit" @update:show="modalEdit = $event">
      <template #title>
        <div class="flex justify-center">
          <h2 class="text-2xl font-bold text-black">Editar colonia</h2>
        </div>
      </template>
      <template #content>
        <div class="flex items-center">
          <Form class="pt-5 mb-4" @formSubmit="handleUpdate">
            <div class="flex flex-col gap-4">
              <div class="mb-4">
                <Input
                  required
                  :label="'Nombre'"
                  v-model.alfa="neighborhoodEdit.name"
                  @clean="neighborhoodEdit.name = null"
                />
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <div class="mb-4">
                <Input
                  required
                  :label="'Persona responsable'"
                  v-model.alfa="neighborhoodEdit.nameLinkPerson"
                  @clean="neighborhoodEdit.nameLinkPerson = null"
                />
              </div>
            </div>
            <div class="flex flex-col grid-cols-12 gap-4">
              <div class="mb-4">
                <Input
                  required
                  :label="'Dirección'"
                  v-model.alfa="neighborhoodEdit.reference"
                  @clean="neighborhoodEdit.reference = null"
                />
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:gap-4">
              <div class="mb-4">
                <Input
                  required
                  noWhiteSpace
                  :label="'Teléfono'"
                  v-model.integer="editPhones.phone"
                  @clean="editPhones.phone = null"
                  :rules="[
                    (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                  ]"
                />
              </div>
              <div class="mb-4">
                <Input
                  noWhiteSpace
                  :label="'Teléfono respaldo'"
                  v-model.integer="editPhones.secondphone"
                  @clean="editPhones.secondphone = null"
                  :rules="[
                    (v) => v.length == 10 || 'El teléfono debe tener 10 dígitos',
                  ]"
                />
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 mt-5">
              <Btn color="bg-primary" hoverColor="hover:bg-primary" rounded>
                <template #icon>
                  <span class="material-icons">save</span>
                </template>
              </Btn>
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
  
    <!-- Modal para ver información colonia -->
    <Dialog :show="modalInfo" @update:show="modalInfo = $event">
      <template #title>
        <div class="flex justify-center">
          <h2 class="text-2xl font-bold text-gray-900">Información de colonia</h2>
        </div>
      </template>
      <template #content>
        <div
          class="grid grid-cols-12 items-center justify-center w-5/6 gap-6 mt-5 mb-5"
        >
          <div class="col-span-12 sm:col-span-6 mb-1">
            <div class="flex flex-col flex-grow">
              <label class="text-primary text-sm font-title">Nombre</label>
              <label class="text-black dark:text-white text-lg font-title">{{
                neighborhoodEdit ? neighborhoodEdit.name : "Nombre"
              }}</label>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 mb-1">
            <div class="flex flex-col flex-grow">
              <label class="text-primary text-sm font-title"
                >Nombre del responsable</label
              >
              <label class="text-black dark:text-white text-lg font-title">{{
                neighborhoodEdit ? neighborhoodEdit.nameLinkPerson : "Responsable"
              }}</label>
            </div>
          </div>
          <div class="col-span-12 mb-1">
            <div class="flex flex-col flex-grow">
              <label class="text-primary text-sm font-title">Dirección</label>
              <label class="text-black dark:text-white text-lg font-title">{{
                neighborhoodEdit ? neighborhoodEdit.reference : "Dirección"
              }}</label>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 mb-1">
            <div class="flex flex-col flex-grow">
              <label class="text-primary text-sm font-title">Teléfonos</label>
              <label
                v-for="phone in neighborhoodEdit.phones"
                :key="phone"
                class="text-black dark:text-white text-lg font-title"
              >
                {{ phone }}</label
              >
            </div>
          </div>
          <div class="col-span-12 sm:col-span-6 mb-1">
            <div class="flex flex-col flex-grow">
              <label class="text-primary text-sm font-title">Estado</label>
              <label class="text-black dark:text-white text-lg font-title">{{
                neighborhoodEdit ? (neighborhoodEdit.status ? "Activo" : "Inactivo") : "Estado"
              }}</label>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </template>
      
    <script setup>
  import { inject, ref, onMounted } from "vue";
  import { useNeighborhoodStore } from "@/modules/neighborhood/stores/neighborhood";
  import { storeToRefs } from "pinia";
  
  const showMsg = inject("showMsg", () => {});
  const timeout = ref(null);
  const filter = ref("");
  const modalAdd = ref(false);
  const modalEdit = ref(false);
  const modalInfo = ref(false);
  const neighborhoodStore = useNeighborhoodStore();
  const { neighborhoods } = storeToRefs(neighborhoodStore);
  
  const pag = ref({
    rowsPerPage: 100,
    page: 1,
  });
  
  const neighborhood = ref({
    name: null,
    reference: null,
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
    reference: null,
    nameLinkPerson: null,
    phones: [],
  });

  const neighborhoodEdit = ref({
    name: null,
    reference: null,
    nameLinkPerson: null,
    phones: [],
  });
  
  const editPhones = ref({
    phone: null,
    secondphone: null,
  });
  
  const handleNeighborhoods = async () => {
    try {
      let payload = {
        query: {
          filter: filter.value,
          ...pag.value,
        },
      };
      let res = await neighborhoodStore.getNeighborhoods(payload);
    } catch (error) {
      if (error.code == "ERR_NETWORK") {
        showMsg("error", "Error de conexión");
      } else {
        console.log(error);
        showMsg("error", "Error interno del servidor");
      }
    }
  };
  
  const handleSearchInput = async (props) => {
    try {
      clearTimeout(timeout.value);
      timeout.value = setTimeout(async () => {
        handleNeighborhoods();
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
          ...neighborhood.value,
          phones: aux,
        },
      };
      console.log(payload);
      let res = await neighborhoodStore.addNeighborhood(payload);
      if (res.data.statusCode == 200) {
        showMsg("success", "Tienda agregada correctamente");
        modalAdd.value = false;
        neighborhood.value = {
          name: null,
          reference: null,
          nameLinkPerson: null,
          status: null,
          phones: [],
        };
        phones.value = {
          phone: null,
          secondphone: null,
        };
        handleNeighborhoods();
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
  
  const showModalEdit = async (neighborhood) => {
    try {
      neighborhoodEdit.value = {
        id: neighborhood.id,
        name: neighborhood.name,
        reference: neighborhood.reference,
        nameLinkPerson: neighborhood.nameLinkPerson,
        phones: [],
      };
      editPhones.value = {
        phone: neighborhood.phones[0],
        secondphone: neighborhood.phones[1] ? neighborhood.phones[1] : null,
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
        id: neighborhoodEdit.value.id,
        body: {
          name: neighborhoodEdit.value.name,
          reference: neighborhoodEdit.value.reference,
          nameLinkPerson: neighborhoodEdit.value.nameLinkPerson,
          phones: aux,
        },
      };
      console.log(payload);
      let res = await neighborhoodStore.updateNeighborhood(payload);
      if (res.data.statusCode == 200) {
        showMsg("success", "Tienda actualizada correctamente");
        modalEdit.value = false;
        handleNeighborhoods();
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
  
  const handleChangeStatus = async (id, status) => {
    try {
      let res = await neighborhoodStore.changeStatus(id, !status);
      if (res.data.statusCode == 200) {
        showMsg("success", "Estado actualizado correctamente");
        handleNeighborhoods();
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
  
  const selectedRow = async (neighborhood) => {
    try {
      neighborhoodEdit.value = {
        id: neighborhood.id,
        name: neighborhood.name,
        reference: neighborhood.reference,
        nameLinkPerson: neighborhood.nameLinkPerson,
        status: neighborhood.status,
        phones: neighborhood.phones,
      };
      modalInfo.value = true;
    } catch (error) {
      console.log(error);
    }
  };
  
  onMounted(() => {
    handleNeighborhoods();
  });
  </script>