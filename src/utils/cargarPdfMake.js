// pdfmake y las fuentes Times pesan ~5 MB: se descargan al generar el primer PDF de la
// sesión, no al abrir la web. Las siguientes veces se reutiliza lo ya cargado.
let promesa = null;

export function cargarPdfMake() {
  if (!promesa) {
    promesa = Promise.all([
      import(/* webpackChunkName: "pdfmake" */ 'pdfmake/build/pdfmake'),
      import(/* webpackChunkName: "pdfmake" */ '@/assets/times.js'),
      import(/* webpackChunkName: "pdfmake" */ '@/assets/timesBold.js'),
      import(/* webpackChunkName: "pdfmake" */ '@/assets/timesItalics.js'),
    ])
      .then(([lib, times, bold, italics]) => {
        const pdfMake = lib.default || lib;
        pdfMake.vfs = {
          'TimesNewRoman.ttf': times.default,
          'Roboto-Medium.ttf': bold.default,
          'Roboto-Regular.ttf': times.default,
          'Roboto-Italics.ttf': italics.default,
        };
        pdfMake.fonts = {
          TimesNewRoman: {
            normal: 'TimesNewRoman.ttf',
            bold: 'TimesNewRoman.ttf',
            italics: 'TimesNewRoman.ttf',
            bolditalics: 'TimesNewRoman.ttf',
          },
          Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italics.ttf',
            bolditalics: 'Roboto-Medium.ttf',
          },
        };
        return pdfMake;
      })
      .catch((e) => { promesa = null; throw e; }); // si falla la descarga, se reintenta la próxima vez
  }
  return promesa;
}
