// ============================================================================
// 🔐 UTILIDADES DE SEGURIDAD Y TOKEN
// ============================================================================

const TOKEN_KEY = 'smartlogix_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  // Disparamos el evento global para que App.jsx renderice el Login
  window.dispatchEvent(new Event("smartlogix:unauthorized"));
}

export function decodeTokenPayload() {
  const token = getToken();
  if (!token) return null;
  
  try {
    // El JWT tiene 3 partes separadas por punto: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decodificando el token", e);
    return null;
  }
}

export function isTokenExpired() {
  const payload = decodeTokenPayload();
  if (!payload || !payload.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
}


// ============================================================================
// 🌐 INTERCEPTOR HTTP (El núcleo de comunicación)
// ============================================================================

const API_GATEWAY_URL = 'http://localhost:8080';

/**
 * Función central para hacer peticiones al API Gateway.
 * Se encarga de inyectar el token y manejar respuestas 401/403.
 */
async function fetchWithAuth(endpoint, options = {}) {
  const token = getToken();
  
  // Si el token expiró antes de siquiera hacer la petición, lo sacamos
  if (token && isTokenExpired()) {
    logout();
    throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_GATEWAY_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Si el API Gateway nos rechaza el token (401 o 403)
    if (response.status === 401 || response.status === 403) {
      logout();
      throw new Error("Acceso denegado o token inválido");
    }

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en fetchWithAuth [${endpoint}]:`, error);
    throw error;
  }
}


// ============================================================================
// 📦 SERVICIOS DE NEGOCIO (Los llamados reales a tus microservicios)
// ============================================================================

/**
 * Obtiene todos los pedidos desde el microservicio de pedidos.
 */
export async function getPedidos() {
  try {
    // Asegúrate de que la ruta coincida con tu configuración de Spring Cloud Gateway
    return await fetchWithAuth('/pedidos');
  } catch (error) {
    console.error("No se pudieron cargar los pedidos", error);
    return []; // Retornamos array vacío para que la tabla no se rompa
  }
}

/**
 * Obtiene los KPIs consolidados desde el BFF.
 */
export async function getDashboardKPIs() {
  try {
    // Suponiendo que tu BFF expone esta ruta. Ajustar según tu controlador
    return await fetchWithAuth('/bff/kpis');
  } catch (error) {
    console.warn("BFF no respondió, cargando KPIs por defecto (Fallback)", error);
    // Fallback temporal mientras el BFF se termina de construir
    return {
      totalPedidos: 0,
      ingresos: 0,
      entregados: 0,
      pendientes: 0
    };
  }
}

/**
 * Obtiene el detalle de un pedido en particular (Vital para el Patrón Saga)
 */
export async function getDetallePedido(id) {
  return await fetchWithAuth(`/pedidos/${id}`);
}