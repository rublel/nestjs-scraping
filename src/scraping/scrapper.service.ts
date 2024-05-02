import { Injectable } from '@nestjs/common';
import cheerio from 'cheerio';
@Injectable()
export class ScrapperService {
  async exec({ gender, category, from, size }) {
    const url = `https://www.decathlon.fr/${gender}/${category}?from=${from}&size=${size}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const totalSize = Number(
      $('.plp-var-info--content .vtmn-whitespace-nowrap').text(),
    );
    const products = [];
    $('div[class^="product-block-top-main"]').each((index, element) => {
      const delivery = $(element).find('.dpb-leadtime').text();
      const title = $(element).find('.product-title h2').text();
      const brand = $(element).find('.product-title strong').text();
      const price = $(element).find('.vtmn-price_size--large').text().trim();
      const beforeDiscount = $(element)
        .find('.price-discount-informations .vtmn-price')
        .text()
        .trim();
      const discountAmount = $(element)
        .find('.price-discount-amount')
        .text()
        .trim();
      const img = $(element).find('.svelte-11itto').attr('src');
      const discountDate = $(element)
        .find('.discount-date')
        .text()
        .trim()
        .replace('*', '');
      const link =
        'https://www.decathlon.fr' +
        $(element).find('.dpb-product-model-link').attr('href');
      const reference = new URLSearchParams(new URL(link).search).get('mc');
      const color = new URLSearchParams(new URL(link).search)
        .get('c')
        ?.replace('_', ' ');

      products.push({
        title,
        brand,
        reference,
        color,
        img,
        link,
        currency: '€',
        price: this.formatPriceToNumber(price),
        withDiscount: discountDate.length > 0,
        beforeDiscount: this.formatPriceToNumber(beforeDiscount),
        discountAmount: this.formatPriceToNumber(discountAmount),
        ...(discountDate && { discountDate }),
        delivery,
      });
    });

    return { totalSize, records: products };
  }

  private formatPriceToNumber(price) {
    return price
      ? Number(price?.trim()?.replace('-', '')?.replace('€', ''))
      : undefined;
  }
}
