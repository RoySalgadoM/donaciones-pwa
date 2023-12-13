<template>
  <ContentSection>
    <template #title> Perfil </template>
    <template #content>
      <div class="grid grid-cols-12 gap-4">
        <div class="mb-4 col-span-3">
          <div class="flex flex-row items-center justify-center">
            <span class="material-icons text-primary" style="font-size: 10rem"
              >account_circle</span
            >
          </div>
        </div>
        <div class="mb-4 col-span-9">
          <div class="text-xl font-semibold break-words truncate mb-2">
            {{ "Miriam Guadalupe Saucedo Bustamante" }}
          </div>
          <div class="text-lg font-normal break-words truncate mb-2">
            {{ "Correo electrónico: miriam@gmail.com" }}
          </div>
          <div class="text-lg font-normal break-words truncate mb-2">
            {{ "Teléfono: 7771888263" }}
          </div>
          <div class="text-lg font-normal break-words truncate mb-2">
            {{ "Teléfono: 7771888263" }}
          </div>
        </div>
      </div>
    </template>
  </ContentSection>
</template>
      
    <script setup>
import { inject } from "vue";
import { ref, onMounted } from "vue";
import { useProductsStore } from "@/modules/products/stores/product";
import { storeToRefs } from "pinia";
import { loading } from "@/kernel/components/loading";

const showMsg = inject("showMsg", () => {});
const timeout = ref(null);
const filter = ref("");
const modalAdd = ref(false);
const modalEdit = ref(false);
const modalInfo = ref(false);
const productsStore = useProductsStore();
const { products, pagination } = storeToRefs(productsStore);

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
  try {
    loading.show();
    let payload = {
      query: {
        filter: filter.value,
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
    let res = await productsStore.updateProduct(payload);
    if (res.data.statusCode == 200) {
      showMsg("success", "Producto actualizado correctamente");
      modalEdit.value = false;
      handleProducts();
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

const handleAdd = async () => {
  try {
    console.log(product.value);
    let payload = {
      body: {
        ...product.value,
      },
    };
    let res = await productsStore.addProduct(payload);
    if (res.data.statusCode == 200) {
      showMsg("success", "Producto agregado correctamente");
      modalAdd.value = false;
      product.value = {
        name: "",
      };
      handleProducts();
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
    let res = await productsStore.changeStatus(id, !status);
    if (res.data.statusCode == 200) {
      showMsg("success", "Estado actualizado correctamente");
      handleProducts();
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

onMounted(() => {
  handleProducts();
});
</script>