<template>
  <ContentSection>
    <template #title> Recolecciones </template>
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
              <span class="material-icons"> local_shipping </span>
            </div>
          </template>
        </Btn>
      </div>
    </template>
    <template #content>
      <div v-if="pickups.length === 0">
        <div class="flex justify-center">
          <div class="mt-10 mb-5 text-gray-500 text-2xl">
            No hay recolecciones registradas
          </div>
        </div>
      </div>

      <div
        v-if="pickups.length > 0"
        class="grid grid-cols-12 gap-4 px-2 items-stretch"
      >
        <Collapse v-for="pickup in pickups" :key="pickup.id">
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
                  >local_shipping</span
                >
                <div class="ml-2 flex-grow min-w-0">
                  <div class="font-semibold break-words truncate">
                    {{ pickup.name }}
                  </div>
                  <span
                    v-if="pickup.status === 'Pendiente'"
                    class="bg-yellow-200 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900"
                  >
                    Pendiente
                  </span>
                  <span
                    v-if="pickup.status === 'En proceso'"
                    class="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900"
                  >
                    En proceso
                  </span>
                  <span
                    v-if="pickup.status === 'Finalizada'"
                    class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900"
                  >
                    Finalizada
                  </span>
                  <span
                    v-if="pickup.status === 'Cancelada'"
                    class="bg-red-200 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900"
                  >
                    Cancelada
                  </span>
                </div>
              </div>

              <div
                class="flex-shrink-0 flex justify-end items-end space-x-2 buttons-container"
              >
                <Btn
                  v-if="pickup.status === 'Pendiente'"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalEdit(pickup)"
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
                  @click="selectedRow(pickup)"
                >
                  <template #icon>
                    <span class="material-icons">info</span>
                  </template>
                </Btn>
                <Btn
                  v-if="pickup.status === 'Pendiente'"
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalCancel(pickup)"
                >
                  <template #icon>
                    <span class="material-icons">block</span>
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
                  v-if="pickup.status === 'Pendiente'"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalEdit(pickup)"
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
                  @click="selectedRow(pickup)"
                >
                  <template #icon>
                    <span class="material-icons">info</span>
                  </template>
                </Btn>
                <Btn
                  v-if="pickup.status === 'Pendiente'"
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalCancel(pickup)"
                >
                  <template #icon>
                    <span class="material-icons">block</span>
                  </template>
                </Btn>
              </div>
            </div>
          </template>
        </Collapse>
      </div>
    </template>
  </ContentSection>

  <!-- Modal para agregar recolección -->
  <Dialog :size="sm" :show="modalAdd" @update:show="modalAdd = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-black">Agregar recolección</h2>
      </div>
    </template>
    <template #content>
      <div class="flex items-center">
        <Form class="pt-5 mb-4" @formSubmit="handleAdd">
          <div class="flex flex-col sm:grid sm:grid-cols-12 sm:gap-4">
            <div class="mb-4 sm:col-span-6">
              <Input
                required
                :label="'Nombre'"
                v-model.alfaNumChar="pickup.name"
                @clean="pickup.name = null"
              />
            </div>
            <div class="mb-4 sm:col-span-6">
              <Calendar
                :label="'Fecha para recolección'"
                v-model="pickup.date"
                @clean="pickup.date = null"
                :formatDate="'yyyy-MM-dd'"
                :formatDateStart="'yyyy-MM-dd'"
                :dateToStart="currentDate"
                required
              ></Calendar>
            </div>
          </div>
          <div class="flex flex-col sm:grid sm:grid-cols-12 sm:gap-4">
            <div class="mb-4 sm:col-span-6">
              <Select
                v-model="pickup.chain"
                @clean="pickup.chain = null"
                required
                :label="'Tienda'"
                :options="selectStores"
                :loading="selectStores === null"
              />
            </div>
            <div class="mb-4 sm:col-span-6">
              <Select
                v-model="pickup.user"
                @clean="pickup.user = null"
                required
                :options="selectUsers"
                :loading="selectUsers === null"
                :label="'Empleado'"
              />
            </div>
          </div>
          <span class="mt-3 text-lg font-bold">Productos</span>
          <hr class="bg-primary" />
          <Form @formSubmit="handleAddProduct">
            <div class="grid grid-cols-12 gap-4 mt-3">
              <div class="mb-4 col-span-6">
                <Select
                  v-model="product.product"
                  @clean="product.product = null"
                  required
                  :options="computedProducts"
                  :loading="computedProducts === null"
                  :label="'Producto'"
                />
              </div>
              <div class="mb-4 col-span-4">
                <Input
                  required
                  :label="'Cantidad'"
                  v-model.integer="product.quantity"
                  @clean="product.quantity = null"
                  :rules="[(v) => v > 0 || 'La cantidad debe ser mayor a 0']"
                />
              </div>
              <div class="mb-4 col-span-2">
                <Btn
                  type="submit"
                  color="bg-primary"
                  hoverColor="hover:bg-primary"
                  rounded
                >
                  <template #icon>
                    <div class="flex justify-center">
                      <span class="material-icons"> local_shipping </span>
                    </div>
                  </template>
                </Btn>
              </div>
            </div>
          </Form>
          <span v-if="!isProductSelected" class="text-danger text-md">
            Se debe agregar al menos un producto
          </span>
          <Table
            :columns="columns"
            :filter="search"
            :rows="products"
            serverSide
            bgColorSelected
            :totalRows="products.length"
          >
            <template v-slot:cell-name-accion="props">
              <div class="flex justify-center items-center mt-2">
                <Icon
                  name="delete_forever"
                  textColor="text-gray-600"
                  darkTextColor="dark:text-gray-600"
                  @click="handleDeleteProduct(props.rowModified)"
                ></Icon></div
            ></template>
          </Table>
          <div class="flex items-center justify-end gap-2 mt-1">
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

  <!-- Modal para editar recolección -->
  <Dialog :size="sm" :show="modalEdit" @update:show="modalEdit = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-black">Editar recolección</h2>
      </div>
    </template>
    <template #content>
      <div class="flex items-center">
        <Form class="pt-5 mb-4" @formSubmit="handleUpdate">
          <div class="flex flex-col sm:grid sm:grid-cols-12 sm:gap-4">
            <div class="mb-4 sm:col-span-6">
              <Input
                required
                :label="'Nombre'"
                v-model.alfaNumChar="pickupEdit.name"
                @clean="pickupEdit.name = null"
              />
            </div>
            <div class="mb-4 sm:col-span-6">
              <Calendar
                :label="'Fecha para recolección'"
                v-model="pickupEdit.date"
                @clean="pickupEdit.date = null"
                :formatDate="'yyyy-MM-dd'"
                :formatDateStart="'yyyy-MM-dd'"
                :dateToStart="currentDate"
                required
              ></Calendar>
            </div>
          </div>
          <div class="flex flex-col sm:grid sm:grid-cols-12 sm:gap-4">
            <div class="mb-4 sm:col-span-6">
              <Select
                v-model="pickupEdit.chain"
                @clean="pickupEdit.chain = null"
                required
                :label="'Tienda'"
                :options="selectStores"
                :loading="selectStores === null"
              />
            </div>
            <div class="mb-4 sm:col-span-6">
              <Select
                v-model="pickupEdit.user"
                @clean="pickupEdit.user = null"
                required
                :options="selectUsers"
                :loading="selectUsers === null"
                :label="'Empleado'"
              />
            </div>
          </div>
          <span class="mt-3 text-lg font-bold">Productos</span>
          <hr class="bg-primary" />
          <Form @formSubmit="handleAddProductEdit">
            <div class="grid grid-cols-12 gap-4 mt-3">
              <div class="mb-4 col-span-6">
                <Select
                  v-model="product.product"
                  @clean="product.product = null"
                  required
                  :options="computedProductsEdit"
                  :loading="computedProductsEdit === null"
                  :label="'Producto'"
                />
              </div>
              <div class="mb-4 col-span-4">
                <Input
                  required
                  :label="'Cantidad'"
                  v-model.integer="product.quantity"
                  @clean="product.quantity = null"
                  :rules="[(v) => v > 0 || 'La cantidad debe ser mayor a 0']"
                />
              </div>
              <div class="mb-4 col-span-2">
                <Btn
                  type="submit"
                  color="bg-primary"
                  hoverColor="hover:bg-primary"
                  rounded
                >
                  <template #icon>
                    <div class="flex justify-center">
                      <span class="material-icons"> local_shipping </span>
                    </div>
                  </template>
                </Btn>
              </div>
            </div>
          </Form>
          <span v-if="!isProductEditSelected" class="text-danger text-md">
            Se debe agregar al menos un producto
          </span>
          <Table
            :columns="columns"
            :filter="search"
            :rows="productsEdit.value"
            serverSide
            bgColorSelected
            :totalRows="productsEdit.value.length"
          >
            <template v-slot:cell-name-accion="props">
              <div class="flex justify-center items-center mt-2">
                <Icon
                  name="delete_forever"
                  textColor="text-gray-600"
                  darkTextColor="dark:text-gray-600"
                  @click="handleDeleteProductEdit(props.rowModified)"
                ></Icon></div
            ></template>
          </Table>

          <div class="flex items-center justify-end gap-2 mt-1">
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

  <!-- Modal para cancelar recolección -->
  <Dialog :size="sm" :show="modalCancel" @update:show="modalCancel = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-black">Cancelar recolección</h2>
      </div>
    </template>
    <template #content>
      <div class="flex flex-grow items-center">
        <Form class="pt-5 mb-4" @formSubmit="handleCancel">
          <div class="flex flex-col px-8 sm:grid sm:grid-cols-12 sm:gap-4">
            <div class="mb-2 sm:col-span-12">
              <Input
                required
                :label="'Comentarios'"
                v-model.alfaNumChar="cancel.commentary"
                @clean="cancel.commentary = null"
                textarea
              />
            </div>
            <span class="text-md font-semibold mb-4">Evidencia</span>
          </div>

          <div
            class="flex flex-wrap justify-center sm:justify-start gap-6 px-8"
          >
            <!-- Existing Images -->
            <div v-for="(image, index) in images" :key="index" class="relative">
              <img
                :src="image"
                class="w-20 h-20 sm:w-32 sm:h-32 object-cover"
              />
              <Btn
                type="button"
                color="bg-red-500"
                hoverColor="hover:bg-red-500"
                rounded
                @click="removeImage(index)"
                class="absolute top-[-7px] right-[-7px] w-7 h-7"
                :textSize="xs"
              >
                <template #icon>
                  <Icon
                    name="close"
                    textColor="fill-white"
                    darkTextColor="fill-white"
                    size="sm"
                  />
                </template>
              </Btn>
            </div>

            <!-- Upload Button -->
            <div class="flex flex-col items-center">
              <label
                class="w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center border-2 border-dashed cursor-pointer"
              >
                <input type="file" class="hidden" @change="handleFileSelect" />
                <span class="material-icons text-gray-500"
                  >add_circle_outline</span
                >
              </label>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-8 mt-5">
            <div class="flex-grow">
              <Btn
                color="bg-primary"
                hoverColor="hover:bg-primary"
                text="Cancelar"
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
              @click="modalCancel = false"
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

  <!-- Modal para ver información recolección -->
  <Dialog :show="modalInfo" @update:show="modalInfo = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-gray-900">
          Información de recolección
        </h2>
      </div>
    </template>
    <template #content>
      <div
        class="grid grid-cols-12 items-center justify-center w-5/6 gap-6 mt-5 mb-5"
      >
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Nombre</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              pickupEdit ? pickupEdit.name : "Nombre"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title"
              >Nombre del recolector</label
            >
            <label class="text-black dark:text-white text-lg font-title">{{
              pickupEdit
                ? pickupEdit.user.name +
                  " " +
                  pickupEdit.user.lastname +
                  " " +
                  (pickupEdit.user.secondSurname
                    ? pickupEdit.user.secondSurname
                    : "")
                : "Recolector"
            }}</label>
          </div>
        </div>
        <div class="col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Fecha</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              pickupEdit ? pickupEdit.date.substring(0, 10) : "Fecha"
            }}</label>
          </div>
        </div>
        <div class="col-span-6 mb-1">
          <div class="flex flex-col">
            <label class="text-primary text-md font-title">Estado</label>
            <div class="min-w-0">
              <span
                v-if="pickupEdit.status === 'Pendiente'"
                class="bg-yellow-200 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900"
              >
                Pendiente
              </span>
              <span
                v-if="pickupEdit.status === 'En proceso'"
                class="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900"
              >
                En proceso
              </span>
              <span
                v-if="pickupEdit.status === 'Finalizada'"
                class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900"
              >
                Finalizada
              </span>
              <span
                v-if="pickupEdit.status === 'Cancelada'"
                class="bg-red-200 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900"
              >
                Cancelada
              </span>
            </div>
          </div>
        </div>
        <div v-if="pickupEdit.status === 'Cancelada'" class="col-span-12 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title"
              >Comentarios de cancelación</label
            >
            <label class="text-black dark:text-white text-lg font-title">{{
              pickupEdit.generalAnnexes
                ? pickupEdit.generalAnnexes.commentary
                : "Comentarios"
            }}</label>
          </div>
        </div>
        <div
          v-if="
            pickupEdit.status === 'Cancelada' &&
            pickupEdit.generalAnnexes.photos
          "
          class="col-span-12 mb-1"
        >
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title mb-2"
              >Evidencia</label
            >
            <div
              class="flex flex-wrap justify-center sm:justify-start gap-6 px-8"
            >
              <!-- Existing Images -->
              <div
                v-for="(image, index) in pickupEdit.generalAnnexes.photos"
                :key="index"
                class="relative"
              >
                <img
                  :src="image"
                  class="w-20 h-20 sm:w-32 sm:h-32 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-if="pickupEdit.products" class="col-span-12 mb-1">
          <label class="text-primary text-md font-title">Productos</label>
          <Table
            :columns="columnsInfo"
            :rows="pickupEdit.products"
            serverSide
            bgColorSelected
            :totalRows="pickupEdit.products.length"
          >
            <template v-slot:cell-name-accion="props">
              <div class="flex justify-center items-center mt-2">
                <Icon
                  name="pending"
                  textColor="text-warning"
                  v-if="
                    pickupEdit.status === 'En proceso' ||
                    pickupEdit.status === 'Pendiente'
                  "
                ></Icon>
                <Icon
                  name="pending"
                  textColor="text-danger"
                  v-if="pickupEdit.status === 'Cancelada'"
                ></Icon>
                <Icon
                  name="pending"
                  textColor="text-secondary"
                  @click="showModalInfoProduct(props.rowModified)"
                  v-if="
                    (props.rowModified.recolected ||
                      !props.rowModified.recolected) &&
                    pickupEdit.status === 'Finalizada'
                  "
                ></Icon>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </template>
  </Dialog>

  <!-- Modal para ver información de producto de recolección -->
  <Dialog
    :show="modalInfoProduct"
    @update:show="
      () => {
        modalInfoProduct = $event;
        modalInfo = true;
      }
    "
  >
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-gray-900">
          Información de producto
        </h2>
      </div>
    </template>
    <template #content>
      <div
        class="grid grid-cols-12 items-center justify-center w-5/6 gap-6 mt-5 mb-5"
      >
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Nombre</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              productSelected ? productSelected.product.product.name : "Nombre"
            }}</label>
          </div>
        </div>
        <div class="col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title"
              >Fecha de recolección</label
            >
            <label class="text-black dark:text-white text-lg font-title">{{
              productSelected ? pickupEdit.date.substring(0, 10) : "Fecha"
            }}</label>
          </div>
        </div>
        <div class="col-span-6 mb-1">
          <div class="flex flex-col">
            <label class="text-primary text-md font-title">Estado</label>
            <div class="min-w-0">
              <span
                v-if="productSelected.product.product.recolected"
                class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
              >
                Recolectado
              </span>
              <span
                v-else
                class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
              >
                No recolectado
              </span>
            </div>
          </div>
        </div>
        <div class="col-span-12 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Comentarios</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              productSelected.product.product.annexes
                ? productSelected.product.product.annexes.commentary
                : "Comentarios"
            }}</label>
          </div>
        </div>
        <div
          v-if="
            productSelected.product.product.annexes.photos &&
            productSelected.product.product.annexes.photos.length > 0
          "
          class="col-span-12 mb-1"
        >
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title mb-2"
              >Evidencia</label
            >
            <div
              class="flex flex-wrap justify-center sm:justify-start gap-6 px-8"
            >
              <!-- Existing Images -->
              <div
                v-for="(image, index) in productSelected.product.product.annexes
                  .photos"
                :key="index"
                class="relative"
              >
                <img
                  :src="image"
                  class="w-20 h-20 sm:w-32 sm:h-32 object-cover"
                />
              </div>
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
            ¿Estás seguro de cambioar el estado?
          </span>
        </div>
        <div class="grid grid-cols-12 gap-1">
          <div class="col-span-6">
            <Btn
              color="bg-primary"
              hoverColor="hover:bg-primary"
              text="Sí"
              rounded
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
import { inject, ref, onMounted, reactive, computed } from "vue";
import { useStoresStore } from "@/modules/stores/stores/store";
import { useUsersStore } from "@/modules/employees/stores/user";
import { useProductsStore } from "@/modules/products/stores/product";
import { usePickupsStore } from "@/modules/pickups/stores/pickup";
import { storeToRefs } from "pinia";
import { loading } from "@/kernel/components/loading";

const showMsg = inject("showMsg", () => {});
const timeout = ref(null);
const filter = ref("");
const modalAdd = ref(false);
const modalEdit = ref(false);
const modalInfo = ref(false);
const modalCancel = ref(false);
const modalConfirm = ref(false);
const modalInfoProduct = ref(false);
const storesStore = useStoresStore();
const usersStore = useUsersStore();
const productsStore = useProductsStore();
const pickupsStore = usePickupsStore();
const { pickups } = storeToRefs(pickupsStore);

let pendientRequest = [];
let isOnline = navigator.onLine;

//selects
const selectStores = ref(null);
const selectUsers = ref(null);
const selectProducts = ref(null);
const selectProductsEdit = ref(null);

const selectedProduct = ref(null);
const productSelected = ref({});
const products = reactive([]);
const productsEdit = reactive([]);
const product = ref({
  product: null,
  quantity: null,
  index: null,
});

const columns = computed(() => [
  {
    title: "#",
    field: "index",
    format: (val) => val,
    required: true,
  },
  {
    title: "Nombre",
    field: "product",
    format: (val) => val.name,
    required: true,
  },
  {
    title: "Cantidad",
    field: "quantity",
    format: (val) => val,
    required: true,
  },
  {
    title: "Eliminar",
    field: "accion",
    format: (val) => val,
    required: true,
  },
]);

const columnsInfo = computed(() => [
  {
    title: "#",
    field: "index",
    format: (val) => val,
    required: true,
  },
  {
    title: "Nombre",
    field: "name",
    format: (val) => val,
    required: true,
  },
  {
    title: "Cantidad",
    field: "quantity",
    format: (val) => val,
    required: true,
  },
  {
    title: "Estado",
    field: "recolected",
    format: (val) => (val ? "Recolectado" : "No recolectado"),
    required: true,
  },
  {
    title: "Ver más",
    field: "accion",
    format: (val) => val,
    required: true,
  },
]);

const pag = ref({
  rowsPerPage: 100,
  page: 1,
});

const pickup = ref({
  name: null,
  date: null,
  chain: null,
  user: null,
  products: [],
});

const pickupEdit = ref({
  id: null,
  name: null,
  date: null,
  chain: null,
  user: {},
  products: [],
  generalAnnexes: {
    commentary: null,
    photos: [],
  },
});

const cancel = ref({
  id: null,
  commentary: null,
  photos: [],
});

function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  console.log(`${year}-${month}-${day}`);
  return `${year}-${month}-${day}`;
}

const currentDate = ref(getFormattedDate());

const handlePickups = async () => {
  if (filter.value !== "" && !isOnline) {
    showMsg(
      "error",
      "Lo sentimos, no puedes realizar una búsqueda sin conexión"
    );
  } else {
    try {
      loading.show();
      let payload = {
        query: {
          filter: filter.value,
          ...pag.value,
        },
      };
      let res = await pickupsStore.getPickups(payload);
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

const showStores = async () => {
  try {
    let payload = {
      query: {
        ...pag.value,
      },
    };
    let res = await storesStore.getStores(payload);
    console.log(res);
    if (res.chains) {
      selectStores.value = res.chains.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    }
  } catch (error) {
    if (error.code == "ERR_NETWORK") {
      showMsg("error", "Error de conexión");
    } else {
      console.log(error);
      showMsg("error", "Error interno del servidor");
    }
  }
};

const showUsers = async () => {
  try {
    let payload = {
      query: {
        ...pag.value,
      },
    };
    let res = await usersStore.getEmployees(payload);
    console.log(res);
    if (res.employees) {
      selectUsers.value = res.employees.map((item) => {
        return {
          label:
            item.name +
            " " +
            item.lastname +
            " " +
            (item.secondSurname ? item.secondSurname : ""),
          value: item.id,
        };
      });
    }
  } catch (error) {
    if (error.code == "ERR_NETWORK") {
      showMsg("error", "Error de conexión");
    } else {
      console.log(error);
      showMsg("error", "Error interno del servidor");
    }
  }
};

const showProducts = async () => {
  try {
    let payload = {
      query: {
        ...pag.value,
        status: "true",
      },
    };
    let res = await productsStore.getProducts(payload);
    if (res.products) {
      selectProducts.value = res.products;
      selectProductsEdit.value = res.products;
    }
  } catch (error) {
    if (error.code == "ERR_NETWORK") {
      showMsg("error", "Error de conexión");
    } else {
      console.log(error);
      showMsg("error", "Error interno del servidor");
    }
  }
};

const computedProducts = computed(() => {
  selectProducts.value = selectProducts.value.filter((item) => {
    return !products.some((product) => {
      return product.product.id == item.id;
    });
  });

  return selectProducts.value.map((item) => {
    return {
      label: item.name,
      value: item,
    };
  });
});

const computedProductsEdit = computed(() => {
  selectProductsEdit.value = selectProductsEdit.value.filter((item) => {
    return !productsEdit.value.some((product) => {
      return product.product.id == item.id;
    });
  });

  return selectProductsEdit.value.map((item) => {
    return {
      label: item.name,
      value: item,
    };
  });
});

const handleAddProduct = async () => {
  try {
    let aux = {
      product: product.value.product,
      quantity: product.value.quantity,
      index: products.length + 1,
    };
    products.push(aux);
    product.value = {
      product: null,
      quantity: null,
    };
  } catch (error) {
    console.error(error);
  }
};

const handleAddProductEdit = async () => {
  try {
    let aux = {
      product: product.value.product,
      quantity: product.value.quantity,
      index: productsEdit.value.length + 1,
    };
    productsEdit.value.push(aux);
    product.value = {
      product: null,
      quantity: null,
    };
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteProduct = (product) => {
  try {
    selectedProduct.value = product;
    let aux = products.filter((item) => {
      return item.index == selectedProduct.value.index;
    });
    selectProducts.value = [...selectProducts.value, aux[0].product];
    let aux2 = products.findIndex((item) => {
      return item.index == selectedProduct.value.index;
    });
    if (aux2 > -1) {
      products.splice(aux2, 1);
    }
    products.forEach((item, index) => {
      item.index = index + 1;
    });
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteProductEdit = (product) => {
  try {
    selectedProduct.value = product;
    let aux = productsEdit.value.filter((item) => {
      return item.index == selectedProduct.value.index;
    });
    selectProductsEdit.value = [...selectProductsEdit.value, aux[0].product];
    let aux2 = productsEdit.value.findIndex((item) => {
      return item.index == selectedProduct.value.index;
    });
    if (aux2 > -1) {
      productsEdit.value.splice(aux2, 1);
    }
    productsEdit.value.forEach((item, index) => {
      item.index = index + 1;
    });
  } catch (error) {
    console.error(error);
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

const isProductSelected = computed(() => {
  if (products.length == 0) {
    return false;
  } else {
    return true;
  }
});

const isProductEditSelected = computed(() => {
  if (productsEdit.value.length == 0) {
    return false;
  } else {
    return true;
  }
});

const handleAdd = async () => {
  try {
    if (!isProductSelected.value) {
      return;
    }
    loading.show();
    let aux = products.map((item) => {
      return {
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
      };
    });
    let payload = {
      body: {
        name: pickup.value.name,
        date: pickup.value.date,
        chain: pickup.value.chain,
        user: pickup.value.user,
        products: aux,
      },
    };

    if (!isOnline) {
      pendientRequest.push(() => pickupsStore.addPickup(payload));
      showMsg(
        "success",
        "La petición será enviada cuando se restablezca la conexión a Internet."
      );
    } else {
      let res = await pickupsStore.addPickup(payload);
      if (res.data.statusCode == 200) {
        showMsg("success", "Recolección agregada correctamente");
      }
    }

    modalAdd.value = false;
    products.length = 0;
    pickup.value = {
      name: null,
      date: null,
      chain: null,
      user: null,
      products: [],
    };
    handlePickups();
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

const showModalEdit = async (pickup) => {
  try {
    console.log("pickup", pickup);
    let aux = 0;
    let productsAux = pickup.products.map((item) => {
      aux = aux + 1;
      return {
        index: aux,
        product: {
          id: item.id,
          name: item.name,
        },
        quantity: item.quantity,
      };
    });

    pickupEdit.value = {
      id: pickup.id,
      status: pickup.status,
      name: pickup.name,
      date: pickup.date.substring(0, 10),
      chain: pickup.chain._id,
      user: pickup.user._id,
      products: productsAux,
    };
    productsEdit.value = productsAux;
    console.log("productsEdit", productsEdit);
    modalEdit.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleUpdate = async () => {
  try {
    if (!isProductEditSelected.value) {
      return;
    }
    loading.show();
    let aux = productsEdit.value.map((item) => {
      return {
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
      };
    });
    let payload = {
      id: pickupEdit.value.id,
      body: {
        name: pickupEdit.value.name,
        date: pickupEdit.value.date,
        chain: pickupEdit.value.chain,
        user: pickupEdit.value.user,
        products: aux,
      },
    };

    if (!isOnline) {
      pendientRequest.push(() => pickupsStore.updatePickup(payload));
      showMsg(
        "success",
        "La petición será enviada cuando se restablezca la conexión a Internet."
      );
      modalEdit.value = false;
    } else {
      let res = await pickupsStore.updatePickup(payload);
      if (res.data.statusCode == 200) {
        showMsg("success", "Recolección modificada correctamente");
        modalEdit.value = false;
        handlePickups();
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

const showModalCancel = async (pickup) => {
  try {
    cancel.value = {
      id: pickup.id,
      commentary: null,
      photos: [],
    };
    modalCancel.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleCancel = async () => {
  try {
    let payload = {
      id: cancel.value.id,
      body: {
        generalAnnexes: {
          commentary: cancel.value.commentary,
        },
      },
    };
    if (images.value.length > 0) {
      payload.body.generalAnnexes = {
        commentary: cancel.value.commentary,
        photos: images.value,
      };
    }

    if (!isOnline) {
      pendientRequest.push(() => pickupsStore.cancelPickup(payload));
      showMsg(
        "success",
        "La petición será enviada cuando se restablezca la conexión a Internet."
      );
      modalCancel.value = false;
    } else {
      let res = await pickupsStore.cancelPickup(payload);
      if (res.data.statusCode == 200) {
        showMsg("success", "Recolección cancelada correctamente");
        modalCancel.value = false;
        handlePickups();
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

const selectedRow = async (pickup) => {
  try {
    let aux = 0;
    let productsAux = pickup.products.map((item) => {
      aux = aux + 1;
      return {
        index: aux,
        product: item,
        name: item.name,
        recolected: item.recolected,
        quantity: item.quantity,
      };
    });

    pickupEdit.value = {
      id: pickup.id,
      name: pickup.name,
      status: pickup.status,
      date: pickup.date,
      chain: pickup.chain.id,
      user: pickup.user,
      products: productsAux,
      generalAnnexes: {
        commentary: pickup.generalAnnexes
          ? pickup.generalAnnexes.commentary
          : null,
        photos: pickup.generalAnnexes ? pickup.generalAnnexes.photos : [],
      },
    };
    modalInfo.value = true;
  } catch (error) {
    console.log(error);
  }
};

const showModalInfoProduct = async (product) => {
  try {
    productSelected.value = {
      pickup: pickup,
      product: product,
    };
    modalInfo.value = false;
    modalInfoProduct.value = true;
  } catch (error) {
    console.log(error);
  }
};

// Subir imágenes
const images = ref([]);

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files) {
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        images.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
};

const removeImage = (index) => {
  images.value.splice(index, 1);
};

const showOnlineAlert = async () => {
  showMsg("success", "La conexión a Internet ha sido restablecida.");
  isOnline = true;
  await Promise.all(
    pendientRequest.map(async (request) => {
      await request();
    })
  );
  pendientRequest = [];
  await handlePickups();
};

const showOfflineAlert = () => {
  showMsg("error", "La conexión a Internet se ha perdido.");
  isOnline = false;
};

onMounted(() => {
  window.addEventListener("online", showOnlineAlert);
  window.addEventListener("offline", showOfflineAlert);
  handlePickups();
  showStores();
  showUsers();
  showProducts();
});
</script>