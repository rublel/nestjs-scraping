import { Injectable } from '@nestjs/common';
import cheerio from 'cheerio';
@Injectable()
export class ScrapperService {
  async exec({ section, category, from, size }) {
    const url = `https://www.decathlon.fr/${section}/${category}?from=${from}&size=${size}`,
      response = await fetch(url),
      html = await response.text(),
      $ = cheerio.load(html),
      totalSize = Number(
        $('.plp-var-info--content .vtmn-whitespace-nowrap').text(),
      ),
      records = [];
    $('div[class^="product-block-top-main"]').each((index, element) => {
      const e = $(element);
      const delivery = e.find('.dpb-leadtime').text(),
        title = e.find('.product-title h2').text(),
        brand = e.find('.product-title strong').text(),
        price = e.find('.vtmn-price_size--large').text().trim(),
        img = e.find('.svelte-11itto').attr('src'),
        link = `https://www.decathlon.fr${e.find('.dpb-product-model-link').attr('href')}`,
        urlParams = new URLSearchParams(new URL(link).search),
        color = urlParams.get('c')?.replace('_', ' '),
        reference = urlParams.get('mc'),
        discountAmount = e.find('.price-discount-amount').text(),
        discountDate = e.find('.discount-date').text().replace('*', ''),
        beforeDiscount = e
          .find('.price-discount-informations .vtmn-price')
          .text();

      records.push({
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

    return { totalSize, records };
  }

  private formatPriceToNumber(price) {
    return price
      ? Number(price?.trim()?.replace('-', '')?.replace('€', ''))
      : undefined;
  }

  async getProductData({ section, category, id }) {
    let from = 0;
    let data = await this.exec({ section, category, from, size: 40 });
    let product = data.records.find((record) => record.reference === id);
    if (!product) {
      while (!product) {
        from += 40;
        data = await this.exec({ section, category, from, size: 40 });
        product = data.records.find((record) => record.reference === id);
      }
    }
    return { record: product };
  }
}
