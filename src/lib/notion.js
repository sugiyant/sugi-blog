import { Client } from '@notionhq/client';

let notion = null;

function getNotionClient() {
  if (!notion) {
    const token = import.meta.env.NOTION_TOKEN;
    if (!token) throw new Error('NOTION_TOKEN is not set');
    notion = new Client({ auth: token });
  }
  return notion;
}

const databaseId = import.meta.env.NOTION_DATABASE_ID;

export async function getAllPosts() {
  const notion = getNotionClient();
  if (!databaseId) throw new Error('NOTION_DATABASE_ID is not set');

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Status',
      select: {
        equals: 'Published',
      },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  return response.results.map((page) => {
    const props = page.properties;
    const slug = props.Slug?.rich_text?.[0]?.plain_text || '';
    const title = props.Title?.title?.[0]?.plain_text || 'Untitled';
    const date = props.Date?.date?.start || '';
    const excerpt = props.Excerpt?.rich_text?.[0]?.plain_text || '';
    return {
      id: page.id,
      slug,
      title,
      date,
      excerpt,
    };
  });
}

export async function getPostBySlug(slug) {
  const notion = getNotionClient();
  if (!databaseId) throw new Error('NOTION_DATABASE_ID is not set');

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  if (response.results.length === 0) {
    return null;
  }

  const page = response.results[0];
  const props = page.properties;

  // Ambil blok konten
  const blocksResponse = await notion.blocks.children.list({
    block_id: page.id,
  });

  const blocks = blocksResponse.results;

  return {
    id: page.id,
    slug,
    title: props.Title?.title?.[0]?.plain_text || 'Untitled',
    date: props.Date?.date?.start || '',
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || '',
    blocks,
  };
}
