import { getRequestConfig } from "next-intl/server";
import { readFile, readdir } from "fs/promises";
import path from "path";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? "fr";

  const loadMessages = async (namespace: string) => {
    const filePath = path.join(
      process.cwd(),
      "messages",
      locale,
      `${namespace}.json`,
    );
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content);
  };

  const [
    common,
    home,
    book,
    cgu,
    legal,
    library,
    login,
    privacy,
    profile,
    register,
    search,
  ] = await Promise.all([
    loadMessages("common"),
    loadMessages("home"),
    loadMessages("book"),
    loadMessages("cgu"),
    loadMessages("legal"),
    loadMessages("library"),
    loadMessages("login"),
    loadMessages("privacy"),
    loadMessages("profile"),
    loadMessages("register"),
    loadMessages("search"),
  ]);

  let components = {};
  try {
    const componentsDir = path.join(
      process.cwd(),
      "messages",
      locale,
      "components",
    );
    const componentFiles = await readdir(componentsDir);

    const componentsEntries = await Promise.all(
      componentFiles.map(async (file) => {
        const name = path.parse(file).name;
        const content = await readFile(path.join(componentsDir, file), "utf-8");
        return [name, JSON.parse(content)];
      }),
    );

    components = Object.fromEntries(componentsEntries);
  } catch (err) {
    console.warn(
      `No component messages found for locale "${locale}". Skipping components.`,
      err,
    );
    components = {};
  }

  return {
    locale,
    messages: {
      common,
      home,
      book,
      cgu,
      legal,
      library,
      login,
      privacy,
      profile,
      register,
      search,
      components,
    },
  };
});
