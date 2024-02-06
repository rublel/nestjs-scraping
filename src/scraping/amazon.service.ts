import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer-core';

@Injectable()
export class AmazonService {
  constructor(private readonly configService: ConfigService) {}

  async getProducts(products: string) {
    const browser = await puppeteer.launch({
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
      args: ['--no-sandbox'],
    });
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);
      await Promise.all([
        page.waitForNavigation(),
        page.goto('https://amazon.com'),
      ]);
      await page.type('#twotabsearchtextbox', products);
      await Promise.all([
        page.waitForNavigation(),
        page.click('#nav-search-submit-button'),
      ]);
      return await page.$$eval(
        '.s-search-results .s-card-container',
        (resultItems) => {
          return resultItems.map((resultItem) => {
            const url = resultItem.querySelector('a').href;
            const title = resultItem.querySelector(
              '.s-title-instructions-style span',
            )?.textContent;
            const price = resultItem.querySelector(
              '.a-price .a-offscreen',
            ).textContent;
            return {
              url,
              title,
              price,
            };
          });
        },
      );
    } finally {
      await browser.close();
    }
  }

  async IEC() {
    const browser = await puppeteer.launch({
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: false,
      defaultViewport: null,
    });
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);

      await Promise.all([
        page.waitForNavigation(),
        page.goto('https://c.howazit.com/e/3351211416?abts=1707249802229', {
          waitUntil: 'domcontentloaded',
        }),
      ]);
      await page.waitForSelector('#inputDiv', {
        visible: true,
        timeout: 0,
      }),
        await page.waitForSelector('#inputDiv', {
          visible: true,
          timeout: 0,
        });
      const titleHandle = await page.$('title');
      const html = await page.evaluate(
        (title) => title.textContent,
        titleHandle,
      );
      await titleHandle.dispose();
      console.log(html);

      await page.evaluate(() => {
        document.title = 'New title';
      });

      const bodyHandle = await page.$('body');
      const html2 = await page.evaluate((body) => body.innerHTML, bodyHandle);
      await bodyHandle.dispose();
      console.log(html2);
      return html2;
    } finally {
      await browser.close();
    }
  }
}
