<template>
  <ContentSection>
    <template #title> Repartos </template>
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
      <div v-if="deliveries.length === 0">
        <div class="flex justify-center">
          <div class="mt-10 mb-5 text-gray-500 text-2xl">
            No hay repartos registrados
          </div>
        </div>
      </div>

      <div
        v-if="deliveries.length > 0"
        class="grid grid-cols-12 gap-4 px-2 items-stretch"
      >
        <Collapse v-for="delivery in deliveries" :key="delivery.id">
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
                    {{ delivery.name }}
                  </div>
                  <span
                    v-if="delivery.status === 'Pendiente'"
                    class="bg-yellow-200 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900"
                  >
                    Pendiente
                  </span>
                  <span
                    v-if="delivery.status === 'En proceso'"
                    class="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900"
                  >
                    En proceso
                  </span>
                  <span
                    v-if="delivery.status === 'Finalizada'"
                    class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900"
                  >
                    Finalizada
                  </span>
                  <span
                    v-if="delivery.status === 'Cancelada'"
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
                  v-if="delivery.status === 'Pendiente'"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalEdit(delivery)"
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
                  @click="selectedRow(delivery)"
                >
                  <template #icon>
                    <span class="material-icons">info</span>
                  </template>
                </Btn>
                <Btn
                  v-if="delivery.status === 'Pendiente'"
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalCancel(delivery)"
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
                  v-if="delivery.status === 'Pendiente'"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalEdit(delivery)"
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
                  @click="selectedRow(delivery)"
                >
                  <template #icon>
                    <span class="material-icons">info</span>
                  </template>
                </Btn>
                <Btn
                  v-if="delivery.status === 'Pendiente'"
                  type="submit"
                  color="bg-gray-200"
                  hoverColor="hover:bg-gray-200"
                  rounded
                  @click="showModalCancel(delivery)"
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

  <!-- Modal para agregar reparto -->
  <Dialog :size="sm" :show="modalAdd" @update:show="modalAdd = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-black">Agregar reparto</h2>
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
                v-model.alfaNumChar="delivery.name"
                @clean="delivery.name = null"
              />
            </div>
            <div class="mb-4 sm:col-span-6">
              <Calendar
                :label="'Fecha para reparto'"
                v-model="delivery.date"
                @clean="delivery.date = null"
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
                v-model="delivery.user"
                @clean="delivery.user = null"
                required
                :options="selectUsers"
                :loading="selectUsers === null"
                :label="'Empleado'"
              />
            </div>
          </div>
          <span class="mt-3 text-lg font-bold">Colonias</span>
          <hr class="bg-primary" />
          <Form @formSubmit="handleAddNeighborhood">
            <div class="grid grid-cols-12 gap-4 mt-3">
              <div class="mb-4 col-span-10">
                <Select
                  v-model="neighborhood.neighborhood"
                  @clean="neighborhood.neighborhood = null"
                  required
                  :options="computedNeighborhoods"
                  :loading="computedNeighborhoods === null"
                  :label="'Colonia'"
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
          <span v-if="!isNeighborhoodSelected" class="text-danger text-md">
            Se debe agregar al menos una colonia
          </span>
          <Table
            :columns="columns"
            :filter="search"
            :rows="neighborhoods"
            serverSide
            bgColorSelected
            :totalRows="neighborhoods.length"
          >
            <template v-slot:cell-name-accion="props">
              <div class="flex justify-center items-center mt-2">
                <Icon
                  name="delete_forever"
                  textColor="text-gray-600"
                  darkTextColor="dark:text-gray-600"
                  @click="handleDeleteNeighborhood(props.rowModified)"
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

  <!-- Modal para editar reparto -->
  <Dialog :size="sm" :show="modalEdit" @update:show="modalEdit = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-black">Editar reparto</h2>
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
                v-model.alfaNumChar="deliveryEdit.name"
                @clean="deliveryEdit.name = null"
              />
            </div>
            <div class="mb-4 sm:col-span-6">
              <Calendar
                :label="'Fecha para reparto'"
                v-model="deliveryEdit.date"
                @clean="deliveryEdit.date = null"
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
                v-model="deliveryEdit.user"
                @clean="deliveryEdit.user = null"
                required
                :options="selectUsers"
                :loading="selectUsers === null"
                :label="'Empleado'"
              />
            </div>
          </div>
          <span class="mt-3 text-lg font-bold">Colonias</span>
          <hr class="bg-primary" />
          <Form @formSubmit="handleAddNeighborhoodEdit">
            <div class="grid grid-cols-12 gap-4 mt-3">
              <div class="mb-4 col-span-10">
                <Select
                  v-model="neighborhoodEdit.neighborhood"
                  @clean="neighborhoodEdit.neighborhood = null"
                  required
                  :options="computedNeighborhoodsEdit"
                  :loading="computedNeighborhoodsEdit === null"
                  :label="'Colonia'"
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
          <span v-if="!isNeighborhoodEditSelected" class="text-danger text-md">
            Se debe agregar al menos una colonia
          </span>
          <Table
            :columns="columns"
            :filter="search"
            :rows="neighborhoodsEdit.value"
            serverSide
            bgColorSelected
            :totalRows="neighborhoodsEdit.value.length"
          >
            <template v-slot:cell-name-accion="props">
              <div class="flex justify-center items-center mt-2">
                <Icon
                  name="delete_forever"
                  textColor="text-gray-600"
                  darkTextColor="dark:text-gray-600"
                  @click="handleDeleteNeighborhoodEdit(props.rowModified)"
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

  <!-- Modal para cancelar reparto -->
  <Dialog :size="sm" :show="modalCancel" @update:show="modalCancel = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-black">Cancelar reparto</h2>
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

  <!-- Modal para ver información reparto -->
  <Dialog :show="modalInfo" @update:show="modalInfo = $event">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-gray-900">Información de reparto</h2>
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
              deliveryEdit ? deliveryEdit.name : "Nombre"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title"
              >Nombre del repartidor</label
            >
            <label class="text-black dark:text-white text-lg font-title">{{
              deliveryEdit
                ? deliveryEdit.user.name +
                  " " +
                  deliveryEdit.user.lastname +
                  " " +
                  (deliveryEdit.user.secondSurname
                    ? deliveryEdit.user.secondSurname
                    : "")
                : "Repartidor"
            }}</label>
          </div>
        </div>
        <div class="col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Fecha</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              deliveryEdit ? deliveryEdit.date.substring(0, 10) : "Fecha"
            }}</label>
          </div>
        </div>
        <div class="col-span-6 mb-1">
          <div class="flex flex-col">
            <label class="text-primary text-md font-title">Estado</label>
            <div class="min-w-0">
              <span
                v-if="deliveryEdit.status === 'Pendiente'"
                class="bg-yellow-200 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900"
              >
                Pendiente
              </span>
              <span
                v-if="deliveryEdit.status === 'En proceso'"
                class="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900"
              >
                En proceso
              </span>
              <span
                v-if="deliveryEdit.status === 'Finalizada'"
                class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900"
              >
                Finalizada
              </span>
              <span
                v-if="deliveryEdit.status === 'Cancelada'"
                class="bg-red-200 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900"
              >
                Cancelada
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="deliveryEdit.status === 'Cancelada'"
          class="col-span-12 mb-1"
        >
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title"
              >Comentarios de cancelación</label
            >
            <label class="text-black dark:text-white text-lg font-title">{{
              deliveryEdit.annexes
                ? deliveryEdit.annexes.commentary
                : "Comentarios"
            }}</label>
          </div>
        </div>
        <div
          v-if="
            (deliveryEdit.status === 'Cancelada' ||
              deliveryEdit.status === 'Finalizada') &&
            deliveryEdit.annexes.photos && deliveryEdit.annexes.photos.length > 0
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
                v-for="(image, index) in deliveryEdit.annexes.photos"
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
        <div v-if="deliveryEdit.routes" class="col-span-12 mb-1">
          <label class="text-primary text-md font-title">Colonias</label>
          <Table
            :columns="columnsInfo"
            :rows="deliveryEdit.routes"
            serverSide
            bgColorSelected
            :totalRows="deliveryEdit.routes.length"
          >
            <template v-slot:cell-name-accion="props">
              <div class="flex justify-center items-center mt-2">
                <Icon
                  name="pending"
                  textColor="text-warning"
                  v-if="props.rowModified.status === 'Pendiente'"
                ></Icon>
                <Icon
                  name="info"
                  textColor="text-secondary"
                  title="Pendiente"
                  @click="showModalInfoRoute(props.rowModified)"
                  v-if="props.rowModified.status === 'Finalizada' || props.rowModified.status === 'Cancelada'"
                ></Icon>
                <Icon
                  name="pending"
                  textColor="text-primary"
                  title="En proceso"
                  v-if="props.rowModified.status === 'En proceso'"
                ></Icon>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </template>
  </Dialog>

   <!-- Modal para ver información de ruta de reparto -->
   <Dialog :show="modalInfoRoute" @update:show="() => {modalInfoRoute = $event; modalInfo = true}">
    <template #title>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold text-gray-900">Información de ruta</h2>
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
              routeSelected ? routeSelected.name : "Nombre"
            }}</label>
          </div>
        </div>
        <div class="col-span-6 mb-1">
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title">Fecha</label>
            <label class="text-black dark:text-white text-lg font-title">{{
              deliveryEdit ? deliveryEdit.date.substring(0, 10) : "Fecha"
            }}</label>
          </div>
        </div>
        <div class="col-span-12 mb-1"
        >
          <div class="flex flex-col flex-grow">
            <label class="text-primary text-md font-title"
              >Comentarios</label
            >
            <label class="text-black dark:text-white text-lg font-title">{{
              routeSelected.route.annexes
                ? routeSelected.route.annexes.commentary
                : "Comentarios"
            }}</label>
          </div>
        </div>
        <div
          v-if="routeSelected.route.annexes && routeSelected.route.annexes.photos.length > 0
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
                v-for="(image, index) in routeSelected.route.annexes.photos"
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
import { useUsersStore } from "@/modules/employees/stores/user";
import { usePickupsStore } from "@/modules/pickups/stores/pickup";
import { useDeliveryStore } from "@/modules/delivery/stores/delivery";
import { useNeighborhoodStore } from "@/modules/neighborhood/stores/neighborhood";
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
const modalInfoRoute = ref(false);
const usersStore = useUsersStore();
const deliveryStore = useDeliveryStore();
const neighborhoodsStore = useNeighborhoodStore();
const { deliveries } = storeToRefs(deliveryStore);

//selects
const selectUsers = ref(null);
const selectNeighborhoods = ref(null);
const selectNeighborhoodsEdit = ref(null);

const selectedNeighborhood = ref(null);
const selectedNeighborhoodEdit = ref(null);
const neighborhoods = reactive([]);
const neighborhoodsEdit = reactive([]);
const routeSelected = ref(null);

const neighborhood = ref({
  neighborhood: null,
  index: null,
});

const neighborhoodEdit = ref({
  neighborhood: null,
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
    field: "neighborhood",
    format: (val) => val.name,
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
    title: "Estado",
    field: "status",
    format: (val) => val,
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

const delivery = ref({
  name: null,
  date: null,
  user: null,
  routes: [],
});

const deliveryEdit = ref({
  id: null,
  name: null,
  date: null,
  user: null,
  routes: [],
  annexes: {
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

const handleDeliveries = async () => {
  try {
    loading.show();
    let payload = {
      query: {
        filter: filter.value,
        ...pag.value,
      },
    };
    let res = await deliveryStore.getDeliveries(payload);
    console.log("deliveries", deliveries);
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

const showNeighborhoods = async () => {
  try {
    let payload = {
      query: {
        ...pag.value,
      },
    };
    let res = await neighborhoodsStore.getNeighborhoods(payload);
    if (res.neighborhoods) {
      selectNeighborhoods.value = res.neighborhoods;
      selectNeighborhoodsEdit.value = res.neighborhoods;
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

const computedNeighborhoods = computed(() => {
  selectNeighborhoods.value = selectNeighborhoods.value.filter((item) => {
    return !neighborhoods.some((neighborhood) => {
      return neighborhood.neighborhood.id == item.id;
    });
  });

  return selectNeighborhoods.value.map((item) => {
    return {
      label: item.name,
      value: item,
    };
  });
});

const computedNeighborhoodsEdit = computed(() => {
  console.log("neighborhoodsEdit", neighborhoodsEdit);
  console.log("selectNeighborhoodsEdit", selectNeighborhoodsEdit);
  selectNeighborhoodsEdit.value = selectNeighborhoodsEdit.value.filter(
    (item) => {
      return !neighborhoodsEdit.value.some((neighborhood) => {
        return neighborhood.neighborhood.id == item.id;
      });
    }
  );

  return selectNeighborhoodsEdit.value.map((item) => {
    return {
      label: item.name,
      value: item,
    };
  });
});

const handleAddNeighborhood = async () => {
  try {
    let aux = {
      neighborhood: neighborhood.value.neighborhood,
      index: neighborhoods.length + 1,
    };
    neighborhoods.push(aux);
    neighborhood.value = {
      neighborhood: null,
    };
  } catch (error) {
    console.error(error);
  }
};

const handleAddNeighborhoodEdit = async () => {
  try {
    let aux = {
      neighborhood: neighborhoodEdit.value.neighborhood,
      index: neighborhoodsEdit.value.length + 1,
    };
    neighborhoodsEdit.value.push(aux);
    neighborhoodEdit.value = {
      neighborhood: null,
    };
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteNeighborhood = (neighborhood) => {
  try {
    selectedNeighborhood.value = neighborhood;
    let aux = neighborhoods.filter((item) => {
      return item.index == selectedNeighborhood.value.index;
    });
    selectNeighborhoods.value = [
      ...selectNeighborhoods.value,
      aux[0].neighborhood,
    ];
    let aux2 = neighborhoods.findIndex((item) => {
      return item.index == selectedNeighborhood.value.index;
    });
    if (aux2 > -1) {
      neighborhoods.splice(aux2, 1);
    }
    neighborhoods.forEach((item, index) => {
      item.index = index + 1;
    });
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteNeighborhoodEdit = (neighborhood) => {
  try {
    selectedNeighborhoodEdit.value = neighborhood;
    let aux = neighborhoodsEdit.value.filter((item) => {
      return item.index == selectedNeighborhoodEdit.value.index;
    });
    console.log("aux", aux);
    selectNeighborhoodsEdit.value = [
      ...selectNeighborhoodsEdit.value,
      aux[0].neighborhood,
    ];
    let aux2 = neighborhoodsEdit.value.findIndex((item) => {
      return item.index == selectedNeighborhoodEdit.value.index;
    });
    if (aux2 > -1) {
      neighborhoodsEdit.value.splice(aux2, 1);
    }
    neighborhoodsEdit.value.forEach((item, index) => {
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

const isNeighborhoodSelected = computed(() => {
  if (neighborhoods.length == 0) {
    return false;
  } else {
    return true;
  }
});

const isNeighborhoodEditSelected = computed(() => {
  if (neighborhoodsEdit.value.length == 0) {
    return false;
  } else {
    return true;
  }
});

const handleAdd = async () => {
  try {
    if (isNeighborhoodSelected.value == false) {
      return;
    }
    loading.show();
    let aux = neighborhoods.map((item) => {
      return item.neighborhood.id;
    });
    console.log("aux", aux);
    let payload = {
      body: {
        name: delivery.value.name,
        date: delivery.value.date,
        user: delivery.value.user,
        routes: aux,
      },
    };
    console.log(payload);
    let res = await deliveryStore.addDelivery(payload);
    if (res.data.statusCode == 200) {
      showMsg("success", "Recolección agregada correctamente");
      modalAdd.value = false;
      handleDeliveries();
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

const showModalEdit = async (delivery) => {
  try {
    console.log("delivery", delivery);
    let aux = 0;
    let neighborhoodsAux = delivery.routes.map((item) => {
      aux = aux + 1;
      return {
        index: aux,
        neighborhood: {
          id: item._id,
          name: item.name,
        },
      };
    });

    deliveryEdit.value = {
      id: delivery.id,
      name: delivery.name,
      date: delivery.date.substring(0, 10),
      user: delivery.user._id,
      routes: neighborhoodsAux,
    };
    neighborhoodsEdit.value = neighborhoodsAux;
    console.log("neighborhoodsEdit", neighborhoodsEdit);
    modalEdit.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleUpdate = async () => {
  try {
    if (isNeighborhoodEditSelected.value == false) {
      return;
    }
    loading.show();
    let aux = neighborhoodsEdit.value.map((item) => {
      return item.neighborhood.id;
    });
    console.log("aux", aux);
    let payload = {
      id: deliveryEdit.value.id,
      body: {
        name: deliveryEdit.value.name,
        date: deliveryEdit.value.date,
        user: deliveryEdit.value.user,
        routes: aux,
      },
    };
    console.log(payload);
    let res = await deliveryStore.updateDelivery(payload);
    if (res.data.statusCode == 200) {
      showMsg("success", "Reparto modificado correctamente");
      modalEdit.value = false;
      handleDeliveries();
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

const showModalCancel = async (delivery) => {
  try {
    cancel.value = {
      id: delivery.id,
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
    console.log(cancel.value);
    let payload = {
      id: cancel.value.id,
      body: {
        annexes: {
          commentary: cancel.value.commentary,
        },
      },
    };
    if (images.value.length > 0) {
      payload.body.annexes = {
        commentary: cancel.value.commentary,
        photos: images.value,
      };
    }
    console.log("payload", payload);
    let res = await deliveryStore.cancelDelivery(payload);
    if (res.data.statusCode == 200) {
      showMsg("success", "Recolección cancelada correctamente");
      modalCancel.value = false;
      handleDeliveries();
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

const selectedRow = async (delivery) => {
  try {
    let aux = 0;
    let routesAux = delivery.routes.map((item) => {
      aux = aux + 1;
      return {
        index: aux,
        id: item._id,
        name: item.name,
        status: item.status,
        route: item
      };
    });

    deliveryEdit.value = {
      id: delivery.id,
      name: delivery.name,
      date: delivery.date.substring(0, 10),
      user: delivery.user,
      status: delivery.status,
      routes: routesAux,
      annexes: {
        commentary: delivery.annexes ? delivery.annexes.commentary : null,
        photos: delivery.annexes ? delivery.annexes.photos : [],
      },
    };
    console.log("deliveryEdit", deliveryEdit.value);
    modalInfo.value = true;
  } catch (error) {
    console.log(error);
  }
};

const showModalInfoRoute = async (route) => {
  try {
    console.log("route", route);
    console.log("deliveryEdit", deliveryEdit.value);
    routeSelected.value = route;
    modalInfo.value = false;
    modalInfoRoute.value = true;
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

onMounted(() => {
  handleDeliveries();
  showUsers();
  showNeighborhoods();
});
</script>