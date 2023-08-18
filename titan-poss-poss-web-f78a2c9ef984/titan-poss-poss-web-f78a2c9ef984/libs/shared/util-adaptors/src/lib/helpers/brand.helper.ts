import { Brand } from '@poss-web/shared/models';
import { BrandAdaptor } from '../masters/brand.adaptors';
export class BrandHelper {
  static getBrands(data: any): Brand[] {
    const brands: Brand[] = [];
    for (const brand of data) {
      brands.push(BrandAdaptor.brandDataFromJson(brand));
    }
    return brands;
  }
}
