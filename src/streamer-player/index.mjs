import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  ignoreDefaultArgs: ["--mute-audio"],
  args: ["--autoplay-policy=no-user-gesture-required"],
});

const page = await browser.newPage();

await page.goto("http://localhost:3000");
