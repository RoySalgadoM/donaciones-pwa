<template>
  <div>
    <!-- <div
    class="bg-light-300 dark:bg-negative-100 dark:text-accent-200 shadow-md rounded-md p-5 h-full w-full overflow-y-auto overflow-x-auto"> -->
    <div class="overflow-x-auto">
      <table
        :class="[
          'shadow-lg p-5 min-w-full table-auto border',
          bgColor,
          darkBgColor,
        ]"
      >
        <caption v-if="haveTitle">
          {{
            title
          }}
        </caption>
        <thead>
          <tr>
            <th class="border" v-if="select">Selecciona</th>
            <th
              :class="headerClass"
              v-for="(col, indexCol) in finalColumns"
              :key="'col' + indexCol"
            >
              <div class="flex justify-center items-center">
                <div class="text-center cursor-default">
                  {{ col.title }}
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="[
              `text-center text-base font-normal border-inherit border ${
                indexRowSelected == indexRow
                  ? 'bg-secondary/20 border-secondary'
                  : ''
              } `,
              textBodyClass,
            ]"
            v-for="({ row, rowOrig }, indexRow) in finalRows"
            :key="'row' + indexRow"
          >
            <td class="border-inherit" v-if="select">
              <div class="radio">
                <label>
                  <input type="radio" @click="handleSelect(rowOrig)" />
                </label>
              </div>
            </td>
            <template
              v-for="(col, indexCol) in finalColumns"
              :key="'col' + indexCol"
            >
              <slot
                v-if="!!$slots[`cell-name-${col.field}`]"
                :name="`cell-name-${col.field}`"
                :value="row[col.field]"
                :rowModified="row"
                :col="col"
                class="text-center border-y border-1 border-inherit"
                v-bind:isSelectedETable="
                  indexRow == indexRowSelected
                    ? 'bg-secondary bg-opacity-50'
                    : ''
                "
                v-bind:indexRowETable="indexRow"
              >
              </slot>
              <td
                v-else-if="row[col.field]"
                :class="`text-opacity text-center border-b border-1 px-5 border-inherit 
               ${
                 col.isClickeable
                   ? 'cursor-pointer dark:text-primary text-primary font-semibold'
                   : 'cursor-auto'
               }`"
                @click="
                  col.isClickeable
                    ? handleClickEmit(row, col.field, col, indexRow)
                    : false
                "
              >
                <span v-if="typeof row[col.field] === 'object'">{{
                  row[col.field].label
                }}</span>
                <span v-else>{{ row[col.field] }}</span>
              </td>
            </template>
          </tr>
          <tr v-if="finalRows.length == 0" :class="textBodyClass">
            <td
              :colspan="finalColumns.length + (select ? 1 : 0)"
              class="text-center py-3"
            >
              No existen datos para mostrar
            </td>
          </tr>
          <tr :class="textBodyClass">
            <slot name="newRow"> </slot>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="flex items-center justify-center font-semibold text-sm dark:text-accent text-accent-400 mb-1"
    >
      <div class="flex items-center justify-between w-full">
        <div class=""></div>
        <div :class="hidePagination ? 'hidden' : 'flex items-center'">
          <PaginationTable
            :numPagesTotal="numPagesTotal"
            v-model="currentPage"
            @update:modelValue="handleRequest"
            ref="paginationRef"
            :textColor="textColor"
          />
          <div style="width: 140px">
            <Select
              :showClean="false"
              v-model="numRowsByPage"
              :options="rowsByPage"
              @update:modelValue="handleReload"
              textSize="xs"
              isPagination
            />
          </div>
        </div>
        <div>
          <e-btn
            v-if="exportBtn"
            :text="textBtnExport"
            type="submit"
            text-size="text-md"
            border-color="border-none"
            :darkColor="'secondary'"
            :darkHoverColor="'secondary'"
            :disabled="finalRows.length == 0"
            @click="handleExportEmit"
            fill
          />
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import Select from "./Select.vue";
import PaginationTable from "./PaginationTable.vue";
import { mapState } from "pinia";
import { calculateTextColor } from "@/utils/utils";
import { useCustomizationStore } from "@/config/stores/customization.ts";

export default {
  name: "Table",
  components: { PaginationTable, Select },
  data() {
    return {
      descending: null,
      sortBy: null,
      numRowsByPage: 5,
      currentPage: 1,
      clicked: false,
      indexRowSelected: null,
      selected: [],
    };
  },
  props: {
    haveTitle: {
      type: Boolean,
      default: false,
      description: "Bandera para indicar que la tabla tiene un título",
    },
    hidePagination: {
      type: Boolean,
      default: false,
      description: "Bandera para indicar si la paginación se ocultará",
    },
    title: {
      type: String,
      default: null,
      description: "Título de la tabla",
    },
    rows: {
      type: [Object, Array],
      default: () => {
        return [];
      },
      required: false,
      description: "Arreglo con información a mostrar en la tabla",
    },
    columns: {
      type: [Object, Array],
      default: () => {
        return [];
      },
      required: false,
      description: "Arreglo con las columnas a mostrar en la tabla",
    },
    columnsAux: {
      type: Array,
      default: () => [],
    },
    select: {
      type: String,
      default: null,
      description:
        "Variable para indicar el tipo de selección (single o multiple)",
      required: false,
    },
    textBtnExport: {
      type: String,
      default: "Exportar",
      description: "Label del boton exportar",
      required: false,
    },
    serverSide: {
      type: Boolean,
      default: false,
      required: false,
      description: "Indica si la paginación sera del lado del back",
    },
    localSort: {
      type: Boolean,
      description: "Bandera para indicar que el se hará local sort",
      default: false,
      required: false,
    },
    totalRows: {
      type: Number,
      default: null,
      required: false,
      description: "Número total de registros",
    },
    exportBtn: {
      type: Boolean,
      default: false,
      required: false,
      description: "Mostrar o no el botón de exportar de table",
    },
    rowsByPage: {
      type: Array,
      default: () => {
        return [
          { label: "5", value: 5 },
          { label: "10", value: 10 },
          { label: "20", value: 20 },
          { label: "30", value: 30 },
        ];
      },
      description: "catalogo para paginación",
      required: false,
    },
    bgColor: {
      type: String,
      default: "bg-white",
      description: "Color bg de la sección body del componente en modo light.",
    },
    darkBgColor: {
      type: String,
      default: "dark:bg-transparent",
      description: "Color bg de la sección body del componente en modo dark.",
    },
    bgHeaderColor: {
      type: String,
      default: "bg-htable",
      description: "Color de la sección header del componente en modo light.",
    },
    bgHeaderColorDark: {
      type: String,
      default: null,
      description: "Color de la sección header del componente en modo dark.",
    },
    textColor: {
      type: String,
      default: null,
      description:
        "Color del texto de la sección body del componente en modo light.",
    },
    textColorDark: {
      type: String,
      default: null,
      description:
        "Color del texto de la sección body del componente en modo dark.",
    },
    textColorHeader: {
      type: String,
      default: null,
      description:
        "Color del texto en la sección header del componente en modo light.",
    },
    textColorHeaderDark: {
      type: String,
      default: null,
      description:
        "Color del texto en la sección header del componente en modo dark.",
    },
    iconColor: {
      type: String,
      default: "text-white",
      description: "Label del boton exportar",
      required: false,
    },
    iconColorBlack: {
      type: String,
      default: "dark:text-white",
      description: "Label del boton exportar",
      required: false,
    },
    optionsSortOrder: {
      type: Array,
      default: () => {
        return [
          { value: true, label: "DESC" },
          { value: false, label: "ASC" },
        ];
      },
      description: "Catalogo de cuantos registros por pagina se veran",
      required: false,
    },
    filter: {
      type: [String, Array, Object, Number, Boolean],
      default: null,
      description:
        "Filtro(s) de la consulta que se usa para persistir los valores del filtro en las consultas paginadas(serverSide)",
      required: false,
    },
    rowClicked: {
      type: Object,
      default: null,
    },
    rowClickedId: {
      type: String,
      default: null,
    },
  },
  onBeforeMount() {
    if (this.rowsByPage[0]) {
      this.numRowsByPage = this.rowsByPage[0];
    }
  },
  computed: {
    ...mapState(useCustomizationStore, ["isDarkMode"]),
    headerClass() {
      return [
        "border-b border-1 uppercase border-inherit text-center text-sm font-normal",
        this.isDarkMode,
        this.bgHeaderColor,
        this.bgHeaderColorDark,
        this.textColorHeader
          ? this.textColorHeader
          : calculateTextColor(this.bgHeaderColor),
        this.textColorHeaderDark
          ? this.textColorHeaderDark
          : this.bgHeaderColorDark
          ? calculateTextColor(this.bgHeaderColorDark)
          : calculateTextColor(this.bgHeaderColor),
      ];
    },
    textBodyClass() {
      return [
        this.isDarkMode,
        this.textColor ? this.textColor : calculateTextColor(this.bgColor),
        this.textColorDark
          ? this.textColorDark
          : this.darkBgColor
          ? calculateTextColor(this.darkBgColor)
          : calculateTextColor(this.bgColor),
      ];
    },
    paginationRows() {
      if (this.serverSide) {
        return this.rows;
      }
      let auxRows = [...this.rows];
      if (this.sortBy) {
        auxRows = this.dataSort(auxRows, this.sortBy, this.descending);
      }
      let indexInitial = (this.currentPage - 1) * this.numRowsByPage;
      let indexFinal = indexInitial + this.numRowsByPage;
      return auxRows.filter(
        (_, index) => index >= indexInitial && index < indexFinal
      );
    },
    finalRows() {
      return this.paginationRows.map((row) => {
        let aux = { ...row };
        this.finalColumns.map((col) => {
          let formater = col.formater ? col.formater : "formatInfo";
          aux[col.field] = col.format
            ? col.format(row[col.field], row)
            : formater == "formatInfo"
            ? this.$filters[formater](row[col.field], {
                fieldObject: col.readObject ? col.readObject : "label",
              })
            : this.$filters[formater](row[col.field]);
        });
        return { row: aux, rowOrig: row };
      });
    },
    finalColumns() {
      let aux = [...this.columns];
      if (this.columnsAux) {
        aux.filter((col) => col.required);
        aux = aux.concat(this.columnsAux);
      } else {
        aux = aux.filter((col) => col.required);
      }
      return aux;
    },
    numPagesTotal() {
      let aux = null;
      if (this.serverSide) {
        if (this.totalRows === null || this.totalRows < 1) {
          return null;
        }
        aux = Math.ceil(this.totalRows / this.numRowsByPage);
      } else if (this.rows.length > 0) {
        aux = Math.ceil(this.rows.length / this.numRowsByPage);
      }
      return aux;
    },
  },
  methods: {
    handleRowsChange() {
      if (!this.serverSide) {
        if (this.hidePagination) {
          this.numRowsByPage = this.rows.length;
        }
        this.handleReload();
      }
    },
    handleSetPage(page) {
      this.$refs.paginationRef.setPage(page);
    },
    handleReload() {
      if (this.$refs.paginationRef) {
        this.$refs.paginationRef.handleFirstPage();
      }
    },
    dataSort(rows, sortBy, descending) {
      const data = [...rows];
      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a;
          const y = descending ? a : b;
          let columnInfo = this.finalColumns.find(
            (col) => col.field === sortBy
          );
          if (
            columnInfo.type === "Number" ||
            columnInfo.typeSort === "Number"
          ) {
            // numeric sort
            let auxA = x[sortBy];
            let auxB = y[sortBy];
            return (
              parseFloat(auxA ? auxA : "0.0") - parseFloat(auxB ? auxB : "0.0")
            );
          } else {
            // string sort
            return columnInfo
              .format(x[columnInfo.field])
              .toString()
              .toLowerCase()
              .localeCompare(
                columnInfo.format(y[columnInfo.field]).toString().toLowerCase()
              );
          }
        });
      }
      return data;
    },
    handleSort(col) {
      this.onChangeContent();
      if (col.field == this.sortBy) {
        this.descending =
          this.descending === null ? false : !this.descending ? true : null;

        this.sortBy = this.descending !== null ? col.field : null;
      } else {
        this.descending = false;
        this.sortBy = col.field;
      }
      this.handleRequest();
    },

    handleClickEmit(rowTable, name, col, index) {
      if (col.isClickeable) {
        this.setIndexRowSelected(index);
      }
      let row = this.rows[index];
      this.$emit("setSelectedRow", { row, rowTable, name, col });
    },
    handleExportEmit() {
      let payload = {
        filters: this.filter,
        pagination: {
          page: this.currentPage,
          sortBy: this.sortBy,
          rowsPerPage: this.numRowsByPage,
        },
      };
      this.$emit("handleExport", payload);
    },
    setIndexRowSelected(index) {
      this.indexRowSelected = index;
    },
    cleanIndexRowSelected() {
      this.indexRowSelected = null;
    },
    onChangeContent() {
      this.$emit("changeContent");
    },
    handleSelect() {},
    handleRequest() {
      this.onChangeContent();
      if (!this.serverSide) return;
      let payload = {
        filters: this.filter,
        pagination: {
          page: this.currentPage,
          sortBy: this.sortBy,
          descending: this.descending,
          rowsPerPage: this.numRowsByPage,
        },
      };
      this.$emit("request", payload);
    },
  },
  watch: {
    rows: {
      handler: "handleRowsChange",
      deep: true,
    },
    filter() {
      if (this.$refs.paginationRef) {
        this.handleReload();
      } else {
        this.handleRequest();
      }
    },
    numRowsByPage() {
      if (this.numRowsByPage == null) {
        this.numRowsByPage = 10;
      }
    },
  },
};
</script>
