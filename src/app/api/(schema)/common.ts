import z from "zod";

export const base64ImageSchema = z.string().refine(
  (data) => {
    // data:image/で始まるBase64文字列かチェック
    const base64ImageRegex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    return base64ImageRegex.test(data);
  },
  {
    message: "有効な画像のBase64データである必要があります",
  },
);
