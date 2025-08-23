interface MakeInputResult {
  promptText: string;
  promptFiles: string[] | null;
}

export const makeInput = async (
  text: string,
  files: File[] | null,
  handleEncodedFiles: (files: File[] | null) => Promise<string[] | null>,
): Promise<MakeInputResult> => {
  const encodedFiles = await handleEncodedFiles(files);
  return { promptText: text, promptFiles: encodedFiles ? encodedFiles : null };
};
