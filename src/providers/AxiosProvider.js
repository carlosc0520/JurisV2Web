// import { app } from "@/main";
import axios from "axios";
import Swal from 'sweetalert2';
// import { AUTH_LOGOUT } from "@/store/actions/auth";

axios.defaults.headers.common.Accept = "application/json";

// Variable para evitar múltiples refresh simultáneos
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axios.interceptors.request.use(
  (request) => {
    // Solo agregar base URL si es una URL relativa (API call)
    if (request.url && !request.url.startsWith('http')) {
      // request.url = "http://localhost:3000" + request.url;
      request.url = "https://api.jurissearch.com" + request.url;
    }
    
    // const token = app.$store.state.auth.token;
    const token = localStorage.getItem('accessToken');

    let isTokenAdd = false;
    if (request.url && request.url.includes("auth")) {
      isTokenAdd = true;
    }

    if (token && token !== "" && !isTokenAdd) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no estamos en login/refresh y no hemos reintentado
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('/login/autenticar') &&
        !originalRequest.url.includes('/login/refresh')) {
      
      // Verificar si estamos en una ruta de autenticación
      const currentPath = window.location.pathname;
      const isAuthRoute = currentPath.includes('/auth/');
      
      // Si estamos en login/register, NO intentar refresh automático
      if (isAuthRoute) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Si ya estamos refrescando, encolar la petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No hay refresh token - limpieza silenciosa
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Solo redirigir si NO estamos ya en rutas de autenticación
        if (!isAuthRoute) {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(error);
      }

      try {
        // Intentar renovar el token
        const response = await axios.post('/login/refresh', { refreshToken });
        
        if (response.data && response.data.accessToken && response.data.refreshToken) {
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Guardar nuevos tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Actualizar header del request original
          originalRequest.headers.Authorization = 'Bearer ' + accessToken;
          
          // Procesar cola de peticiones fallidas
          processQueue(null, accessToken);
          isRefreshing = false;
          
          // Reintentar request original
          return axios(originalRequest);
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      } catch (refreshError) {
        // Error al renovar token - refresh token expirado o inválido
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Limpiar tokens siempre
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // IMPORTANTE: Verificar si el logout fue intencional
        const isLoggingOut = localStorage.getItem('isLoggingOut') === 'true';
        
        // Verificar la ruta NUEVAMENTE aquí, porque puede haber cambiado
        const currentPathNow = window.location.pathname;
        const isAuthRouteNow = currentPathNow.includes('/auth/');
        
        // Limpiar el flag de logout
        localStorage.removeItem('isLoggingOut');
        
        // Solo mostrar alerta si NO estamos en rutas auth Y NO es logout intencional
        if (!isAuthRouteNow && !isLoggingOut) {
          Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu tiempo de sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonColor: '#8B5CF6',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            // Redirigir al login después de que el usuario cierre la alerta
            window.location.href = '/auth/login';
          });
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data);
  }
);
