import { Container, Typography } from "@mui/material";
import type React from "react";
interface PageContainerProps {
  /**
   * ページのタイトル
   * (省略可)
   */
  title?: string;
  /**
   * ページのコンテンツ
   */
  children: React.ReactNode;
  /**
   * デフォルトのセンタリングレイアウトを使用するかどうか
   * false にすると、幅・高さ100%で素のコンテナとして機能
   */
  centerLayout?: boolean;
  /** 背景色 */
  bgColor?: string;
}

/**
 * ページのコンテンツをラップするコンテナコンポーネント
 */
const PageContainer: React.FC<PageContainerProps> = ({
  title,
  children,
  centerLayout = true,
  bgColor = "transparent",
}) => (
  <Container
    maxWidth={false}
    disableGutters
    sx={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: centerLayout ? "center" : "stretch",
      justifyContent: centerLayout ? "center" : "flex-start",
      backgroundColor: bgColor,
    }}
  >
    {!!title && <Typography variant="h4">{title}</Typography>}
    {children}
  </Container>
);

export default PageContainer;
