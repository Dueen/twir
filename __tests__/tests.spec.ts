import path from "path";
import fs from "fs";
import { test, expect } from "@playwright/test";

import type { Page } from "@playwright/test";
import type { Issues } from "@/scripts/prebuild.mjs";

const metadataPath = path.join("content", "meta.json");
const metadata: Issues = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
//prettier-ignore
const getDate = (issue: Issues[number]) => String(new Date(issue.date).getFullYear())
const years = [...new Set(metadata.map(getDate))];

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

      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("nav")).toBeVisible();

      await expect(page).toHaveTitle(issue.title);
    });
  }
});

test.describe.parallel("Test filtering", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("/");
    expect(page.locator("id=toolbar")).toBeDefined();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("should filter by date", async () => {
    const firstArticle = page.locator(":nth-match(article, 1)");

    const latestIssueTitle = metadata[metadata.length - 1].title;
    const earliestIssueTitle = metadata[0].title;

    // Expect issues to be sorted by newest as default
    await expect(firstArticle.locator("a")).toHaveText(latestIssueTitle);

    // Filter by oldest
    await page.locator("#sort-by-oldest").click();
    await expect(firstArticle.locator("a")).toHaveText(earliestIssueTitle);

    // Filter by newest
    await page.locator("#sort-by-newest").click();
    await expect(firstArticle.locator("a")).toHaveText(latestIssueTitle);
  });

  test("should filter by year", async () => {
    await Promise.all(
      years.map(async (year) => {
        const yearLink = page.locator(`#year-${year}`);
        expect(yearLink).toBeDefined();
        await yearLink.click();
      })
    );
  });
});
