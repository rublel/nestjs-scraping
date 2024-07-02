import { Injectable } from '@nestjs/common';
import { HierarchyConfig } from '../config/catalog/hierarchy';
import { ScrapperService } from 'src/scraping/scrapper.service';
import axios from 'axios';
import { Product } from 'src/scraping/entities/product.entity';

@Injectable()
export class GCSService {
  constructor(private readonly scrapperService: ScrapperService) {}

  async uploadImage(image: Buffer, name: string) {
    const { data }: any = await axios
      .post(
        `https://storage.googleapis.com/upload/storage/v1/b/visual-search-bucket/o?uploadType=media&name=decathlon/${name}&key=AIzaSyDgo_MXIDscgE_0drDLe41VKGUOIieVuN0`,
        image,
        {
          headers: {
            'Content-Type': 'image/jpeg',
          },
        },
      )
      .catch((e) => {
        console.log(e.response.data);
      });
    return data;
  }

  async exec() {
    return await Promise.all(
      HierarchyConfig.map(async (config) => {
        console.log(`Processing ${config.section}...`);
        const { section, categories } = config;
        const itemsByCategory = await Promise.all(
          categories.map((category) => {
            console.log(`Processing ${category}...`);
            return this.getItems({
              section,
              category,
              from: 1,
              size: 10,
            });
          }),
        );
        const products = itemsByCategory.flat();
        console.log('Products', products);
        const productNames = await Promise.all(
          products.map((product) => this.createProduct(product)),
        );

        return await Promise.all(
          productNames.map((productName, index) =>
            this.linkImageToProduct(products[index].img, productName),
          ),
        );
      }),
    );
  }

  async downloadBeforeUpload(imageUrl: string) {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    return response.data;
  }

  async getItems({ section, category, from, size }) {
    console.log(`Getting items from ${section} - ${category}`);
    const { totalSize } = await this.scrapperService.exec({
      section,
      category,
      from,
      size,
    });
    const batchNumber = Math.ceil(totalSize / size);
    const promises = Array.from({ length: batchNumber - 1 }, (_, i) => {
      return this.scrapperService.exec({
        section,
        category,
        from: size * (i + 1),
        size,
      });
    });
    const results = await Promise.all(promises);
    console.log('Results', results);
    return results.flatMap((result) => result.records);
  }

  async createProduct(item: Product) {
    console.log('Creating product', item);
    const product = {
      displayName: item.title,
      productCategory: 'apparel-v2',
      description: item.delivery,
      productLabels: [
        {
          key: 'retailer',
          value: 'Decathlon',
        },
        {
          key: 'style',
          value: item.section,
        },
        {
          key: 'category',
          value: item.category,
        },
        {
          key: 'brand',
          value: item.brand,
        },
        {
          key: 'price',
          value: `${item.price} ${item.currency}`,
        },
        {
          key: 'color',
          value: item.color,
        },
        {
          key: 'reference',
          value: item.reference,
        },
      ],
    };
    console.log(product);
    const response: any = await axios
      .post(
        `https://vision.googleapis.com/v1/projects/devops-tribe/locations/us-west1/products?key=AIzaSyDgo_MXIDscgE_0drDLe41VKGUOIieVuN0`,
        product,
      )
      .catch((e) => {
        console.log(e.response.data);
      });
    const productName = response.data.name;
    await this.addProductToProductSet(productName);
    return productName;
  }

  async addProductToProductSet(productName: string) {
    console.log('productName', productName);
    //409fddfc470db26c
    const response: any = await axios
      .post(
        `https://vision.googleapis.com/v1/projects/devops-tribe/locations/us-west1/productSets/5b2eb3e30d78ce32:addProduct?key=AIzaSyDgo_MXIDscgE_0drDLe41VKGUOIieVuN0`,
        {
          product: productName,
        },
      )
      .catch((e) => {
        console.log(e);
      });
    return response.data;
  }

  async linkImageToProduct(uri: string, productName: string) {
    const productId = productName.split('/').pop();
    console.log(productId);
    const buffer = await this.downloadBeforeUpload(uri);
    await this.uploadImage(buffer, `${productId}_0.jpg`);
    const image = {
      uri: `gs://visual-search-bucket/decathlon/${productId}_0.jpg`,
    };
    const response: any = await axios
      .post(
        `https://vision.googleapis.com/v1/projects/devops-tribe/locations/us-west1/products/${productId}/referenceImages?key=AIzaSyDgo_MXIDscgE_0drDLe41VKGUOIieVuN0`,
        image,
      )
      .catch((e) => {
        console.log(e.response.data);
      });
    return response.data;
  }
}
