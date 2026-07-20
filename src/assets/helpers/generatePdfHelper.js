import { toast } from 'vue3-toastify';
import pdfMake from 'pdfmake/build/pdfmake';
import recursos from "../../views/admin/recursos.js";
import timesNewRoman from "../../assets/times.js";
import timesNewRomanBold from "../../assets/timesBold.js";
import timesNewRomanItalics from "../../assets/timesItalics.js";

class createPDFHelper {
  async generate(data, returnBase64 = false) {
    try {
      let margin = [40, 10, 40, 10];
      let totalPages = 0;
      let fontSize = 11;
      let currentYear = new Date().getFullYear();

      let documentoPDF = {
        header: () => {
          return {
            style: 'headerStyle',
            columns: [
              { width: '*', text: '', alignment: 'center', margin: [40, 40, 40, 40] },
              {
                width: 'auto',
                stack: [
                  {
                    image: recursos.nuevoLogoJuris,
                    width: 60,
                    link: `${process.env.VUE_APP_SITE_URL || 'https://jurissearch.com'}/`,
                    alignment: 'center',
                    margin: [0, 20, 0, 0]
                  },
                ],
              },
              { width: '*', text: '', alignment: 'center', margin: [40, 40, 40, 40] },
            ],
          }
        },


        background: [
          {
            image: recursos.toIMG,
            width: 620,
            height: 600,
            absolutePosition: { x: 5, y: 150 },
            alignment: 'center',
            opacity: 0.5,
          }
        ],

        content: [
          {
            text: `${returnBase64 ? data.TITULO : data.TITLE}`,
            style: 'header',
            alignment: 'center',
            margin: [40, -20, 40, 10],
            bold: true,
            FontFace: 'Calibri'
          },
          {
            table: {
              widths: ['35%', '57%'],
              body: [
                [{ text: '▪ CASO EMBLEMÁTICO:', bold: true }, data?.CASO ? data?.CASO : '-'],
                [{ text: '▪ TIPO DE RECURSO:', bold: true }, returnBase64 ? data?.RECURSO?.map((item) => item.DESCP).join('\n') : data?.RECURSO?.replace(/,/g, '\n')],
                [{ text: '▪ DELITOS:', bold: true }, returnBase64 ? (
                  data?.DELITO?.length > 0 ?
                    data?.DELITO.map((item) => item.DESCP).join('\n') : "-"
                )
                  : data?.DELITO?.replace(/,/g, '\n')],
                [{ text: '▪ VINCULANTE:', bold: true }, returnBase64 ? (
                  data?.INDICADOR ? "Si" : "No") : data?.ISBINDING]
              ]
            },
            margin: [70, 0, 0, 0],
            fontSize,
            lineHeight: 1.5,
            layout: 'noBorders'
          },
          {
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                stack: [
                  data?.REQUIERE_ENLACE_EXTERNO && data?.ENLACE_OFICIAL
                    ? this.consultarResolucionButton(data.ENLACE_OFICIAL)
                    : {
                        image: recursos.botonDescargarResolucion,
                        width: 120,
                        link: `${process.env.VUE_APP_API_URL || 'https://api.jurissearch.com'}/login/download-file?ID=` + data?.ID,
                        alignment: 'center',
                        margin: [0, 10, 0, 10]
                      },
                ],
              },
              { width: '*', text: '' },
            ],
          },
          {
            style: 'tableExample',
            table: {
              dontBreakRows: false,
              widths: ['35%', '65%'],
              body: [
                [
                  {
                    text: 'CONTENIDO',
                    bold: true,
                    colSpan: 2,
                    fontSize,
                    alignment: 'center',
                    margin: [20, 2, 20, 8],
                    fillColor: '#76D6FF',
                  },
                  {},
                ],
                [
                  {
                    text: 'TEMA',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  this.renderContent(data.TEMA, fontSize, [10, 2, 10, 8]),
                ],
                [
                  {
                    text: 'SUBTEMA',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  this.renderContent(data.SUBTEMA, fontSize, [10, 2, 10, 8]),

                ],
                [
                  {
                    text: 'PALABRAS CLAVES',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  {
                    text: data.KEYWORDS,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                ],
                [
                  {
                    text: 'SÍNTESIS',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  this.renderContent(data.SHORTSUMMARY, fontSize, [10, 2, 10, 8], 1),
                ],
                [
                  {
                    text: 'FUNDAMENTOS JURÍDICOS RELEVANTES',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8]
                  },

                  {
                    ...this.renderContent(data.RESUMEN, fontSize, [10, 2, 10, 8]),
                    italics: true,
                  }
                ],
                [
                  {
                    text: 'IDENTIFICACIÓN',
                    bold: true,
                    fontSize,
                    colSpan: 2,
                    alignment: 'center',
                    margin: [10, 2, 10, 8],
                    fillColor: '#76D6FF',
                  },
                  {},
                ],
                [
                  {
                    text: 'ÁMBITO',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  {
                    text: returnBase64 ? data?.AMBIT?.[0]?.LABEL : data?.AMBIT,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                ],
                [
                  {
                    text: 'FECHA DE RESOLUCIÓN',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  {
                    text: returnBase64 ?
                      this.formateReverse(data?.FRESOLUTION) : data?.FRESOLUTIONSTRING,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                ],
                [
                  {
                    text: 'JURISDICCIÓN',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  {
                    text: returnBase64 ? data?.JURISDICCION?.[0]?.LABEL : data?.JURISDICCION || '-',
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                ],
                [
                  {
                    text: 'ÓRGANO JURISDICCIONAL',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  {
                    text: returnBase64 ? data?.OJURISDICCIONAL?.[0]?.DESCP : data.OJURISDICCIONAL,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                ],
                [
                  {
                    text: 'MAGISTRADOS',
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  {
                    text: returnBase64 ? data?.MAGISTRATES?.[0]?.LABEL : data.MAGISTRATES,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                ],
                [
                  {
                    text: ['VOTO DISIDENTE\n', {
                      text: 'Voto que discrepa del fallo final adoptado.', fontSize: fontSize - 2, bold: false, italics: true
                    }],
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  {
                    text: data?.VDESIDENTE?.replace(/,/g, ', ') || '-',
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                ],
                [
                  {
                    text: ['VOTO CONCURRENTE\n', {
                      text: 'Voto que disiente de la argumentación jurídica, pero no del fallo final adoptado.',
                      fontSize: fontSize - 1, bold: false,
                      italics: true
                    }],
                    bold: true,
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                  {
                    text: data?.CVOTE?.replace(/,/g, ', ') || '-',
                    fontSize,
                    margin: [10, 2, 10, 8],
                  },
                ],
              ],
            },
          },
          ...(data?.MOSTRAR_DISCLAIMER && data?.DISCLAIMER_TEXTO ? [this.disclaimerBlock(data.DISCLAIMER_TEXTO)] : []),
        ],
        styles: {
          FontFace: 'Calibri',
          headerStyle: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 5],
          },
          tableExample: {
            margin: [margin[0], 10, margin[2], 10],
            FontFace: 'Calibri',
          },
          footer: {
            font: 'TimesNewRoman',
            fontSize: 10,
            margin: [40, 40, 40, 10],
          },
        },
        footer: function (currentPage, pageCount) {
          if (currentPage > totalPages) {
            totalPages = currentPage;
          }
          return {
            style: 'footer',
            stack: [
              {
                columns: [
                  { width: '*', text: ``, alignment: 'left', color: 'transparent' },
                  { width: 'auto', text: 'www.', alignment: 'center', color: 'gray' },
                  { width: 'auto', text: 'jurissearch', alignment: 'center', color: '#e81eb2', link: `${process.env.VUE_APP_SITE_URL || 'https://jurissearch.com'}/` },
                  { width: 'auto', text: '.com', alignment: 'center', color: 'gray' },
                  { width: '*', text: `Página ${currentPage} de ${pageCount}`, alignment: 'right' },
                ],
              },
              {
                text: `© ${currentYear} JURIS SEARCH - TODOS LOS DERECHOS RESERVADOS`,
                font: 'TimesNewRoman',
                alignment: 'right',
                color: 'gray',
                margin: [0, 10, 40, 0]
              }
            ]
          };
        },

        pageMargins: [40, 100, 40, 90],
      }

      // pdfMake.vfs = await pdfFonts.pdfMake.vfs;
      pdfMake.vfs = {
        "TimesNewRoman.ttf": timesNewRoman,
        "Roboto-Medium.ttf": timesNewRomanBold,
        "Roboto-Regular.ttf": timesNewRoman,
        "Roboto-Italics.ttf": timesNewRomanItalics,
      };
      pdfMake.fonts = {
        TimesNewRoman: {
          normal: "TimesNewRoman.ttf",
          bold: "TimesNewRoman.ttf",
          italics: "TimesNewRoman.ttf",
          bolditalics: "TimesNewRoman.ttf",
        },
        Roboto: {
          normal: "Roboto-Regular.ttf",
          bold: "Roboto-Medium.ttf",
          italics: "Roboto-Italics.ttf",
        }
      };

      let pdfDocGenerator = pdfMake.createPdf(documentoPDF);
      if (returnBase64) {
        return await new Promise((resolve) => {
          pdfDocGenerator.getBase64((base64Data) => {
            resolve(base64Data);
          })
        });
      } else {
        pdfDocGenerator.download((`${data.TITLE} - RESUMEN EJECUTIVO`).toUpperCase() + '.pdf');
      }

    } catch (error) {
      console.log(error)
      toast.error(error?.MESSAGE || 'Error al obtener el archivo', { toastId: 'error-export' });
    }
  }

  // Advertencia/disclaimer justo despues de la tabla de contenido. Sin
  // borde/cursiva/comillas, 80% de ancho centrado (columnas 10%-80%-10%).
  // unbreakable evita que pdfMake lo corte entre dos paginas: si no entra
  // en el espacio restante de la pagina actual, lo mueve entero a la
  // siguiente.
  disclaimerBlock(texto) {
    let clean = this.decodeHtmlEntities(texto);
    if (Array.isArray(clean)) clean = clean.join(' ');
    return {
      columns: [
        { width: '10%', text: '' },
        {
          width: '80%',
          text: [
            { text: 'Advertencia: ', bold: true },
            { text: clean },
          ],
          fontSize: 9,
          alignment: 'justify',
        },
        { width: '10%', text: '' },
      ],
      margin: [0, 15, 0, 0],
      unbreakable: true,
    };
  }

  // Botón "Consultar Resolución" para entradas con REQUIERE_ENLACE_EXTERNO:
  // no hay archivo que descargar, así que en vez de la imagen de
  // botonDescargarResolucion se dibuja un botón sólido que enlaza a la
  // fuente oficial (ENLACE_OFICIAL).
  consultarResolucionButton(enlace) {
    const w = 160;
    const h = 26;
    return {
      stack: [
        { canvas: [{ type: 'rect', x: 0, y: 0, w, h, r: h / 2, color: '#FF8AD8' }] },
        {
          text: 'CONSULTAR RESOLUCIÓN',
          bold: true,
          color: '#fff',
          fontSize: 9,
          alignment: 'center',
          relativePosition: { x: 0, y: -(h / 2 + 6) },
        },
      ],
      link: enlace,
      margin: [0, 10, 0, 10],
    };
  }

  renderContent(content, fontSize, margin) {
    let decodedContent = this.decodeHtmlEntities(content);
    if (Array.isArray(decodedContent)) {
      return {
        ul: decodedContent,
        fontSize,
        alignment: 'justify',
        margin
      };
    }

    return {
      text: decodedContent,
      fontSize,
      alignment: 'justify',
      margin
    };
  }

  decodeHtmlEntities(text) {
    if ([null, undefined].includes(text)) return "";

    text = text.replace(/&[a-z]+;/g, '');

    try {
      text = text.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n');

      if (text.includes('<ul>')) {
        let t = text.split('<li>').map((item) => {
          item = item.replace(/<\/?[^>]+(>|$)/g, '');
          return item;
        }).filter((item) => item.trim() !== '');

        return t;
      }

      return text.replace(/<[^>]*>?/gm, '');
    } catch (error) {
      return text.replace(/<[^>]*>?/gm, '');
    }
  }

  formateReverse(date) {
    try {
      if (!date) return null;
      const parts = date.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    } catch (error) {
      console.error("Error al formatear la fecha:", error);
      return null;
    }
  }

}

export default new createPDFHelper();