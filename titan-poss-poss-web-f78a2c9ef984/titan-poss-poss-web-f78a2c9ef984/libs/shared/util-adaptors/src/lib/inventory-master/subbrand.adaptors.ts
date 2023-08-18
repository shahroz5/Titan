import { BrandListing, BrandMaster } from '@poss-web/shared/models';

export class SubBrandMasterAdaptors {
  static getSubBrandMasterList(data: any): BrandListing {
    const brandList: BrandMaster[] = [];
    let brandListData: BrandListing;
    for (const brandlistdata of data.results) {
      brandList.push({
        brandCode: brandlistdata.brandCode ? brandlistdata.brandCode : '',
        description: brandlistdata.description ? brandlistdata.description : '',
        parentBrandCode: brandlistdata.parentBrandCode
          ? brandlistdata.parentBrandCode
          : '',
        orgCode: brandlistdata.orgCode ? brandlistdata.orgCode : '',
        isActive: brandlistdata.isActive,
        configDetails: brandlistdata.configDetails
          ? brandlistdata.configDetails
          : ''
      });
    }
    brandListData = {
      results: brandList,
      totalElements: data.totalElements
    };

    return brandListData;
  }

  static getParentBrandMasterList(data: any): any {
    const parentBrandList: any = [];

    for (const brandlistdata of data.results) {
      parentBrandList.push({
        brandCode: brandlistdata.brandCode ? brandlistdata.brandCode : '',
        parentBrandCode: brandlistdata.parentBrandCode
          ? brandlistdata.parentBrandCode
          : ''
      });
    }

    return parentBrandList;
  }

  static getSearchSubBrandByBrandCodeData(data: any): BrandListing {
    const brandMasterData: BrandMaster[] = [];
    let brandList: BrandListing;
    brandMasterData.push({
      brandCode: data.brandCode ? data.brandCode : '',
      description: data.description ? data.description : '',
      parentBrandCode: data.parentBrandCode ? data.parentBrandCode : '',
      configDetails: data.configDetails ? data.configDetails : '',
      orgCode: data.orgCode ? data.orgCode : '',
      isActive: data.isActive
    });
    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    brandList = {
      results: brandMasterData,
      totalElements: totalElements
    };
    return brandList;
  }

  static getAllSubBrandDetailsBySubBrandCode(data): BrandMaster {
    let brandMasterData: BrandMaster;
    if (data) {
      brandMasterData = {
        brandCode: data.brandCode ? data.brandCode : '',
        description: data.description ? data.description : '',
        parentBrandCode: data.parentBrandCode ? data.parentBrandCode : '',
        configDetails: data.configDetails ? data.configDetails : '',
        orgCode: data.orgCode ? data.orgCode : '',
        isActive: data.isActive ? data.isActive : ''
      };
    } else {
      brandMasterData = {
        brandCode: '',
        description: '',
        parentBrandCode: '',
        configDetails: null,
        orgCode: '',
        isActive: data.isActive ? data.isActive : false
      };
    }
    return brandMasterData;
  }

  static getOnlyBrandDetails(data: any): BrandMaster {
    if (data !== null) {
      let brandDetails: BrandMaster;
      brandDetails = {
        brandCode: data.brandCode ? data.brandCode : '',
        parentBrandCode: data.parentBrandCode ? data.parentBrandCode : '',
        orgCode: data.orgCode ? data.orgCode : '',
        description: data.description ? data.description : '',
        isActive: data.isActive,
        configDetails: {
          subBrandConfig: {
            isActive: data.configDetails
              ? data.configDetails.subBrandDetails
                ? data.configDetails.subBrandDetails
                : ''
              : ''
          },
          brandConfigDetails: {
            brandName: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.brandName
                : ''
              : '',
            brandShortName: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.brandShortName
                : ''
              : '',
            cashRefundLimit: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.cashRefundLimit
                : ''
              : '',
            ULPServiceURL: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.ULPServiceURL
                : ''
              : '',
            // dummyMobNo: data.configDetails
            //   ? data.configDetails.brandConfigDetails
            //     ? data.configDetails.brandConfigDetails.dummyMobNo
            //     : ''
            //   : '',
            brandDetailsCheckBox: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails.brandDetailsCheckBox
                : ''
              : '',

            minUtilizationPercentageforGRN: data.configDetails
              ? data.configDetails.brandConfigDetails
                ? data.configDetails.brandConfigDetails
                    .minUtilizationPercentageforGRN
                  ? data.configDetails.brandConfigDetails
                      .minUtilizationPercentageforGRN
                  : ''
                : ''
              : ''
          }
        }
      };
      return brandDetails;
    }
  }
}
