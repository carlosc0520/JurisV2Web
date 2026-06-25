<template>
  <nav
    class="bg-white dark:bg-gray-800 sticky top-0 z-40 w-full h-[60px]
           flex items-center px-4 md:px-5 transition-colors duration-300
           border-b border-gray-100 dark:border-gray-700 shadow-soft"
  >
    <!-- Hamburger: solo visible cuando el sidebar está colapsado -->
    <button
      v-if="isCollapsed"
      type="button"
      @click="toggleSidebar"
      class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl mr-3
             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <img src="@/assets/img/icons/menu.svg" alt="menu" class="w-5 h-5"/>
    </button>

    <!-- Título de página -->
    <div class="flex-1 flex flex-col items-start justify-center min-w-0">
      <span v-if="pageTitle" class="text-brand-gradient text-[13px] font-bold leading-tight truncate">
        {{ pageTitle }}
      </span>
      <span v-if="pageSubtitle" class="text-gray-400 dark:text-gray-400 text-[10px] leading-tight truncate hidden sm:block mt-0.5">
        {{ pageSubtitle }}
      </span>
    </div>

    <!-- Dark mode toggle + User dropdown -->
    <div class="flex items-center gap-1 flex-shrink-0 ml-4">
      <dark-mode-toggle />
      <user-dropdown :RTAFTO="RTAFTO" />
    </div>
  </nav>
</template>

<script>
import UserDropdown from "@/components/Dropdowns/UserDropdown.vue";
import DarkModeToggle from "@/components/DarkModeToggle.vue";

export default {
  components: { UserDropdown, DarkModeToggle },
  props: {
    RTAFTO:        { type: String,   default: "" },
    toggleSidebar: { type: Function, default: () => {} },
    isCollapsed:   { type: Boolean,  default: false },
  },
  computed: {
    pageTitle()    { return this.$route.meta?.title    || ''; },
    pageSubtitle() { return this.$route.meta?.subtitle || ''; },
  },
};
</script>
