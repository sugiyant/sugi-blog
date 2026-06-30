import { Client } from "@notionhq/client";
import "dotenv/config";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATA_SOURCE_ID = "5c3fe835-07af-471d-aec1-e1c80f466d61";

try {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
  });

  console.log(`Found ${response.results.length} page(s)\n`);

  for (const page of response.results) {
    const props = page.properties;

    console.log("Title:", props.Title?.title?.[0]?.plain_text);
    console.log("Slug:", props.Slug?.rich_text?.[0]?.plain_text);
    console.log("Published:", props.Published?.checkbox);
    console.log("---------------------------");
  }
} catch (err) {
  console.error(err);
}
