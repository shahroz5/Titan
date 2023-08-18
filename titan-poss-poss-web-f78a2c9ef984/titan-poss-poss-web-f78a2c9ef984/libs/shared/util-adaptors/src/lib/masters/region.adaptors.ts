import { Region, RegionSummary } from '@poss-web/shared/models';

export class RegionAdaptor {
  static regionDataFromJson(data: any): Region {
    return {
      configDetails: data.configDetails,
      description: data.description,
      isActive: data.isActive,
      parentRegionCode: data.parentRegionCode,
      regionCode: data.regionCode,
      orgCode: data.orgCode
    };
  }
  static regionSummaryDataFromJson(data: any): RegionSummary[] {
    const regionData: RegionSummary[] = [];
    for (const region of data.results) {
      regionData.push({
        regionCode: region.regionCode,
        description: region.description
      });
    }
    return regionData;
  }
}
