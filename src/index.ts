import { getHTML } from "./crawl";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Error: no URL provided. Usage: npm run start <url>");
    process.exit(1);
  }

  if (args.length > 1) {
    console.error("Error: too many arguments. Usage: npm run start <url>");
    process.exit(1);
  }

  const baseURL = args[0];
  console.log(`Starting crawler at: ${baseURL}`);

  const html = await getHTML(baseURL);
  if (html) {
    console.log(html);
  }
}

main();
