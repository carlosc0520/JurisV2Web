<template>
  <footer class="block">
    <div class="container mx-auto px-4 m-0">
      <hr class="mb-4 border-b-1 border-blueGray-200" />
      <div class="flex flex-wrap items-center md:justify-between justify-center">
        <div class="w-full md:w-12/12 px-4">
          <div class="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left">
            Copyright © {{ date }}
            <a href="https://www.creative-tim.com?ref=vn-footer-admin"
              class="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1">
            JURIS SEARCH
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      date: new Date().getFullYear(),
    };
  },
};
</script>
