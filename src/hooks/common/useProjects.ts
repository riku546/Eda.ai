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
        // エラー時はダミーデータを使用
        setProjects([
          { id: "proj-1", name: "Project Alpha" },
          { id: "proj-2", name: "Project Beta" },
          { id: "proj-3", name: "Project Gamma" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
