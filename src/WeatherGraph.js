// WeatherGraph.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function WeatherGraph({ hours = [], temperatures = [], icons = [] }) {
  const data = {
    labels: hours,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatures,
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        // dynamically create gradient AFTER chartArea is known
        borderColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "#3399ff";
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "#3399ff");
          gradient.addColorStop(0.5, "#ff9933");
          gradient.addColorStop(1, "#ff3333");
          return gradient;
        },
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(51,153,255,0.3)";
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(51, 153, 255, 0.25)");
          gradient.addColorStop(0.5, "rgba(255, 153, 51, 0.2)");
          gradient.addColorStop(1, "rgba(255, 51, 51, 0.15)");
          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}°C` } },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { callback: (val) => `${val}°` },
      },
    },
  };

  // custom plugin to draw emojis or icon text above each point
  const emojiPlugin = {
    id: "emojiPlugin",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      meta.data.forEach((point, i) => {
        if (!icons[i]) return;
        ctx.save();
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#333";
        ctx.fillText(icons[i], point.x, point.y - 14);
        ctx.restore();
      });
    },
  };

  return (
    <div style={{ width: "100%", height: 300 }}>
      <Line data={data} options={options} plugins={[emojiPlugin]} />
    </div>
  );
}
