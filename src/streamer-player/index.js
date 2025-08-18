import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  ignoreDefaultArgs: ["--mute-audio"],
  args: [
    "--autoplay-policy=no-user-gesture-required",
    "--ignore-certificate-errors",
  ],
});

const page = await browser.newPage();

await page.goto("https://192.168.68.56:3000/streamer-client");
