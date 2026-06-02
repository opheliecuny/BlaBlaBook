import { getRequestConfig } from "next-intl/server";
import { readFileSync } from "fs";
import { join } from "path";

function loadMessages(locale: string) {
  const dir = join(process.cwd(), "messages", locale);
  const load = (file: string) =>
    JSON.parse(readFileSync(join(dir, file), "utf-8"));

  return {
    book: load("book.json"),
    cgu: load("cgu.json"),
    common: load("common.json"),
    home: load("home.json"),
    legal: load("legal.json"),
    library: load("library.json"),
    loading: load("loading.json"),
    login: load("login.json"),
    privacy: load("privacy.json"),
    profile: load("profile.json"),
    register: load("register.json"),
    search: load("search.json"),
    components: {
      addToLibraryButton: load("components/addToLibraryButton.json"),
      addToLibraryPanel: load("components/addToLibraryPanel.json"),
      expandableDescription: load("components/expandableDescription.json"),
      footer: load("components/footer.json"),
      languageToggle: load("components/languageToggle.json"),
      navbar: load("components/navbar.json"),
      searchBookActions: load("components/searchBookActions.json"),
      shareButton: load("components/shareButton.json"),
    },
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? "fr";
  return {
    locale,
    messages: loadMessages(locale),
  };
});
