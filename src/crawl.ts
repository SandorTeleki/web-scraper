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
