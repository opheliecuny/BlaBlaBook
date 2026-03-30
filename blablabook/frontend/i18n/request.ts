import { getRequestConfig } from 'next-intl/server';
import { readFile } from 'fs/promises';
import path from 'path';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'fr';

  const loadMessages = async (namespace: string) => {
    const filePath = path.join(process.cwd(), 'messages', locale, `${namespace}.json`);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content);
  };

  const [common, home, navbar, footer, book] = await Promise.all([
    loadMessages('common'),
    loadMessages('home'),
    loadMessages("navbar"),
    loadMessages("footer"),
    loadMessages("book"),
  ]);

  return {
    locale,
    messages: {
      common,
      home,
      navbar,
      footer,
      book
    }
  };
});