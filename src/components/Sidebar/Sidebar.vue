<template>
  <nav class="sticky top-0 h-screen flex flex-col items-center py-3 px-1.5 w-20
              bg-white dark:bg-gray-900
              border-r border-[rgba(223,45,178,0.1)] dark:border-indigo-500/10
              shadow-[2px_0_15px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_15px_rgba(0,0,0,0.3)]
              z-50 transition-all duration-300">

    <!-- Logo & toggle -->
    <div class="flex flex-col items-center justify-center w-[4.25rem] mb-4 p-1.5
                rounded-xl bg-gradient-to-br from-white to-[#fef5fb]
                dark:from-gray-900 dark:to-gray-800
                shadow-[0_4px_15px_rgba(223,45,178,0.1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.3)]
                hover:shadow-[0_8px_25px_rgba(223,45,178,0.2)] dark:hover:shadow-[0_8px_25px_rgba(99,102,241,0.2)]
                hover:-translate-y-0.5 transition-all duration-300">

      <button
        class="group mb-1.5 p-1.5 rounded-lg bg-white dark:bg-gray-800
               border-2 border-gray-200 dark:border-gray-700
               hover:bg-gradient-to-br hover:from-[#DF2DB2] hover:via-purple-500 hover:to-[#185CE6]
               hover:border-transparent hover:rotate-90 hover:scale-110
               hover:shadow-[0_4px_15px_rgba(223,45,178,0.3)]
               flex items-center justify-center transition-all duration-300 cursor-pointer"
        @click="toggleSidebar"
        aria-label="Toggle menu"
      >
        <img src="@/assets/img/icons/menu.svg" alt="Menu"
          class="w-4 h-4 transition-all duration-300
                 dark:[filter:brightness(0)_invert(0.7)]
                 group-hover:[filter:brightness(0)_invert(1)]"
          ref="menuIconRef"/>
      </button>

      <router-link to="/" class="flex items-center justify-center hover:scale-105 transition-transform duration-300">
        <img
          v-tooltip.left="{ value: 'Haz click para dirigirte a la página de inicio.', style: { fontSize: '0.75rem', color: '#4A5568' } }"
          src="@/assets/img/logos/logo-nav.png" alt="Logo"
          class="w-12 h-12 object-contain transition-all duration-300"
        />
      </router-link>
    </div>

    <!-- Menu items -->
    <div class="flex flex-col flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-brand">
      <ul class="flex flex-col items-center gap-2 w-full p-0 m-0 list-none">
        <li v-for="(item, index) in menuItems" :key="index" class="w-full flex flex-col items-center">

          <router-link :to="item.route" v-slot="{ href, navigate, isActive }">
            <a :href="href" @click="navigate"
              :class="['flex flex-col items-center px-1.5 py-2 rounded-xl w-full transition-all duration-300 text-gray-600 dark:text-gray-400 no-underline border-l-[3px] border-transparent',
                isActive
                  ? 'bg-gray-50 dark:bg-gray-800 !text-brand-pink dark:!text-violet-400'
                  : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800']">

              <!-- Icon wrapper -->
              <div :class="['w-[1.9rem] h-[1.9rem] flex items-center justify-center rounded-[9px] mb-1.5 transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-br from-[#DF2DB2] via-purple-500 to-[#185CE6] shadow-[0_4px_15px_rgba(223,45,178,0.3)]'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700']">
                <img :src="item.icon" alt=""
                  :class="['w-4 h-4 transition-all duration-300',
                    isActive
                      ? '[filter:brightness(0)_invert(1)] opacity-100'
                      : 'opacity-70 dark:[filter:brightness(0)_invert(0.6)]']"/>
              </div>

              <!-- Label -->
              <span :class="['text-[0.62rem] font-semibold text-center leading-tight transition-all duration-300',
                isActive ? 'font-extrabold text-brand-pink dark:text-violet-400' : '']">
                {{ item.name }}
              </span>
            </a>
          </router-link>

          <!-- Divider -->
          <div v-if="index < menuItems.length - 1"
            class="w-[70%] h-px my-1 rounded-full
                   bg-gradient-to-r from-transparent via-[rgba(223,45,178,0.2)] to-transparent
                   dark:via-[rgba(99,102,241,0.25)]"/>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import logo from '@/assets/img/logos/logo.png';

export default {
  data() {
    return {
      logo,
      collapseShow: false,
      menuItems: [],
    };
  },
  props: {
    isCollapsed: { type: Boolean, default: false },
    toggleSidebar: { type: Function, default: () => {} },
    menu: { type: Array, default: () => [] },
    role: { type: Object, default: () => ({}) },
  },
  methods: {
    toggleCollapseShow() {
      this.collapseShow = !this.collapseShow;
    },
  },
  watch: {
    $route() {
      if (window.innerWidth < 768 && !this.isCollapsed) {
        this.toggleSidebar();
      }
    },
    menu: {
      immediate: true,
      handler(val) {
        this.menuItems = val ?? [];
      },
    },
  },
};
</script>

<style scoped>
/* Scrollbar — can't be done with Tailwind utility classes */
.scrollbar-brand::-webkit-scrollbar { width: 4px; }
.scrollbar-brand::-webkit-scrollbar-track { background: #F9FAFB; border-radius: 10px; }
.scrollbar-brand::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #DF2DB2 0%, #185CE6 100%);
  border-radius: 10px;
}
.scrollbar-brand::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #c528a0 0%, #1450c9 100%);
}
:global(.dark) .scrollbar-brand::-webkit-scrollbar-track { background: #1f2937; }
</style>
