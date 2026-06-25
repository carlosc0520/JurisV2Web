<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <data-table title="Entradas de Jurisprudencias" />
    </div>
  </div>
</template>
<script>
import DataTable from "@/components/Tables/DataTable.vue";

export default {
  components: {
    DataTable,
  },
};
</script>

