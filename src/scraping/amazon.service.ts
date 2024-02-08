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
        page.goto(
          'https://c.howazit.com/m/CampaignReview/ShowReview?reviewId=5746600820&token=133519461549024192%253AcRhv5QOvBVMkWudv632tUVADX03xALJykedAcwgURE3P_wTLInVEhLrHwQ99X7l34oWk8S_-RnbGFq3pGD8Y4gOgNSUgdLg22qPHDcL0a998JICJ6Ms4z63wnpkcqtPj4dVT9GzvWscYOk4RRwf3xREssLswX3Is5RWWkgHlc_8&utm_campaign=I%7C5746600818%7C5746600817&utm_source=B%7C2373455389%7C1215931365&utm_medium=F%7C3351211410&_hwz.i=5746600819&_hwz.t=133519461549034217%3AETeMbC18zYrCjwsa-dJfYKzjj0MdbaczGo22I1vcVyWg4-60PXNQwtYSRbeSdcwM-sTxuYt2LIEWvwv-Il_6FW3fut5Lb0v8muNMCKdkyG1gEI8Jv-kFle0YWyZbXI3KJvTsuEQpUzquwj8mGi9YcLivPNd5vD9YIBv9k8P9bb0',
          {
            waitUntil: 'domcontentloaded',
          },
        ),
      ]);
      const timer = 10000;

      await new Promise((resolve) => setTimeout(resolve, timer));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const retryFn = async (fn, retriesLeft = 5, interval = 10000) => {
        try {
          console.log('Retries left:', retriesLeft);
          return await fn();
        } catch (error) {
          if (retriesLeft) {
            await new Promise((resolve) => setTimeout(resolve, interval));
            return retryFn(fn, retriesLeft - 1);
          }
          throw new Error('Max retries reached');
        }
      };

      await retryFn(
        async () => {
          await page.waitForSelector('li[num="1"]');
          await page.click('li[num="1"]');
        },
        5,
        10000,
      );

      await retryFn(
        async () => {
          await page.waitForSelector('#send');
          await page.click('#send');
        },
        5,
        10000,
      );

      await retryFn(
        async () => {
          const num = '0587091495';
          const input = await page.$('#inputVal');
          input.type(num);
        },
        5,
        10000,
      );

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
      // return html2;
    } finally {
    }
  }
}
