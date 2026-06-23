# Web Scraper

This project is based on the Boot.dev course [Build a Web Scraper in TypeScript](https://www.boot.dev/courses/build-web-scraper-typescript).

## What It Does

A concurrent web crawler that starts from a given URL and recursively visits all internal pages on the same domain. For each page it extracts:

- The page heading (h1 or h2)
- The first paragraph
- All outgoing links
- All image URLs

After crawling, it writes a `report.json` file containing the extracted data for every visited page, sorted by URL.

## Installation

```
git clone https://github.com/SandorTeleki/web-scraper.git
cd web-scraper
npm install
```

## Usage

```
npm run start <url> [maxConcurrency] [maxPages]
```

- `url` — the root URL to start crawling from (required)
- `maxConcurrency` — number of concurrent fetch requests (default: 5)
- `maxPages` — maximum number of unique pages to crawl (default: 100)

### Example

```
npm run start https://learnwebscraping.dev/practice/ecommerce/ 3 10
```

This crawls up to 10 pages starting from the ecommerce practice site with 3 concurrent requests, then writes the results to `report.json`.

## Running Tests

```
npm run test
```
