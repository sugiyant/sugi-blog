// Fungsi untuk merender blok Notion menjadi HTML string
export function renderBlocks(blocks) {
  if (!blocks || blocks.length === 0) return '';

  let html = '';

  for (const block of blocks) {
    const type = block.type;
    const data = block[type];
    if (!data) continue;

    // Fungsi bantu untuk mengambil teks dari rich_text
    const getText = (richTextArray) => {
      if (!richTextArray) return '';
      return richTextArray.map((t) => t.plain_text).join('');
    };

    switch (type) {
      case 'paragraph':
        html += `<p>${getText(data.rich_text)}</p>`;
        break;
      case 'heading_1':
        html += `<h1>${getText(data.rich_text)}</h1>`;
        break;
      case 'heading_2':
        html += `<h2>${getText(data.rich_text)}</h2>`;
        break;
      case 'heading_3':
        html += `<h3>${getText(data.rich_text)}</h3>`;
        break;
      case 'bulleted_list_item':
        html += `<li>${getText(data.rich_text)}</li>`;
        break;
      case 'numbered_list_item':
        html += `<li>${getText(data.rich_text)}</li>`;
        break;
      case 'to_do':
        const checked = data.checked ? 'checked' : '';
        html += `<div><input type="checkbox" ${checked} disabled> ${getText(data.rich_text)}</div>`;
        break;
      case 'image': {
        const url = data.file?.url || data.external?.url || '';
        if (url) {
          html += `<img src="${url}" alt="image" style="max-width:100%;height:auto;" />`;
        }
        break;
      }
      case 'divider':
        html += `<hr />`;
        break;
      case 'quote':
        html += `<blockquote>${getText(data.rich_text)}</blockquote>`;
        break;
      case 'code': {
        const code = getText(data.rich_text);
        const language = data.language || 'plaintext';
        html += `<pre><code class="language-${language}">${code}</code></pre>`;
        break;
      }
      default:
        // Fallback: jika ada rich_text, tampilkan
        if (data.rich_text) {
          html += `<div>${getText(data.rich_text)}</div>`;
        }
        break;
    }
  }

  return html;
}
