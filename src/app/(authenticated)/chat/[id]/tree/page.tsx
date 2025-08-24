"use client";

import PageContainer from "@/components/common/PageContainer";
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
    if (typeof params.id !== "string") return;
    (async () => {
      try {
        // Sidebar から渡される chatId は chat テーブルのものなので project ではなく chat ルーターを利用する
        const res = await apiClient.chat.branch.structure.query({
          chatId: params.id as string,
        });
        setBranchStructure(res);
      } catch (e) {
        console.error("Failed to fetch branch structure (chat):", e);
      }
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

  type BranchNodeDatum = RawNodeDatum & {
    id?: string;
    attributes?: { id?: string };
  };

  const renderCustomNode = ({ nodeDatum }: { nodeDatum: BranchNodeDatum }) => {
    const W = 200;
    const H = 50;
    const branchId = nodeDatum?.attributes?.id || nodeDatum?.id;
    const isLeaf = !nodeDatum.children || nodeDatum.children.length === 0;

    const handleBranchNavigation = () => {
      if (branchId) router.push(`/chat/${params.id}/branch/${branchId}`);
    };
    return (
      <g
        role={branchId ? "button" : undefined}
        tabIndex={branchId ? 0 : -1}
        onClick={handleBranchNavigation}
        onKeyDown={(e) => {
          if (!branchId) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleBranchNavigation();
          }
        }}
        style={{ cursor: branchId ? "pointer" : "default" }}
      >
        {/* 背景と枠線 */}
        <rect
          width={W}
          height={H}
          x={-W / 2}
          y={-H / 2}
          rx={6}
          ry={6}
          fill={isLeaf ? "#222" : "#000"} // 子ノードがない場合は色を変更
          stroke="#222"
          strokeWidth={1}
        />
        <rect
          width={W - 6}
          height={H - 6}
          x={-(W - 6) / 2}
          y={-(H - 6) / 2}
          rx={4}
          ry={4}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={1}
        />
        {/* テキストを foreignObject でラップ */}
        <foreignObject x={-W / 2} y={-H / 2} width={W} height={H}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "monospace",
              fontSize: 12,
              fontWeight: 500,
              textAlign: "center",
              pointerEvents: "none",
              userSelect: "none",
              padding: "0 5px",
            }}
          >
            {nodeDatum.name.length > 24
              ? `${nodeDatum.name.slice(0, 24)}...`
              : nodeDatum.name}
          </div>
        </foreignObject>
      </g>
    );
  };
  return (
    <PageContainer centerLayout={false} bgColor="#fff">
      <div className="w-full h-screen flex">
        <style jsx>{`
          .detroit-path {
            stroke: #000;
            stroke-width: 2;
            fill: none;
            stroke-linecap: round;
            opacity: 0.9;
          }
          .detroit-path:hover {
            stroke: #444;
            stroke-width: 3;
          }
        `}</style>
        <style jsx global>{`
          /* react-d3-tree のデフォルト文字色(黒)を上書き */
          .rd3t-node text {
            fill: #fff !important;
            stroke: none;
          }
          .rd3t-node text tspan {
            fill: #fff !important;
          }
        `}</style>
        <Sidebar />

        <div
          id="treeWrapper"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {/* グラデーション等不要になったため defs を削除 */}
          <Tree
            data={branchStructure}
            pathFunc="diagonal"
            separation={{ siblings: 2.5, nonSiblings: 3 }}
            translate={{ x: 300, y: 310 }}
            nodeSize={{ x: 300, y: 120 }}
            renderCustomNodeElement={renderCustomNode}
            zoomable
            enableLegacyTransitions
            initialDepth={2}
            pathClassFunc={() => "detroit-path"}
          />
        </div>
        <FormGroup className="w-30 flex  items-center">
          <FormLabel component="legend">merge mode (モノクロ)</FormLabel>
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
    </PageContainer>
  );
}
