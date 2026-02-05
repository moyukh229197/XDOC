import { test, expect } from "@playwright/test";

const routes = ["/", "/search", "/doctors/dr-sen", "/book/dr-sen", "/clinic", "/auth"];

test.describe("XDOC smoke", () => {
  for (const route of routes) {
    test(`loads ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveTitle(/XDOC/);
      await expect(page.locator("body")).toBeVisible();
    });
  }

  test("book now navigates from home", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Book now" }).first().click();
    await expect(page).toHaveURL(/\/book\/dr-sen/);
    await expect(page.getByRole("heading", { name: /Confirm your appointment/i })).toBeVisible();
  });
});
