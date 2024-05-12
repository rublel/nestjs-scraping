export interface Product {
  title: string;
  brand: string;
  color: string;
  reference: string;
  img: string;
  link: string;
  currency: string;
  price: number;
  withDiscount: boolean;
  delivery?: string;
  beforeDiscount?: number;
  discountAmount?: number;
  discountDateInfo?: string;
}
