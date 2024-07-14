import { Injectable } from '@nestjs/common';
import cheerio from 'cheerio';
@Injectable()
export class ScrapperService {
  private LocalCache = {};
  constructor() {
    setInterval(
      () => {
        this.LocalCache = {};
      },
      1000 * 60 * 60 * 24,
    );
  }
  async exec({
    section,
    category,
    from,
    size,
  }: {
    section: string;
    category?: string;
    from?: number;
    size?: number;
  }): Promise<{ totalSize: number; records: any[] }> {
    const cacheKey = `${section}-${category}-${from}-${size}`;
    if (this.LocalCache[cacheKey]) return this.LocalCache[cacheKey];
    const url = `https://www.kvl.ro/catalog/${category}/p3`,
      response = await fetch(url),
      html = await response.text(),
      $ = cheerio.load(html),
      records: any[] = [];
    $('div[class^="product product--grid"]').each((index, element) => {
      const e = $(element);
      const reference = '10271719.VERTJUNGLE';
      const title = e.find('.product__name').text().replace(/\n|\t/g, '');
      const [brand] = title.split(' -');
      const category = e
        .find('.product__category')
        .text()
        .replace(/\n|\t/g, '');
      const img = e.find('.grid-image__image').attr('src');
      const link = e.find('.grid-image__link').attr('href');
      const price = parseFloat(
        e
          .find('.product__info.product__info--price-gross span')
          .text()
          .replace(/\n|\t/g, ''),
      );
      const beforeDiscount = parseFloat(
        e
          .find('.product__info.product__info--old-price-gross span')
          .text()
          .replace(/\n|\t/g, ''),
      );
      const discountAmount = beforeDiscount - price;
      const withDiscount = discountAmount > 0;
      const currency = 'RON';
      records.push({
        reference,
        title,
        brand,
        category,
        price,
        beforeDiscount,
        discountAmount,
        withDiscount,
        currency,
        img,
        link,
      });
    });

    const totalSize = records.length;
    this.LocalCache = {
      ...this.LocalCache,
      [cacheKey]: { totalSize, records },
    };
    console.log(`Records found: ${records.length}`);
    return { totalSize, records };
  }

  async search({ section, category, reference }) {
    const data = await this.exec({ section, category });
    if (!data.records.length) return new Error('No records found');
    const totalProducts = data.totalSize;
    let product = data.records.find((record) => record.reference === reference);
    if (!product) {
      const numberOfBatches = Math.ceil(totalProducts / 40) - 1;
      const promises = Array.from({ length: numberOfBatches }, (_, i) => {
        return this.exec({ section, category, from: 40 * (i + 1), size: 40 });
      });
      const results = await Promise.all(promises);
      const records = results.flatMap((result) => result.records);
      product =
        records.find((record) => record.reference === reference) || null;
    }
    if (!product) return new Error('Product not found');
    return { record: product };
  }
}
