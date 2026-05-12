/**
 * pedidosFacade.js
 * Facade Layer — SmartLogix
 * Toda comunicación con el BFF de Pedidos pasa por aquí.
 * Los containers importan SOLO desde este archivo, nunca fetch directo.
 */

const BASE_URL = "/api/pedidos"; // Reemplaza con tu BFF real

// ── Datos simulados (reemplazar cuando el BFF esté listo) ──────────────────
const MOCK_PEDIDOS = [
  { id: "ORD-9021", client: "Distribuidora Norte",   items: 14, total: 2450, status: "CONFIRMED", fecha: "2026-04-22", hora: "08:11" },
  { id: "ORD-9020", client: "Mercados del Sur S.A.", items: 6,  total: 890,  status: "PENDING",   fecha: "2026-04-22", hora: "08:03" },
  { id: "ORD-9019", client: "LogiCorp Chile",        items: 22, total: 5120, status: "CONFIRMED", fecha: "2026-04-21", hora: "17:45" },
  { id: "ORD-9018", client: "Retail Express",        items: 3,  total: 210,  status: "CANCELLED", fecha: "2026-04-21", hora: "16:30" },
  { id: "ORD-9017", client: "Grupo Andino",          items: 9,  total: 1670, status: "PENDING",   fecha: "2026-04-21", hora: "14:10" },
  { id: "ORD-9016", client: "FastCargo Ltda.",       items: 5,  total: 980,  status: "CONFIRMED", fecha: "2026-04-20", hora: "11:22" },
  { id: "ORD-9015", client: "Sur Abastecimientos",   items: 18, total: 3340, status: "CANCELLED", fecha: "2026-04-20", hora: "09:55" },
  { id: "ORD-9014", client: "Distribuidora Norte",   items: 7,  total: 1100, status: "CONFIRMED", fecha: "2026-04-19", hora: "13:40" },
];

let _mockStore = [...MOCK_PEDIDOS];
let _nextId = 9022;

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ── GET /pedidos ───────────────────────────────────────────────────────────
export async function getPedidos(filters = {}) {
  await delay();
  // TODO: const params = new URLSearchParams(filters);
  //       const res = await fetch(`${BASE_URL}?${params}`);
  //       if (!res.ok) throw new Error("Error al obtener pedidos");
  //       return res.json();

  let result = [..._mockStore];
  if (filters.status && filters.status !== "ALL")
    result = result.filter((p) => p.status === filters.status);
  if (filters.fechaDesde)
    result = result.filter((p) => p.fecha >= filters.fechaDesde);
  if (filters.fechaHasta)
    result = result.filter((p) => p.fecha <= filters.fechaHasta);

  return result.sort((a, b) => b.id.localeCompare(a.id));
}

// ── POST /pedidos ──────────────────────────────────────────────────────────
export async function createPedido(payload) {
  await delay(800);
  // TODO: const res = await fetch(BASE_URL, { method: "POST", ... });

  const nuevo = {
    id: `ORD-${_nextId++}`,
    ...payload,
    status: "PENDING",
    hora: new Date().toTimeString().slice(0, 5),
  };
  _mockStore.unshift(nuevo);
  return nuevo;
}

// ── PATCH /pedidos/:id ─────────────────────────────────────────────────────
export async function updatePedido(id, payload) {
  await delay(700);
  // TODO: const res = await fetch(`${BASE_URL}/${id}`, { method: "PATCH", ... });

  _mockStore = _mockStore.map((p) => (p.id === id ? { ...p, ...payload } : p));
  return _mockStore.find((p) => p.id === id);
}

// ── POST /pedidos/:id/cancel — Saga compensation ───────────────────────────
export async function cancelPedido(id) {
  await delay(700);
  // TODO: const res = await fetch(`${BASE_URL}/${id}/cancel`, { method: "POST" });

  _mockStore = _mockStore.map((p) =>
    p.id === id ? { ...p, status: "CANCELLED" } : p
  );
  return _mockStore.find((p) => p.id === id);
}
