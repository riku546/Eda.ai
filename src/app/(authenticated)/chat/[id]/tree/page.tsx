"use client";

import { apiClient } from "@/lib/trpc";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { RawNodeDatum } from "react-d3-tree";

// Tree はクライアントのみで描画
const Tree = dynamic(() => import("react-d3-tree").then((m) => m.default), {
  ssr: false,
});

export default function Page() {
  const params = useParams();

  const [mounted, setMounted] = useState(false);
  const [translate, setTranslate] = useState<{ x: number; y: number }>();
  const [branchStructure, setBranchStructure] = useState<RawNodeDatum>();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // データ取得（クライアントでのみ実行）
    (async () => {
      const res = await apiClient.project.chat.branch.structure.query({
        chatId: params.id as string,
      });
      setBranchStructure(res);
    })();

    // レイアウト計算（クライアントでのみ実行）
    const handleResize = () => {
      setTranslate({
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted, params.id]);

  if (!mounted || !translate || !branchStructure) return null;

  return (
    <div className="w-full h-screen">
      <div id="treeWrapper" style={{ width: "100%", height: "100%" }}>
        <Tree
          data={branchStructure}
          translate={translate}
          enableLegacyTransitions
          zoomable
        />
      </div>
    </div>
  );
}
