import { prisma } from "@/lib/prisma";

export const updateInstruction = async (
  projectId: string,
  instruction: string,
) => {
  await prisma.project.update({
    where: { id: projectId },
    data: { instruction },
  });
};

export const getChatList = async (projectId: string) => {
  return await prisma.chatInProject.findMany({
    where: { projectId },
    include: { branches: true },
  });
};
