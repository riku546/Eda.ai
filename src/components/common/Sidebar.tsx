"use client";
import { apiClient } from "@/lib/trpc";
import AddIcon from "@mui/icons-material/Add";
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
import type { Chat, Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const drawerWidth = 240;

const Sidebar = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [projRes, chatRes] = await Promise.all([
          apiClient.project.list.query(),
          apiClient.chat.getChatsByUserId.query(),
        ]);
        setProjects(
          projRes.map((project) => ({
            ...project,
            createdAt: new Date(project.createdAt),
            updatedAt: new Date(project.updatedAt),
          })),
        );
        setChats(
          chatRes.map((chat) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
          })),
        );
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      }
    };
    fetchSidebarData();
  }, []);

  const toggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}/tree/`);
  };

  const handleAddChat = () => {
    router.push("/home");
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
            <ListSubheader
              component="div"
              id="chat-list-subheader"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              チャット
              <AddIcon sx={{ fontSize: 20 }} onClick={handleAddChat} />
            </ListSubheader>
          }
        >
          {chats.map((chat) => (
            <ListItem
              key={chat.id}
              disablePadding
              onClick={() => handleChatClick(chat.id)}
            >
              <ListItemButton>
                <ListItemText primary={chat.summary} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List
          subheader={
            <ListSubheader component="div" id="chat-list-subheader">
              チャット
            </ListSubheader>
          }
        >
          {chats.map((chat) => (
            <ListItem
              key={chat.id}
              disablePadding
              onClick={() => handleChatClick(chat.id)}
            >
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
