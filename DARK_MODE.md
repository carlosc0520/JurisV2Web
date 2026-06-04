# 🌓 Modo Oscuro - Juris Search

## Implementación Completa del Tema Oscuro

Este documento describe la implementación del modo oscuro en la aplicación Juris Search.

## 📋 Características

- ✅ Cambio dinámico entre modo claro y oscuro
- ✅ Persistencia de preferencia en localStorage
- ✅ Transiciones suaves entre temas
- ✅ Botón de toggle disponible en todos los navbars
- ✅ Estilos adaptativos para componentes personalizados
- ✅ Compatible con todas las páginas de la aplicación

## 🚀 Uso

### Para Usuarios

**Toggle del Modo Oscuro:**
- El botón de cambio de tema aparece en la barra de navegación (icono de sol/luna)
- Hacer clic alterna entre modo claro y oscuro
- La preferencia se guarda automáticamente y persiste entre sesiones

**Ubicaciones del Toggle:**
- **IndexNavbar**: Navbar principal de la página de inicio
- **AdminNavbar**: Navbar del panel de administración
- **AuthNavbar**: Navbar de autenticación

### Para Desarrolladores

#### 1. **Estructura de Archivos Creados/Modificados**

```
src/
├── components/
│   ├── DarkModeToggle.vue          # ✨ NUEVO - Componente toggle
│   └── Navbars/
│       ├── IndexNavbar.vue         # ✏️ Actualizado
│       ├── AdminNavbar.vue         # ✏️ Actualizado
│       └── AuthNavbar.vue          # ✏️ Actualizado
├── store/
│   ├── store.js                    # ✏️ Actualizado
│   └── modules/
│       └── theme.js                # ✨ NUEVO - Módulo Vuex para tema
├── App.vue                         # ✏️ Actualizado
└── assets/
    └── styles/
        └── index.css               # ✏️ Actualizado

tailwind.config.js                  # ✏️ Actualizado
```

#### 2. **Configuración de Tailwind**

El modo oscuro usa la estrategia `class`:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

Esto significa que las clases oscuras solo se aplican cuando el elemento padre tiene la clase `dark`.

#### 3. **Store de Vuex (theme.js)**

**Estado:**
```js
state: {
  darkMode: localStorage.getItem('darkMode') === 'true' || false
}
```

**Getters:**
- `isDarkMode`: Retorna el estado actual del tema

**Mutations:**
- `TOGGLE_DARK_MODE`: Alterna el modo oscuro
- `SET_DARK_MODE`: Establece un valor específico

**Actions:**
- `toggleDarkMode`: Alterna el tema
- `setDarkMode`: Establece el tema (true/false)
- `initializeTheme`: Inicializa el tema desde localStorage

#### 4. **Uso en Componentes**

**Importar el Toggle:**
```vue
<template>
  <<!-- <dark-mode-toggle class="mr-3" /> --> />
</template>

<script>
import DarkModeToggle from "@/components/DarkModeToggle.vue";

export default {
  components: {
    DarkModeToggle
  }
}
</script>
```

**Acceder al Estado del Tema:**
```vue
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters('theme', ['isDarkMode'])
  },
  methods: {
    ...mapActions('theme', ['toggleDarkMode', 'setDarkMode'])
  }
}
</script>
```

#### 5. **Aplicar Estilos para Modo Oscuro**

**Con Tailwind CSS:**
```vue
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Contenido que cambia de color
</div>
```

**Con CSS Personalizado:**
```css
.mi-elemento {
  background-color: white;
  color: #333;
}

.dark .mi-elemento {
  background-color: #1a202c;
  color: #e2e8f0;
}
```

#### 6. **Paleta de Colores Recomendada**

**Modo Claro:**
- Fondo principal: `#FFFFFF`
- Fondo secundario: `#F7FAFC`
- Texto principal: `#2D3748`
- Texto secundario: `#4A5568`

**Modo Oscuro:**
- Fondo principal: `#1A202C` (gray-900)
- Fondo secundario: `#2D3748` (gray-800)
- Texto principal: `#E2E8F0` (gray-200)
- Texto secundario: `#CBD5E0` (gray-400)

**Colores de Acento (Mantienen su gradiente):**
- Gradiente principal: `#DF2DB2` → `#185CE6`
- En modo oscuro se usa una versión ligeramente más clara para mejor contraste

## 🎨 Personalización

### Modificar Colores del Modo Oscuro

Edita `src/assets/styles/index.css`:

```css
.dark body {
    background-color: #TU_COLOR !important;
    color: #TU_COLOR_TEXTO !important;
}
```

### Agregar el Toggle a Nuevos Componentes

1. Importa el componente:
```vue
import DarkModeToggle from "@/components/DarkModeToggle.vue";
```

2. Regístralo:
```vue
components: {
  DarkModeToggle
}
```

3. Úsalo en el template:
```vue
<<!-- <dark-mode-toggle class="mr-3" /> --> />
```

### Crear Estilos Responsivos al Tema

```css
/* Elemento base */
.mi-componente {
  background: white;
  transition: background-color 0.3s ease;
}

/* Modo oscuro */
.dark .mi-componente {
  background: #1a202c;
}
```

## ⚙️ Configuración Avanzada

### Programáticamente Cambiar el Tema

```vue
<script>
export default {
  methods: {
    cambiarATemaOscuro() {
      this.$store.dispatch('theme/setDarkMode', true);
    },
    cambiarATemaClaro() {
      this.$store.dispatch('theme/setDarkMode', false);
    },
    alternarTema() {
      this.$store.dispatch('theme/toggleDarkMode');
    }
  }
}
</script>
```

### Detectar el Tema Actual

```vue
<template>
  <div v-if="isDarkMode">
    Contenido solo para modo oscuro
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('theme', ['isDarkMode'])
  }
}
</script>
```

## 🐛 Solución de Problemas

**Problema: Los estilos oscuros no se aplican**
- Verifica que `tailwind.config.js` tenga `darkMode: 'class'`
- Asegúrate de que el elemento raíz tenga la clase `dark`
- Revisa que las clases Tailwind incluyan el prefijo `dark:`

**Problema: El tema no persiste entre sesiones**
- Verifica que localStorage esté habilitado en el navegador
- Comprueba que `App.vue` llame a `initializeTheme()` en `mounted()`

**Problema: El toggle no aparece**
- Asegúrate de importar y registrar `DarkModeToggle` en el componente
- Verifica que el componente esté en la ruta correcta

## 📚 Recursos Adicionales

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Vuex Documentation](https://vuex.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

## 🎯 Próximas Mejoras

- [ ] Modo automático según preferencia del sistema
- [ ] Transiciones más elaboradas
- [ ] Temas personalizables (no solo claro/oscuro)
- [ ] Modo de alto contraste para accesibilidad

---

**Desarrollado para Juris Search** 🔍⚖️
*Última actualización: Abril 2026*
