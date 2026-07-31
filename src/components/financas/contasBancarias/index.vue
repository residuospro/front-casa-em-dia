<template>
  <ce-data-table
    :items="dataContas.data"
    :headers="headers"
    truncated
    compact
    search
    order-by-server
    @order-by="() => console.log('ordenar')"
    hide-id
  ></ce-data-table>
</template>

<script setup lang="ts">
import {
  CeDataTable,
  CePagination,
  CeItemsPerPage,
} from "@comercti/vue-components-hmg";
import { useContaBancaria } from "./useContasBancarias";

const { headers, dataContas } = useContaBancaria();
</script>
