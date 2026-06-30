import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: import.meta.env.NOTION_TOKEN,
});

export const databaseId = import.meta.env.NOTION_DATABASE_ID;
