import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TREND_DATA = [
  { dia: 'Lun', pedidos: 12, ingresos: 180000 },
  { dia: 'Mar', pedidos: 19, ingresos: 290000 },
  { dia: 'Mié', pedidos: 8,  ingresos: 120000 },
  { dia: 'Jue', pedidos: 24, ingresos: 360000 },
  { dia: 'Vie', pedidos: 16, ingresos: 240000 },
  { dia: 'Sáb', pedidos: 31, ingresos: 470000 },
  { dia: 'Dom', pedidos: 7,  ingresos: 105000 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-night-purple/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-semibold text-white/60 mb-1">{label}</p>
      <p className="text-sm font-bold text-lavender">{payload[0].value} pedidos</p>
    </div>
  );
}

export default function TrendChart() {
  return (
    <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-6 min-h-[320px]">
      <h3 className="text-sm font-semibold text-white mb-4">Pedidos — Últimos 7 días</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={TREND_DATA} barCategoryGap="20%">
          <XAxis
            dataKey="dia"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar
            dataKey="pedidos"
            fill="#8960F6"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
