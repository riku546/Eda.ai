interface MakeInputResult {
  promptText: string;
  promptFiles: { data: string; mimeType: string }[] | null;
}

export const makeInput = async (
  text: string,
  files: File[] | null,
  handleEncodedFiles: (files: File[] | null) => Promise<string[] | null>,
): Promise<MakeInputResult> => {
  const encodedFiles = await handleEncodedFiles(files);
  const promptFiles: { data: string; mimeType: string }[] = [];

  if (files && encodedFiles) {
    files.forEach((file, index) => {
      const encodedFile = encodedFiles[index];
      if (encodedFile && file instanceof File) {
        promptFiles.push({ data: encodedFile, mimeType: file.type });
      }
    });
  }

  return {
    promptText: text,
    promptFiles: promptFiles.length > 0 ? promptFiles : null,
  };
};
