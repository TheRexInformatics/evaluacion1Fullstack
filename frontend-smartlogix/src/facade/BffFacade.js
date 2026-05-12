/**
 * BffFacade.js — SmartLogix
 * Capa centralizada de comunicación con el API Gateway (puerto 8080).
 * Todos los containers importan desde aquí. Nunca usan fetch directamente.
 *
 * Arquitectura:
 *   Browser → API Gateway (:8080) → bff-service / pedidos-service / auth-service
 */

// ── Configuración ─────────────────────────────────────────────────────────────
const GATEWAY_URL  = import.meta.env.VITE_GATEWAY_URL  ?? "http://localhost:8080";
const AUTH_URL     = `${GATEWAY_URL}/auth`;
const BFF_URL      = `${GATEWAY_URL}/bff`;
const PEDIDOS_URL  = `${GATEWAY_URL}/api/pedidos`;

// ── Token helpers ─────────────────────────────────────────────────────────────
export function getToken()          { return localStorage.getItem("smartlogix_token"); }
export function setToken(token)     { localStorage.setItem("smartlogix_token", token); }
export function removeToken()       { localStorage.removeItem("smartlogix_token"); }
export function isAuthenticated()   { return !!getToken(); }

/**
 * Decodifica el payload del JWT sin verificar firma (solo para leer claims en el cliente).
 * La verificación real ocurre en el API Gateway.
 */
export function decodeTokenPayload() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

/**
 * Verifica si el token ha expirado (claim `exp` en segundos Unix).
 */
export function isTokenExpired() {
  const payload = decodeTokenPayload();
  if (!payload?.exp) return true;
  return Date.now() / 1000 > payload.exp;
}

// ── Base fetch con Authorization header ───────────────────────────────────────
async function apiFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  // Token expirado / inválido → forzar logout
  if (res.status === 401) {
    removeToken();
    window.dispatchEvent(new Event("smartlogix:unauthorized"));
    throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Error ${res.status}: ${res.statusText}`);
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

// ═════════════════════════════════════════════════════════════════════════════
// AUTH
// ═════════════════════════════════════════════════════════════════════════════

/**
 * POST /auth/login
 * @param {{ username: string, password: string }} credentials
 * @returns {{ token: string, user: { name: string, role: string } }}
 */
export async function login({ username, password }) {
  const data = await apiFetch(`${AUTH_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  return data;
}

/**
 * Cierra sesión eliminando el token local.
 */
export function logout() {
  removeToken();
}

// ═════════════════════════════════════════════════════════════════════════════
// BFF — Dashboard
// ═════════════════════════════════════════════════════════════════════════════

/**
 * GET /bff/dashboard
 * Retorna KPIs, pedidos recientes, alertas de stock y actividad del sistema.
 */
export async function getDashboardData() {
  return apiFetch(`${BFF_URL}/dashboard`);
}

// ═════════════════════════════════════════════════════════════════════════════
// PEDIDOS — pedidos-service vía Gateway
// ═════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/pedidos
 * @param {{ sagaStatus?: string, clienteId?: string, fechaDesde?: string, fechaHasta?: string }} filters
 */
export async function getPedidos(filters = {}) {
  const params = new URLSearchParams();
  if (filters.sagaStatus && filters.sagaStatus !== "ALL") params.set("sagaStatus", filters.sagaStatus);
  if (filters.clienteId?.trim())  params.set("clienteId",  filters.clienteId.trim());
  if (filters.fechaDesde)         params.set("fechaDesde",  filters.fechaDesde);
  if (filters.fechaHasta)         params.set("fechaHasta",  filters.fechaHasta);

  const qs = params.toString();
  return apiFetch(`${PEDIDOS_URL}${qs ? `?${qs}` : ""}`);
}

/**
 * GET /api/pedidos/:id
 * Incluye `motivoFallo` cuando sagaStatus === "CANCELLED".
 */
export async function getPedidoById(id) {
  return apiFetch(`${PEDIDOS_URL}/${id}`);
}

/**
 * POST /api/pedidos
 * @param {{ clienteId: string, items: number, total: number, fecha: string }} payload
 */
export async function createPedido(payload) {
  return apiFetch(PEDIDOS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * PATCH /api/pedidos/:id
 * @param {string} id
 * @param {{ clienteId?: string, items?: number, total?: number, fecha?: string }} payload
 */
export async function updatePedido(id, payload) {
  return apiFetch(`${PEDIDOS_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/pedidos/:id/cancel
 * Inicia la transacción de compensación Saga en el pedidos-service.
 */
export async function cancelPedido(id) {
  return apiFetch(`${PEDIDOS_URL}/${id}/cancel`, { method: "POST" });
}
