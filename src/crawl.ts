import { JSDOM } from "jsdom";

export function normalizeURL(url: string): string {
  const parsed = new URL(url);
  // host is already lowercase and excludes default ports
  let path = parsed.pathname;
  // Strip trailing slashes
  path = path.replace(/\/+$/, "");
  return `${parsed.hostname}${path}`;
}

export function getHeadingFromHTML(html: string): string {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const h1 = doc.querySelector("h1");
  if (h1) {
    return h1.textContent?.trim() ?? "";
  }

  const h2 = doc.querySelector("h2");
  if (h2) {
    return h2.textContent?.trim() ?? "";
  }

  return "";
}

export function getFirstParagraphFromHTML(html: string): string {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const main = doc.querySelector("main");
  if (main) {
    const p = main.querySelector("p");
    if (p) {
      return p.textContent?.trim() ?? "";
    }
  }

  const p = doc.querySelector("p");
  if (p) {
    return p.textContent?.trim() ?? "";
  }

  return "";
}

export function getURLsFromHTML(html: string, baseURL: string): string[] {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const anchors = doc.querySelectorAll("a");
  const urls: string[] = [];

  for (const anchor of anchors) {
    const href = anchor.getAttribute("href");
    if (!href) continue;

    try {
      const resolved = new URL(href, baseURL);
      urls.push(resolved.href);
    } catch {
      // skip invalid URLs
    }
  }

  return urls;
}

export function getImagesFromHTML(html: string, baseURL: string): string[] {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const images = doc.querySelectorAll("img");
  const urls: string[] = [];

  for (const img of images) {
    const src = img.getAttribute("src");
    if (!src) continue;

    try {
      const resolved = new URL(src, baseURL);
      urls.push(resolved.href);
    } catch {
      // skip invalid URLs
    }
  }

  return urls;
}

export interface ExtractedPageData {
  url: string;
  heading: string;
  first_paragraph: string;
  outgoing_links: string[];
  image_urls: string[];
}

export function extractPageData(html: string, pageURL: string): ExtractedPageData {
  return {
    url: pageURL,
    heading: getHeadingFromHTML(html),
    first_paragraph: getFirstParagraphFromHTML(html),
    outgoing_links: getURLsFromHTML(html, pageURL),
    image_urls: getImagesFromHTML(html, pageURL),
  };
}

export async function getHTML(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "BootCrawler/1.0",
      },
    });

    if (response.status >= 400) {
      console.error(`Error: received status code ${response.status} for ${url}`);
      return;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      console.error(`Error: expected content-type text/html, got ${contentType} for ${url}`);
      return;
    }

    return await response.text();
  } catch (err) {
    console.error(`Error fetching ${url}: ${err}`);
    return;
  }
}
