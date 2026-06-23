import { describe, test, expect } from "vitest";
import { normalizeURL, getHeadingFromHTML, getFirstParagraphFromHTML } from "./crawl";

describe("normalizeURL", () => {
  test("strips the protocol", () => {
    expect(normalizeURL("https://blog.boot.dev/path")).toBe(
      "blog.boot.dev/path"
    );
  });

  test("strips the protocol (http)", () => {
    expect(normalizeURL("http://blog.boot.dev/path")).toBe(
      "blog.boot.dev/path"
    );
  });

  test("strips trailing slash", () => {
    expect(normalizeURL("https://blog.boot.dev/path/")).toBe(
      "blog.boot.dev/path"
    );
  });

  test("converts to lowercase", () => {
    expect(normalizeURL("https://BLOG.boot.dev/path")).toBe(
      "blog.boot.dev/path"
    );
  });

  test("strips default port 443 for https", () => {
    expect(normalizeURL("https://blog.boot.dev:443/path")).toBe(
      "blog.boot.dev/path"
    );
  });

  test("strips default port 80 for http", () => {
    expect(normalizeURL("http://blog.boot.dev:80/path")).toBe(
      "blog.boot.dev/path"
    );
  });

  test("handles bare domain with no path", () => {
    expect(normalizeURL("https://blog.boot.dev")).toBe("blog.boot.dev");
  });

  test("handles query parameters by stripping them", () => {
    expect(normalizeURL("https://blog.boot.dev/path?q=hello")).toBe(
      "blog.boot.dev/path"
    );
  });

  test("handles fragment by stripping it", () => {
    expect(normalizeURL("https://blog.boot.dev/path#heading")).toBe(
      "blog.boot.dev/path"
    );
  });

  test("handles multiple trailing slashes", () => {
    expect(normalizeURL("https://blog.boot.dev/path///")).toBe(
      "blog.boot.dev/path"
    );
  });
});

describe("getHeadingFromHTML", () => {
  test("returns h1 text content", () => {
    const html = `<html><body><h1>Test Title</h1></body></html>`;
    expect(getHeadingFromHTML(html)).toEqual("Test Title");
  });

  test("falls back to h2 if no h1 present", () => {
    const html = `<html><body><h2>Subtitle</h2><p>Some text</p></body></html>`;
    expect(getHeadingFromHTML(html)).toEqual("Subtitle");
  });

  test("prefers h1 over h2 when both exist", () => {
    const html = `<html><body><h2>Secondary</h2><h1>Primary</h1></body></html>`;
    expect(getHeadingFromHTML(html)).toEqual("Primary");
  });

  test("returns empty string if no h1 or h2", () => {
    const html = `<html><body><p>Just a paragraph</p></body></html>`;
    expect(getHeadingFromHTML(html)).toEqual("");
  });
});

describe("getFirstParagraphFromHTML", () => {
  test("returns first paragraph text from main if present", () => {
    const html = `
      <html><body>
        <p>Outside paragraph.</p>
        <main>
          <p>Main paragraph.</p>
        </main>
      </body></html>
    `;
    expect(getFirstParagraphFromHTML(html)).toEqual("Main paragraph.");
  });

  test("falls back to first p tag if no main element", () => {
    const html = `<html><body><p>First paragraph</p><p>Second</p></body></html>`;
    expect(getFirstParagraphFromHTML(html)).toEqual("First paragraph");
  });

  test("returns empty string if no p tags exist", () => {
    const html = `<html><body><h1>Title only</h1></body></html>`;
    expect(getFirstParagraphFromHTML(html)).toEqual("");
  });

  test("handles nested content in paragraph", () => {
    const html = `<html><body><p>Hello <strong>world</strong>!</p></body></html>`;
    expect(getFirstParagraphFromHTML(html)).toEqual("Hello world!");
  });
});
