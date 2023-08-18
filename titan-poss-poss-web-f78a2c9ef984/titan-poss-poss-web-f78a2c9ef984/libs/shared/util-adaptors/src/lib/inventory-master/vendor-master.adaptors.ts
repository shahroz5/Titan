import { VendorMasterListing, VendorMaster } from '@poss-web/shared/models';

export class VendorMasterAdaptor {
  static getVendorMasterList(data: any): VendorMasterListing {
    let vendorMasterListing: VendorMasterListing;
    let totalElements: number;
    const vendorMaster: VendorMaster[] = [];
    for (const vendorMasterItem of data.results) {
      vendorMaster.push({
        vendorCode: vendorMasterItem.vendorCode,
        vendorType: vendorMasterItem.vendorType,
        vendorName: vendorMasterItem.vendorName,
        vendorDetail: vendorMasterItem?.vendorDetails?.data,
        baseUrl: vendorMasterItem.baseurl,
        isActive: vendorMasterItem.isActive
      });
    }
    totalElements = data.totalElements;
    vendorMasterListing = {
      results: vendorMaster,
      totalElements: totalElements
    };
    return vendorMasterListing;
  }

  static getSearchedVendorMasterList(
    vendorMasterItem: any
  ): VendorMasterListing {
    let vendorMasterListing: VendorMasterListing;
    let totalElements: number;
    const vendorMaster: VendorMaster[] = [];

    vendorMaster.push({
      vendorCode: vendorMasterItem.vendorCode,
      vendorType: vendorMasterItem.vendorType,
      vendorName: vendorMasterItem.vendorName,
      vendorDetail: vendorMasterItem?.vendorDetails?.data,
      baseUrl: vendorMasterItem.baseurl,
      isActive: vendorMasterItem.isActive
    });

    totalElements = 1;
    vendorMasterListing = {
      results: vendorMaster,
      totalElements: totalElements
    };
    return vendorMasterListing;
  }

  static getVendorMasterByCodeData(vendorMasterItem): VendorMaster {
    let vendorMaster: VendorMaster;
    vendorMaster = {
      vendorCode: vendorMasterItem.vendorCode,
      vendorType: vendorMasterItem.vendorType,
      vendorName: vendorMasterItem.vendorName,
      vendorDetail: vendorMasterItem?.vendorDetails?.data,
      baseUrl: vendorMasterItem.baseurl,
      isActive: vendorMasterItem.isActive
    };
    return vendorMaster;
  }
}
