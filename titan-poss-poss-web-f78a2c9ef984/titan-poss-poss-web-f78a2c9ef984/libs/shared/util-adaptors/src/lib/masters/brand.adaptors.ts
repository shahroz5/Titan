import { Brand, BrandSummary } from '@poss-web/shared/models';

export class BrandAdaptor {
  static brandDataFromJson(data: any): Brand {
    return {
      brandCode: data.brandCode,
      configDetails: data.configDetails,
      description: data.description,
      isActive: data.isActive,
      orgCode: data.orgCode,
      parentBrandCode: data.parentBrandCode,
      customerDetails: data.customerDetails,
      panCardDetails: data.panCardDetails,
      brandTcsDetails: data.brandTcsDetails
    };
  }
  static brandSummaryDataFromJson(data: any): BrandSummary[] {
    const brandData: BrandSummary[] = [];
    for (const brand of data.results) {
      brandData.push({
        brandCode: brand.brandCode,
        description: brand.description
      });
    }
    return brandData;
  }
}
