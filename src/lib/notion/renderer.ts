// Render blok Notion menjadi HTML string
export function renderBlocks(blocks: any[]): string {
  let html = '';

  for (const block of blocks) {
    const type = block.type;
    const data = block[type];

    switch (type) {
      case 'paragraph': {
        const text = data.rich_text?.map((t: any) => t.plain_text).join('') || '';
        html += `<p>${text}</p>`;
        break;
      }
      case 'heading_1': {
        const text = data.rich_text?.map((t: any) => t.plain_text).join('') || '';
        html += `<h1>${text}</h1>`;
        break;
      }
      case 'heading_2': {
        const text = data.rich_text?.map((t: any) => t.plain_text).join('') || '';
        html += `<h2>${text}</h2>`;
        break;
      }
      case 'heading_3': {
        const text = data.rich_text?.map((t: any) => t.plain_text).join('') || '';
        html += `<h3>${text}</h3>`;
        break;
      }
      case 'bulleted_list_item':
      case 'numbered_list_item': {
        const text = data.rich_text?.map((t: any) => t.plain_text).join('') || '';
        html += `<li>${text}</li>`;
        break;
      }
      case 'to_do': {
        const checked = data.checked ? 'checked' : '';
        const text = data.rich_text?.map((t: any) => t.plain_text).join('') || '';
        html += `<input type="checkbox" ${checked} disabled> ${text}<br>`;
        break;
      }
      case 'image': {
        const url = data.file?.url || data.external?.url || '';
        if (url) {
          html += `<img src="${url}" alt="image" style="max-width:100%;" />`;
        }
        break;
      }
      case 'divider': {
        html += `<hr />`;
        break;
      }
      case 'quote': {
        const text = data.rich_text?.map((t: any) => t.plain_text).join('') || '';
        html += `<blockquote>${text}</blockquote>`;
        break;
      }
      case 'code': {
        const text = data.rich_text?.map((t: any) => t.plain_text).join('') || '';
        const language = data.language || 'plaintext';
        html += `<pre><code class="language-${language}">${text}</code></pre>`;
        break;
      }
      default: {
        // fallback
        if (data.rich_text) {
          const text = data.rich_text.map((t: any) => t.plain_text).join('');
          html += `<div>${text}</div>`;
        }
        break;
      }
    }
  }

  return html;
}
