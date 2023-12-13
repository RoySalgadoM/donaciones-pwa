<template>
  <ContentSection>
    <template #title> Productos </template>
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
              <span class="material-icons">inventory_2</span>
            </div>
          </template>
        </Btn>
      </div>
    </template>
    <template #content>
      <div v-if="products.length === 0">
        <div class="flex justify-center">
          <div class="mt-10 mb-5 text-gray-500 text-2xl">
            No hay productos registrados
          </div>
        </div>
      </div>

      <div v-if="products.length > 0" class="grid grid-cols-12 gap-4 px-2">
        <Collapse v-for="product in products" :key="product.id">
          <template #content>
            <div class="bg-white p-2 shadow-md flex flex-col rounded-lg rounded-collapse-top">
              <div class="flex flex-row shrink-0 mr-2 items-center justify-center">
                <span class="material-icons text-primary" style="font-size: 3rem">inventory_2</span>
                <div class="ml-2 flex-grow min-w-0">
                  <div class="font-semibold truncate">
                    {{ product.name }}
                  </div>
                  <span v-if="product.status"
                    class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                    Activo
                  </span>
                  <span v-else
                    class="bg-red-200 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                    Inactivo
                  </span>
                </div>
              </div>

              <div class="flex-shrink-0 flex space-x-2 justify-end items-end buttons-container">
                <Btn color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="showModalEdit(product)">
                  <template #icon>
                    <span class="material-icons">edit</span>
                  </template>
                </Btn>
                <Btn v-if="product.status" type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded
                  @click="showModalConfirm(product.id, product.status)">
                  <template #icon>
                    <span class="material-icons">close</span>
                  </template>
                </Btn>
                <Btn v-else type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded
                  @click="showModalConfirm(product.id, product.status)">
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
                <Btn color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="showModalEdit(product)">
                  <template #icon>
                    <span class="material-icons">edit</span>
                  </template>
                </Btn>
                <Btn v-if="product.status" type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded
                  @click="showModalConfirm(product.id, product.status)">
                  <template #icon>
                    <span class="material-icons">close</span>
                  </template>
                </Btn>
                <Btn v-else type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded
                  @click="showModalConfirm(product.id, product.status)">
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

  <!-- Modal para agregar producto -->
  <Dialog size="sm" :show="modalAdd" @update:show="modalAdd = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-xl font-bold text-gray-900">Agregar producto</h2>
      </div>
    </template>
    <template #content>
      <div class="flex items-center">
        <Form class="pt-5 mb-4" @formSubmit="handleAdd">
          <div class="mb-4">
            <Input required :label="'Nombre'" v-model="product.name" @clean="product.name = null" />
          </div>
          <div class="flex items-center justify-end gap-2">
            <div class="flex-grow">
              <Btn color="bg-primary" hoverColor="hover:bg-primary" text="Guardar" rounded>
                <template #icon>
                  <span class="material-icons">save</span>
                </template>
              </Btn>
            </div>
            <Btn type="submit" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="modalAdd = false">
              <template #icon>
                <span class="material-icons">close</span>
              </template>
            </Btn>
          </div>
        </Form>
      </div>
    </template>
  </Dialog>

  <!-- Modal para editar producto -->
  <Dialog size="sm" :show="modalEdit" @update:show="modalEdit = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-xl font-bold text-gray-900">Editar producto</h2>
      </div>
    </template>
    <template #content>
      <div class="flex items-center">
        <Form class="pt-5 mb-4" @formSubmit="handleUpdate">
          <div class="mb-4">
            <Input required :label="'Nombre'" v-model="productEdit.name" @clean="productEdit.name = null" />
          </div>
          <div class="flex items-center justify-end gap-2">
            <div class="flex-grow">
              <Btn color="bg-primary" hoverColor="hover:bg-primary" text="Guardar" rounded>
                <template #icon>
                  <span class="material-icons">save</span>
                </template>
              </Btn>
            </div>
            <Btn type="button" color="bg-gray-200" hoverColor="hover:bg-gray-200" rounded @click="modalEdit = false">
              <template #icon>
                <span class="material-icons">close</span>
              </template>
            </Btn>
          </div>
        </Form>
      </div>
    </template>
  </Dialog>
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
import { inject } from "vue";
import { ref, onMounted } from "vue";
import { useProductsStore } from "@/modules/products/stores/product";
import { storeToRefs } from "pinia";
import { loading } from "@/kernel/components/loading";

const showMsg = inject("showMsg", () => { });
const timeout = ref(null);
const filter = ref("");
const modalAdd = ref(false);
const modalEdit = ref(false);
const modalInfo = ref(false);
const modalConfirm = ref(false);
const productsStore = useProductsStore();
const { products, pagination } = storeToRefs(productsStore);

let pendientRequest = [];
let isOnline = navigator.onLine;

const product = ref({
  name: "",
});

const productEdit = ref({
  id: "",
  name: "",
});

const pag = ref({
  rowsPerPage: 100,
  page: 1,
});

const handleProducts = async () => {
  if (filter.value !== "" && !isOnline) {
    showMsg("error", "Lo sentimos, no puedes realizar una búsqueda sin conexión");
  } else {
    try {
      loading.show();
      let payload = {
        query: {
          filter: filter.value,
          filterBy: "name",
          status: "all",
          ...pag.value,
        },
      };
      let res = await productsStore.getProducts(payload);
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

const showModalConfirm = async (id, status) => {
  try {
    productEdit.value = {
      id: id,
      status: status,
    };
    modalConfirm.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleSearchInput = async (props) => {
  try {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(async () => {
      handleProducts();
    }, 900);
  } catch (error) {
    showMsg("error", error);
  }
};

const showModalEdit = async (product) => {
  try {
    productEdit.value = {
      id: product.id,
      name: product.name,
    };
    modalEdit.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleUpdate = async () => {
  try {
    let payload = {
      id: productEdit.value.id,
      body: {
        name: productEdit.value.name,
      },
    };
    if (!isOnline) {
      pendientRequest.push(() => productsStore.updateProduct(payload));
      showMsg("success", "La petición será enviada cuando se restablezca la conexión a Internet.");
    } else {
      let res = await productsStore.updateProduct(payload);
      if (res.data.statusCode == 200) {
        showMsg("success", "Producto actualizado correctamente");
        handleProducts();
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
    modalEdit.value = false;
  }
};

const handleAdd = async () => {
  try {
    let payload = {
      body: {
        ...product.value,
      },
    };
    if (!isOnline) {
      pendientRequest.push(() => productsStore.addProduct(payload));
      showMsg("success", "La petición será enviada cuando se restablezca la conexión a Internet.");
    } else {
      let res = await productsStore.addProduct(payload);
      if (res.data.statusCode == 200) {
        showMsg("success", "Producto agregado correctamente");
        product.value = {
          name: "",
        };
        handleProducts();
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
    modalAdd.value = false;
  }
};

const handleChangeStatus = async () => {
  try {
    if (!isOnline) {
      pendientRequest.push(() => productsStore.changeStatus(productEdit.value.id, !productEdit.value.status));
      showMsg("success", "La petición será enviada cuando se restablezca la conexión a Internet.");
    } else {
      loading.show();
      let res = await productsStore.changeStatus(productEdit.value.id, !productEdit.value.status);
      if (res.data.statusCode == 200) {
        showMsg("success", "Estado actualizado correctamente");
        handleProducts();
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
    modalConfirm.value = false;
  }
};

const showOnlineAlert = async () => {
  showMsg("success", "La conexión a Internet ha sido restablecida.");
  isOnline = true;
  await Promise.all(pendientRequest.map(async (request) => {
    await request();
  }));
  pendientRequest = [];
  await handleProducts();
}
const showOfflineAlert = () => {
  showMsg("error", "La conexión a Internet se ha perdido.");
  isOnline = false;
}

onMounted(() => {
  window.addEventListener('online', showOnlineAlert);
  window.addEventListener('offline', showOfflineAlert);
  handleProducts();
});
</script>