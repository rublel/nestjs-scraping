export class Product {
  title: string;
  brand: string;
  color?: string;
  reference?: string;
  img: string;
  link: string;
  currency?: string;
  price: number | string;
  withDiscount?: boolean;
  delivery?: string;
  beforeDiscount?: number | string;
  discountAmount?: number | string;
  discountDateInfo?: string;

  constructor(product: Omit<Product, 'formatPriceToNumber'>) {
    const url = new URLSearchParams(new URL(product.link).search);

    this.title = product.title;
    this.brand = product.brand;
    this.color = url.get('c')?.replace('_', ' ') || 'N/A';
    this.reference = url.get('mc');
    this.img = product.img;
    this.link = product.link;
    this.currency = '€';
    this.price = this.formatPriceToNumber(product.price);
    this.withDiscount = product.discountDateInfo?.length > 0;
    this.delivery = product.delivery;
    this.beforeDiscount = this.formatPriceToNumber(product.beforeDiscount);
    this.discountAmount = this.formatPriceToNumber(product.discountAmount);
    this.discountDateInfo = product.discountDateInfo
      ?.replace('*', '')
      .replace(/\n/g, '')
      .trim();
  }

  private formatPriceToNumber(price) {
    return price
      ? Number(price?.trim()?.replace('-', '')?.replace('€', ''))
      : undefined;
  }
}
