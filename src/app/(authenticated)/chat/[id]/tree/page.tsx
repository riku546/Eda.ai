"use client";

import Sidebar from "@/components/common/Sidebar";
import { apiClient } from "@/lib/trpc";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { RawNodeDatum } from "react-d3-tree";

// Tree はクライアントのみで描画
const Tree = dynamic(() => import("react-d3-tree").then((m) => m.default), {
  ssr: false,
});

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [translate, setTranslate] = useState<{ x: number; y: number }>();
  const [branchStructure, setBranchStructure] = useState<RawNodeDatum>();
  const [isChecked, setIsChecked] = useState(false);

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
    <div className="w-full h-screen flex">
      <Sidebar />

      <div id="treeWrapper" style={{ width: "100%", height: "100%" }}>
        <Tree
          data={branchStructure}
          translate={translate}
          collapsible={false}
          enableLegacyTransitions
          zoomable
          onNodeClick={(node) => {
            if (node.data.attributes) {
              router.push(
                `/chat/${params.id}/branch/${node.data.attributes.id}`,
              );
            }
          }}
        />
      </div>
      <FormGroup className="w-30 flex  items-center">
        <FormLabel component="legend">merge mode</FormLabel>
        <FormControlLabel
          control={
            <Switch
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
          }
          label=""
        />
      </FormGroup>
    </div>
  );
}
