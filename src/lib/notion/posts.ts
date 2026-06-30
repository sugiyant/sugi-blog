import { notion, databaseId } from './client';

export async function getAllPosts() {
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
    return {
      id: page.id,
      slug: props.Slug?.rich_text?.[0]?.plain_text || '',
      title: props.Title?.title?.[0]?.plain_text || 'Untitled',
      date: props.Date?.date?.start || '',
      excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || '',
    };
  });
}

export async function getPostBySlug(slug: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  if (response.results.length === 0) return null;

  const page = response.results[0];
  const props = page.properties;

  const blocksResponse = await notion.blocks.children.list({
    block_id: page.id,
  });

  return {
    id: page.id,
    slug,
    title: props.Title?.title?.[0]?.plain_text || 'Untitled',
    date: props.Date?.date?.start || '',
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || '',
    blocks: blocksResponse.results,
  };
}

export function renderBlocks(blocks: any[]) {
  let html = '';
  for (const block of blocks) {
    const type = block.type;
    const data = block[type];
    if (!data) continue;

    const richText = data.rich_text?.map((t: any) => t.plain_text).join('') || '';

    switch (type) {
      case 'paragraph':
        html += `<p>${richText}</p>`;
        break;
      case 'heading_1':
        html += `<h1>${richText}</h1>`;
        break;
      case 'heading_2':
        html += `<h2>${richText}</h2>`;
        break;
      case 'heading_3':
        html += `<h3>${richText}</h3>`;
        break;
      case 'bulleted_list_item':
        html += `<li>${richText}</li>`;
        break;
      case 'numbered_list_item':
        html += `<li>${richText}</li>`;
        break;
      case 'to_do':
        html += `<input type="checkbox" ${data.checked ? 'checked' : ''} disabled> ${richText}<br>`;
        break;
      case 'image':
        const url = data.file?.url || data.external?.url || '';
        if (url) html += `<img src="${url}" alt="image" style="max-width:100%;">`;
        break;
      case 'divider':
        html += `<hr>`;
        break;
      case 'quote':
        html += `<blockquote>${richText}</blockquote>`;
        break;
      case 'code':
        html += `<pre><code class="language-${data.language || 'plaintext'}">${richText}</code></pre>`;
        break;
      default:
        html += `<div>${richText}</div>`;
    }
  }
  return html;
}
