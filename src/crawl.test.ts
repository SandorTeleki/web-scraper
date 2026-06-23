import { describe, test, expect } from "vitest";
import { normalizeURL, getHeadingFromHTML, getFirstParagraphFromHTML, getURLsFromHTML, getImagesFromHTML } from "./crawl";

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

describe("getURLsFromHTML", () => {
  test("converts relative URLs to absolute URLs", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>`;
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/path/one"];
    expect(actual).toEqual(expected);
  });

  test("handles absolute URLs as-is", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><a href="https://other.com/page">Link</a></body></html>`;
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://other.com/page"];
    expect(actual).toEqual(expected);
  });

  test("finds all anchor tags in the body", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `
      <html><body>
        <a href="/one">One</a>
        <a href="/two">Two</a>
        <a href="https://external.com/three">Three</a>
      </body></html>
    `;
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = [
      "https://crawler-test.com/one",
      "https://crawler-test.com/two",
      "https://external.com/three",
    ];
    expect(actual).toEqual(expected);
  });

  test("skips anchor tags without href", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><a>No href</a><a href="/valid">Valid</a></body></html>`;
    const actual = getURLsFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/valid"];
    expect(actual).toEqual(expected);
  });
});

describe("getImagesFromHTML", () => {
  test("converts relative image URLs to absolute URLs", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><img src="/logo.png" alt="Logo"></body></html>`;
    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/logo.png"];
    expect(actual).toEqual(expected);
  });

  test("handles absolute image URLs as-is", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><img src="https://cdn.example.com/photo.jpg" alt="Photo"></body></html>`;
    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://cdn.example.com/photo.jpg"];
    expect(actual).toEqual(expected);
  });

  test("finds all img tags in the body", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `
      <html><body>
        <img src="/one.png" alt="One">
        <img src="/two.jpg" alt="Two">
        <img src="https://cdn.com/three.gif" alt="Three">
      </body></html>
    `;
    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = [
      "https://crawler-test.com/one.png",
      "https://crawler-test.com/two.jpg",
      "https://cdn.com/three.gif",
    ];
    expect(actual).toEqual(expected);
  });

  test("skips img tags without src attribute", () => {
    const inputURL = "https://crawler-test.com";
    const inputBody = `<html><body><img alt="No src"><img src="/valid.png" alt="Valid"></body></html>`;
    const actual = getImagesFromHTML(inputBody, inputURL);
    const expected = ["https://crawler-test.com/valid.png"];
    expect(actual).toEqual(expected);
  });
});
