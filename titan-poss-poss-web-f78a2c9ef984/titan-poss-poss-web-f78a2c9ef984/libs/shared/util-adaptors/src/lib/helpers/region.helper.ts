import { Region } from '@poss-web/shared/models';
import { RegionAdaptor } from '../masters/region.adaptors';
export class RegionHelper {
  static getRegions(data: any): Region[] {
    const regions: Region[] = [];
    for (const region of data) {
      regions.push(RegionAdaptor.regionDataFromJson(region));
    }
    return regions;
  }
}
