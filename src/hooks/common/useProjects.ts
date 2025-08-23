import { apiClient } from "@/lib/trpc";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const project_list = await apiClient.project.list.query();
        setProjects(project_list);
      } catch (err) {
        console.error("プロジェクト取得エラー:", err);
        setError("プロジェクトの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
