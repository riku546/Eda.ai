export const fileToBase64 = (files: File[]): Promise<string[]> => {
  if (files.length === 0) {
    return Promise.reject(new Error("ファイルが指定されていません"));
  }

  const promises = files.map((file) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          //data:imgage/png;base64部分を無くして、base64のデータ部分のみを返す,
          const s = reader.result;
          const commaIndex = s.indexOf(",");
          const base64 = s.substring(commaIndex + 1);
          resolve(base64);
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
