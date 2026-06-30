import { Client } from '@notionhq/client';

const token = import.meta.env.NOTION_TOKEN || process.env.NOTION_TOKEN;
const dbId = import.meta.env.NOTION_DATABASE_ID || process.env.NOTION_DATABASE_ID;

if (!token) throw new Error('NOTION_TOKEN is not set');
if (!dbId) throw new Error('NOTION_DATABASE_ID is not set');

export const notion = new Client({ auth: token });
export const databaseId = dbId;
