import { IconButton, Tooltip, alpha } from "@mui/material";
import { memo } from "react";
import type { ElementType, MouseEvent } from "react";

const ToolIcon = memo(function ToolIcon({
  title,
  label,
  Icon,
  onClick,
}: {
  title: string;
  label: string;
  Icon: ElementType;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <Tooltip title={title}>
      <IconButton
        aria-label={label}
        onClick={onClick}
        size="small"
        sx={{
          color: "text.secondary",
          p: 0.75,
          borderRadius: 2,
          "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
});

export default ToolIcon;
