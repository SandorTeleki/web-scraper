import { crawlSiteAsync } from "./crawl";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Error: no URL provided. Usage: npm run start <url> [maxConcurrency] [maxPages]");
    process.exit(1);
  }

  if (args.length > 3) {
    console.error("Error: too many arguments. Usage: npm run start <url> [maxConcurrency] [maxPages]");
    process.exit(1);
  }

  const baseURL = args[0];
  const maxConcurrency = args[1] ? parseInt(args[1], 10) : 5;
  const maxPages = args[2] ? parseInt(args[2], 10) : 100;

  console.log(`Starting crawler at: ${baseURL}`);
  console.log(`Max concurrency: ${maxConcurrency}, Max pages: ${maxPages}`);

  const pages = await crawlSiteAsync(baseURL, maxConcurrency, maxPages);

  console.log("Finished crawling.");
  const firstPage = Object.values(pages)[0];
  if (firstPage) {
    console.log(
      `First page record: ${firstPage["url"]} - ${firstPage["heading"]}`,
    );
  }
}

main();
