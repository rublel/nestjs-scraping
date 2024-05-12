import { Injectable } from '@nestjs/common';
import cheerio from 'cheerio';
import { Product } from './product.entity';
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
  }): Promise<{ totalSize: number; records: Product[] }> {
    const cacheKey = `${section}-${category}-${from}-${size}`;
    if (this.LocalCache[cacheKey]) return this.LocalCache[cacheKey];

    const url = `https://www.decathlon.fr/${section}/${category}?from=${from}&size=${size}`,
      response = await fetch(url),
      html = await response.text(),
      $ = cheerio.load(html),
      totalSize = Number(
        $('.plp-var-info--content .vtmn-whitespace-nowrap').text(),
      ),
      records: Product[] = [];
    $('div[class^="product-block-top-main"]').each((index, element) => {
      const e = $(element);
      const delivery = e.find('.dpb-leadtime').text(),
        title = e.find('.product-title h2').text(),
        brand = e.find('.product-title strong').text(),
        price = e.find('.vtmn-price_size--large').text(),
        img = e.find('.svelte-11itto').attr('src'),
        link = `https://www.decathlon.fr${e.find('.dpb-product-model-link').attr('href')}`,
        discountAmount = e.find('.price-discount-amount').text(),
        discountDateInfo = e.find('.discount-date').text(),
        beforeDiscount = e
          .find('.price-discount-informations .vtmn-price')
          .text();

      const product = new Product({
        title,
        brand,
        img,
        link,
        price,
        beforeDiscount,
        discountAmount,
        delivery,
        ...(discountDateInfo && { discountDateInfo }),
      });

      records.push(product);
    });

    this.LocalCache = {
      ...this.LocalCache,
      [cacheKey]: { totalSize, records },
    };

    return { totalSize, records };
  }

  async getProductData({ section, category, id }) {
    const data = await this.exec({ section, category });
    if (!data.records.length) return new Error('No records found');
    const totalProducts = data.totalSize;
    let product = data.records.find((record) => record.reference === id);
    if (!product) {
      const numberOfBatches = Math.ceil(totalProducts / 40) - 1;
      const promises = Array.from({ length: numberOfBatches }, (_, i) => {
        return this.exec({ section, category, from: 40 * (i + 1), size: 40 });
      });
      const results = await Promise.all(promises);
      const records = results.flatMap((result) => result.records);
      product = records.find((record) => record.reference === id) || null;
    }
    if (!product) return new Error('Product not found');
    return { record: product };
  }
}
