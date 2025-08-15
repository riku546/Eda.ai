import { Gemini } from "../(LLM)/gemini";
import { ProjectRepository } from "../(Repository)/project";
import type { NewChatInput } from "../(schema)/project/chat";

const projectRepository = new ProjectRepository();
const gemini = new Gemini();

export class ProjectController {
  createChat = async (input: NewChatInput) => {
    const [summary, resFromLLM] = await Promise.all([
      gemini.generateContent(undefined, {
        text: gemini.generateSummaryPrompt(input.inputText),
      }),
      gemini.generateContent(undefined, {
        text: input.inputText,
        file: { data: input.inputFile ?? undefined },
      }),
    ]);

    const result = await projectRepository.createChat(
      summary,
      input.projectId,
      input.inputText,
      input.inputFile,
      resFromLLM,
    );

    return result;
  };
}
