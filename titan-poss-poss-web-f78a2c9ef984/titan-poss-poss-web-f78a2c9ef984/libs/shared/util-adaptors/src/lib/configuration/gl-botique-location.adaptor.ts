import {
  GlBoutiqueLocationSuccessPayload,
  GlBoutiqueLocationList
} from '@poss-web/shared/models';

export class GlBoutiqueLocationAdaptor {
  static glBoutiqueLocationListing: GlBoutiqueLocationSuccessPayload;

  static getGlBoutiqueLocationListing(
    data: any
  ): GlBoutiqueLocationSuccessPayload {
    const glBoutiqueLocationList: GlBoutiqueLocationList[] = [];
    for (const listItem of data.results) {
      glBoutiqueLocationList.push({
        costCenter: listItem.costCenter ? listItem.costCenter : '',
        fitCode: listItem.fitCode ? listItem.fitCode : '',
        glCode: listItem.glCode ? listItem.glCode : '',
        pifSeriesNo: listItem.pifSeriesNo ? listItem.pifSeriesNo : '000000',
        locationCode: listItem.locationCode ? listItem.locationCode : '',
        isActive: listItem.isActive ? listItem.isActive : false
      });
    }

    this.glBoutiqueLocationListing = {
      glBoutiqueLocationListing: glBoutiqueLocationList,
      totalElements: data.totalElements
    };
    return this.glBoutiqueLocationListing;
  }

  static getGlBoutiqueLocationSearch(data: any): GlBoutiqueLocationList[] {
    const glBoutiqueLocation: GlBoutiqueLocationList[] = [];
    glBoutiqueLocation.push({
      fitCode: data.fitCode ? data.fitCode : '',
      costCenter: data.costCenter ? data.costCenter : '',
      glCode: data.glCode ? data.glCode : '',
      pifSeriesNo: data.pifSeriesNo ? data.pifSeriesNo : '000000',
      locationCode: data.locationCode ? data.locationCode : '',
      isActive: data.isActive
    });

    return glBoutiqueLocation;
  }
  static getGlBoutiqueByLocation(): GlBoutiqueLocationList {
    const glBoutiqueLocation: GlBoutiqueLocationList = {
      fitCode: '',
      costCenter: '',
      glCode: '',
      pifSeriesNo: '',
      locationCode: '',
      isActive: true
    };

    return glBoutiqueLocation;
  }
}
