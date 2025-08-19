import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import type React from "react";

// Define placeholder interfaces for the props
interface Project {
  id: string;
  name: string;
}

interface Chat {
  id: string;
  title: string;
}

interface SidebarProps {
  projects: Project[];
  chats: Chat[];
  onProjectSelect: (id: string) => void;
  onChatSelect: (id: string) => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({
  projects,
  chats,
  onProjectSelect,
  onChatSelect,
}) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
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
            <ListItemButton onClick={() => onProjectSelect(project.id)}>
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
            <ListItemButton onClick={() => onChatSelect(chat.id)}>
              <ListItemText primary={chat.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
