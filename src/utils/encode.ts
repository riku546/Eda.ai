export const fileToBase64 = (files: File[]): Promise<string[]> => {
  if (files.length === 0) {
    return Promise.reject(new Error("ファイルが指定されていません"));
  }

  const promises = files.map((file) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("ファイルの読み込みに失敗しました"));
        }
      };

      reader.onerror = () => {
        reject(
          new Error(
            `ファイル "${file.name}" の読み込み中にエラーが発生しました`,
          ),
        );
      };

      reader.readAsDataURL(file);
    });
  });

  return Promise.all(promises);
};
