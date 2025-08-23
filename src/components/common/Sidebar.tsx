import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DehazeIcon from "@mui/icons-material/Dehaze";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import type { Chat } from "@prisma/client";
import type React from "react";
import { useState } from "react";

// Define placeholder interfaces for the props
interface Project {
  id: string;
  name: string;
}

interface SidebarProps {
  projects: Project[];
  chats: Chat[];
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ projects, chats }) => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const toggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          top: 8,
          left: openDrawer ? drawerWidth : 0,
          zIndex: 1201,
          backgroundColor: "primary.main",
          borderRadius: "0 10px 10px 0",
          width: 40,
          height: 60,
          "&:hover": {
            backgroundColor: "primary.dark",
          },
          transition: "left 0.23s ease",
        }}
        aria-label="メニューを開く"
      >
        {openDrawer ? <ChevronLeftIcon /> : <DehazeIcon />}
      </IconButton>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        anchor="left"
        open={openDrawer}
        onClose={toggleDrawer}
      >
        <List
          subheader={
            <ListSubheader component="div" id="project-list-subheader">
              プロジェクト
            </ListSubheader>
          }
        >
          {projects.map((project) => (
            <ListItem key={project.id} disablePadding>
              <ListItemButton>
                <ListItemText primary={project.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List
          subheader={
            <ListSubheader component="div" id="chat-list-subheader">
              チャット
            </ListSubheader>
          }
        >
          {chats.map((chat) => (
            <ListItem key={chat.id} disablePadding>
              <ListItemButton>
                <ListItemText primary={chat.summary} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
