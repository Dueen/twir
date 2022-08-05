import path from "path";
import fs from "fs";
import { test, expect, type Page } from "@playwright/test";

const metadataPath = path.join("content", "meta.json");
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

test.describe.configure({ mode: "parallel" });

test.describe.parallel("Test all issues", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  for (const issue of metadata) {
    test(`should render issue ${issue.id}`, async () => {
      await page.goto(`/${issue.id}`);

      expect(await page.title()).toBe(issue.title);
    });
  }
});
