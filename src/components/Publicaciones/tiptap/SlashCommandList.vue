<template>
  <div class="slash-menu">
    <button v-for="(item, i) in items" :key="item.title" type="button"
      :class="['slash-menu-item', i === selectedIndex ? 'slash-menu-item-active' : '']"
      @click="select(item)">
      <span class="slash-menu-item-title">{{ item.title }}</span>
      <span class="slash-menu-item-desc">{{ item.description }}</span>
    </button>
    <div v-if="!items.length" class="slash-menu-empty">Sin resultados</div>
  </div>
</template>

<script>
export default {
  name: 'SlashCommandList',
  props: {
    items:   { type: Array,    default: () => [] },
    command: { type: Function, required: true },
  },
  data() {
    return { selectedIndex: 0 };
  },
  watch: {
    items() { this.selectedIndex = 0; },
  },
  methods: {
    select(item) { if (item) this.command(item); },
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length;
        return true;
      }
      if (event.key === 'ArrowDown') {
        this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
        return true;
      }
      if (event.key === 'Enter') {
        this.select(this.items[this.selectedIndex]);
        return true;
      }
      return false;
    },
  },
};
</script>
