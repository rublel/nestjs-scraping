import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({ example: 'femme' })
  section: string;
  @ApiProperty({ example: 'vetements' })
  category: string;
  @ApiProperty({ example: 'Pantalon de trek montagne résistant Homme - MT500' })
  title: string;
  @ApiProperty({ example: 'FORCLAZ' })
  brand: string;
  @ApiProperty({ example: 'Bermude' })
  category?: string;
  @ApiProperty({ example: 'gris noir' })
  color?: string;
  @ApiProperty({ example: '8853731' })
  reference?: string;
  img: string;
  @ApiProperty({
    example:
      'https://www.decathlon.fr/p/pantalon-de-trek-montagne-resistant-homme-mt500/_/R-p-351265?mc=8853731&c=gris_noir',
  })
  link: string;
  @ApiProperty({ example: '€' })
  currency?: string;
  @ApiProperty({ example: 36 })
  price: number | string;
  @ApiProperty({ example: true })
  withDiscount?: boolean;
  @ApiProperty({ example: 'Livraison en 48h' })
  delivery?: string;
  @ApiProperty({ example: 40 })
  beforeDiscount?: number | string;
  @ApiProperty({ example: 4 })
  discountAmount?: number | string;
  @ApiProperty({ example: 'Offre valable jusqu’au 31/12/2021' })
  discountDateInfo?: string;

  constructor(product: Omit<Product, 'formatPriceToNumber'>) {
    const url = new URLSearchParams(new URL(product.link).search);
    this.section = product.section;
    this.category = product.category;
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
      .replace(/\n|\t/g, '')
      .trim();
  }

  private formatPriceToNumber(price) {
    return price
      ? Number(price?.trim()?.replace('-', '')?.replace('€', ''))
      : undefined;
  }
}
