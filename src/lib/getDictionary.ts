import fs from "fs";
import path from "path";

export const getDictionary = async (locale: string | undefined) => {
  const safeLocale = locale ?? "en"; // ✅ Fallback to "en" if locale is undefined
  const filePath = path.join(process.cwd(), "src/locales", `${safeLocale}.json`);



  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    const dictionary = JSON.parse(fileContent);



    return dictionary;
  } catch (error) {
   
    return {error}; // Return empty object if file is missing
  }
};
