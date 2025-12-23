import { useEffect, useState } from "react";
import { projectsStatsApi } from "../../../../../api/statsApi";
import type { ProjectItem } from "../projects/hooks/useProjects";
import { MonthlyChart } from "./MonthlyChart";


interface StatsData {
  total: number;
  lastProjects: ProjectItem[]
  projectsCurrentMonthByDate: { date: string; count: number }[];
  projectsLastMonthByDate: { date: string; count: number }[];
}

export const Stats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchTotalProjects = async () => {
      try {
        const data = await projectsStatsApi();
        console.log(data)
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching total projects:", error);
      }
    }
    fetchTotalProjects();
  }, []);

  return (
    <section className="bg-white p-8 rounded-lg shadow-md flex gap-4 text-xs h-[calc(100vh-560px)] dark:bg-dark-section">
      {/* <article className="bg-white p-4 rounded-lg shadow-md flex gap-4 text-xs">
        <p>Total Projects:</p>
        <p>{stats?.total}</p>
      </article> */}
      <MonthlyChart currentMonth={stats?.projectsCurrentMonthByDate || []} lastMonth={stats?.projectsLastMonthByDate || []} />
    </section>
  );
}