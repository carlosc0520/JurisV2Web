<template>
  <section class="min-h-screen pb-10" style="background:var(--bg-sunken)">
    <div class="max-w-[80%] max-sm:max-w-[95%] mx-auto pt-5">
      <h2 class="text-center text-xl font-bold mb-2 pt-5">Síguenos en Instagram</h2>
      <p class="text-center mb-5 text-gray-500 dark:text-gray-400">Descubre nuestras últimas publicaciones y actualizaciones.</p>
      <iframe src="https://www.instagram.com/juris.search/embed"
        class="w-full min-h-[1100px] max-sm:min-h-[500px] border-0 my-5 rounded-[10px] shadow-medium overflow-hidden"
        frameborder="0" scrolling="no" allowfullscreen></iframe>
    </div>
  </section>
</template>

<script>
export default {
  name: "dashboard-user-page",
};
</script>
