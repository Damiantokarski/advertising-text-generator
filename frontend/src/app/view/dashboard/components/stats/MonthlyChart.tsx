import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);


interface MonthlyChartProps {
  currentMonth: { date: string; count: number }[];
  lastMonth: { date: string; count: number }[];
}

const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;

    const update = () => setIsDark(el.classList.contains("dark"));
    update();

  
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });

    return () => obs.disconnect();
  }, []);

  return isDark;
};

export const MonthlyChart = ({ currentMonth, lastMonth }: MonthlyChartProps) => {
  const isDark = useIsDarkMode();
 
  const textColor = isDark ? "rgba(226, 232, 240, 0.9)" : "rgba(15, 23, 42, 0.9)"; 
  const gridColor = isDark ? "rgba(148, 163, 184, 0.18)" : "rgba(148, 163, 184, 0.35)"; 
  const tooltipBg = isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)";
  const tooltipBorder = isDark ? "rgba(148, 163, 184, 0.35)" : "rgba(15, 23, 42, 0.15)";

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        color: textColor,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Projects Created - Current vs Last Month",
        color: textColor,

      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        titleColor: textColor,
        bodyColor: textColor,
        padding: 10,
      },

    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor, precision: 0 },
        grid: { color: gridColor },
        beginAtZero: true,
      },
    },
    elements: {
      point: { radius: 2, hoverRadius: 4 },
      line: { borderJoinStyle: "round" as const },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Current Month",
        data: currentMonth?.map((data) => data.count),
        borderColor: isDark ? "#0a78c7" : "#68b6ef",

        backgroundColor: isDark ? "#0a78c7" : "#68b6ef",
        tension: 0.4,
        borderWidth: 1.5,
      },
      {
        label: "Last Month",
        data: lastMonth?.map((data) => data.count),
        borderColor: "#fcce44",
        backgroundColor: "#fcce44",
        tension: 0.5,
        borderWidth: 1.5,
      },
    ],
  };

  return <Line options={options} data={data} />;
};