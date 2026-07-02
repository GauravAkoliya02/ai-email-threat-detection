import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

function ThreatPieChart({ stats }) {
  const data = [
    {
      name: "Safe",
      value: stats?.safe || 0,
    },
    {
      name: "Suspicious",
      value: stats?.suspicious || 0,
    },
    {
      name: "Phishing",
      value: stats?.phishing || 0,
    },
  ];

  return (
    <div className="info-box">
      <h3
        style={{
          color: "#fff",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        📊 Threat Distribution
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={5}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ThreatPieChart;