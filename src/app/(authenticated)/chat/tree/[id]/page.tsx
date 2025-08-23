"use client";

import { useEffect, useState } from "react";

import Tree, { type RawNodeDatum } from "react-d3-tree";

const Page = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 }); // `translate`の状態を管理

  useEffect(() => {
    const handleResize = () => {
      // ウィンドウの幅と高さを取得

      const newX = window.innerWidth / 2 - 100;

      const newY = window.innerHeight / 2;

      setTranslate({ x: newX, y: newY });
    };

    // 初期ロード時とウィンドウのリサイズ時にハンドラーを実行

    handleResize();

    window.addEventListener("resize", handleResize);

    // クリーンアップ関数

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //todo ここのデータをapiで取得するように変更する

  const data: RawNodeDatum = {
    name: "root",

    children: [
      { name: "child1" },

      { name: "child2", children: [{ name: "child3" }, { name: "child4" }] },
    ],
  };

  return (
    <div className="w-full h-screen">
      <div
        id="treeWrapper"
        style={{
          width: "100%",

          height: "100%",
        }}
      >
        <Tree
          data={data}
          translate={translate}
          enableLegacyTransitions={true}
          zoomable={true}
        />
      </div>
    </div>
  );
};

export default Page;
