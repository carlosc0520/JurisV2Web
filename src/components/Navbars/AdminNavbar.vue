<template>
  <!-- Navbar -->
  <nav
    class="bg-white dark:bg-gray-800 absolute top-0 left-0 w-full z-10 md:flex-row md:flex-nowrap md:justify-start flex items-center p-2 transition-colors duration-300"
  >
    <div
      class="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4"
    >
      <!-- Brand -->
      <a
        class="text-white text-sm uppercase lg:inline-block font-semibold"
        href="javascript:void(0)"
      >
        <img
          src="@/assets/img/icons/menu.svg"
          alt="logo"
          class="icon-btn"
          @click="toggleSidebar"
        />
      </a>
      <!-- User -->
      <ul class="m-0 flex-col md:flex-row list-none items-center md:flex">
        <!-- <dark-mode-toggle class="mr-3" /> -->
        <user-dropdown :RTAFTO="RTAFTO" />
      </ul>
    </div>
  </nav>
  <!-- End Navbar -->
</template>

<script>
import UserDropdown from "@/components/Dropdowns/UserDropdown.vue";
// import DarkModeToggle from "@/components/DarkModeToggle.vue";

export default {
  components: {
    UserDropdown,
    // DarkModeToggle,
  },
  props: {
    RTAFTO: {
      type: String,
      default: "",
    },
    toggleSidebar: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.icon-btn img {
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease-in-out;
}
</style>
