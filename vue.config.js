// vue.config.js
const webpack = require('webpack');

module.exports = {
  // Ninguna plantilla se compila en el navegador: todas vienen compiladas de los .vue
  runtimeCompiler: false,
  filenameHashing: true,
  // Sin mapas de código fuente en producción: dejaban el código de la web visible para cualquiera
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      // moment trae ~100 idiomas; solo se usa español
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/es$/),
    ],
  },
  chainWebpack: (config) => {
    // Sin prefetch: si no, el navegador descargaría en segundo plano todas las partes
    // diferidas (PDF, Excel, admin...) aunque el visitante nunca las use
    config.plugins.delete('prefetch');
  },
};
