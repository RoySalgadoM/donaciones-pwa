<template>
  <aside :class="isExpanded ? 'w-48' : 'w-12'" class="transition-width duration-300 ease-in-out h-full bg-secondary text-white">
    <ul>
      <li>
        <div @click="toggle" class="flex items-center justify-center h-12 cursor-pointer hover:bg-secondary2">
          <span class="material-icons">
            {{ isExpanded ? 'chevron_left' : 'menu' }}
          </span>
        </div>
      </li>
      <li v-for="item in menuItems" :key="item.text" class="group">
        <a @click="handleRoute(item.route)" class="flex items-center justify-center h-12 group-hover:bg-secondary2">
          <span class="material-icons text-center">
            {{ item.icon }}
          </span>
          <span v-if="isExpanded" class="ml-1 md:ml-3 whitespace-nowrap">{{ item.text }}</span>
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  isExpanded: Boolean
});
const emit = defineEmits(['toggle']);

function toggle() {
  emit('toggle');
}

const menuItems = [
  { icon: 'people', text: 'Usuarios', route: 'queryUser' },
  { icon: 'store', text: 'Tiendas', route: 'queryStore' },
  { icon: 'location_city', text: 'Colonias', route: 'queryNeighborhood' },
  { icon: 'shopping_cart', text: 'Productos', route: 'queryProduct' },
  { icon: 'local_shipping', text: 'Recolecciones', route: 'queryPickups' },
  { icon: 'local_shipping', text: 'Repartos', route: 'queryDeliveries' },
  { icon: 'person', text: 'Perfil', route: 'queryProfile' }
];

const handleRoute = (route) => {
  router.push({ name: route });
}

</script>

<style scoped>
/* Asegúrate de que los iconos y el texto estén alineados correctamente */
ul {
  padding: 0;
}

li {
  list-style-type: none; /* Remueve los bullets de la lista */
}

a, div {
  display: flex;
  align-items: center;
  justify-content: start;
  height: 3rem; /* Asegúrate de que todos los elementos tengan la misma altura */
}

.material-icons {
  /* Tamaño de los íconos para que sean visibles y estéticos */
  font-size: 1.2rem;
  min-width: 1.2rem; /* Asegúrate de que los iconos no se compriman cuando el sidebar está colapsado */
  margin: 0 12px; /* Añade un margen horizontal si es necesario */
}

.whitespace-nowrap {
  white-space: nowrap; /* Asegura que el texto no se envuelva en el sidebar expandido */
}
</style>
