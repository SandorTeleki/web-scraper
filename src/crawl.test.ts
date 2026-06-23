import { describe, test, expect } from "vitest";
import { normalizeURL } from "./crawl";

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
